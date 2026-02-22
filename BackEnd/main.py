from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import models
import schemas
import auth_token
import hashing
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from Config import engine, session
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
import shutil
import random
import string

# Create uploads directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/documents", exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/complaints", exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/official", exist_ok=True)

app = FastAPI(
    title="JanaSewa API",
    description="Smart Citizen Service Portal for Nepal",
    version="1.0.0"
)

# Create all database tables
models.Base.metadata.create_all(bind=engine)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", 
                   "http://localhost:5174", "http://127.0.0.1:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = auth_token.decode_access_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def require_admin(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


def generate_serial():
    year = datetime.now().year
    random_part = ''.join(random.choices(string.digits, k=4))
    return f"JS-{year}-{random_part}"


# ==================== ROOT ====================

@app.get("/", tags=["Root"])
def root():
    return {"message": "Welcome to JanaSewa - Smart Citizen Service Portal"}


# ==================== AUTHENTICATION ====================

@app.post("/api/auth/register", response_model=schemas.UserResponse, tags=["Authentication"])
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = models.User(
        full_name=user.full_name,
        email=user.email,
        password=hashing.Hash.bcrypt(user.password),
        phone=user.phone,
        role=user.role if user.role in ["citizen", "admin"] else "citizen"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/api/auth/login", response_model=schemas.Token, tags=["Authentication"])
def login(request: schemas.UserLogin, db: Session = Depends(get_db)):
    """Login and get JWT token"""
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not hashing.Hash.verify(user.password, request.password):
        raise HTTPException(status_code=401, detail="Invalid password")
    
    access_token = auth_token.create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(hours=24)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "user_name": user.full_name
    }


@app.get("/api/auth/me", response_model=schemas.UserResponse, tags=["Authentication"])
def get_me(current_user: models.User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user


# ==================== SERVICES ====================

@app.get("/api/services", response_model=List[schemas.ServiceResponse], tags=["Services"])
def get_services(
    office_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all active services"""
    query = db.query(models.Service).filter(models.Service.is_active == True)
    if office_type:
        query = query.filter(models.Service.office_type == office_type)
    return query.all()


@app.get("/api/services/{service_id}", response_model=schemas.ServiceResponse, tags=["Services"])
def get_service(service_id: int, db: Session = Depends(get_db)):
    """Get service by ID"""
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service


@app.post("/api/admin/services", response_model=schemas.ServiceResponse, tags=["Admin - Services"])
def create_service(
    service: schemas.ServiceCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    """Admin: Create new service"""
    new_service = models.Service(**service.model_dump())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service


@app.put("/api/admin/services/{service_id}", response_model=schemas.ServiceResponse, tags=["Admin - Services"])
def update_service(
    service_id: int,
    service: schemas.ServiceUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    """Admin: Update service"""
    db_service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    update_data = service.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_service, key, value)
    
    db.commit()
    db.refresh(db_service)
    return db_service


@app.delete("/api/admin/services/{service_id}", tags=["Admin - Services"])
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    """Admin: Delete service"""
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(service)
    db.commit()
    return {"message": "Service deleted successfully"}


# ==================== APPLICATIONS ====================

@app.post("/api/applications", response_model=schemas.ApplicationResponse, tags=["Applications"])
def create_application(
    application: schemas.ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Submit new application"""
    # Verify service exists
    service = db.query(models.Service).filter(models.Service.id == application.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Generate unique serial number
    serial = generate_serial()
    while db.query(models.Application).filter(models.Application.serial_number == serial).first():
        serial = generate_serial()
    
    new_app = models.Application(
        serial_number=serial,
        user_id=current_user.id,
        **application.model_dump()
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app


@app.get("/api/applications", response_model=List[schemas.ApplicationResponse], tags=["Applications"])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get current user's applications"""
    return db.query(models.Application).filter(
        models.Application.user_id == current_user.id
    ).order_by(models.Application.created_at.desc()).all()


@app.get("/api/applications/{application_id}", response_model=schemas.ApplicationWithService, tags=["Applications"])
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get specific application"""
    app = db.query(models.Application).filter(
        models.Application.id == application_id,
        models.Application.user_id == current_user.id
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app


@app.post("/api/applications/{application_id}/upload", tags=["Applications"])
async def upload_application_document(
    application_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Upload document for application"""
    app = db.query(models.Application).filter(
        models.Application.id == application_id,
        models.Application.user_id == current_user.id
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Save file
    filename = f"{application_id}_{datetime.now().timestamp()}_{file.filename}"
    filepath = f"{UPLOAD_DIR}/documents/{filename}"
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update application documents list
    docs = app.documents or []
    docs.append(f"/uploads/documents/{filename}")
    app.documents = docs
    db.commit()
    
    return {"message": "Document uploaded", "path": f"/uploads/documents/{filename}"}


# ==================== APPLICATION TRACKING ====================

@app.get("/api/track/{serial_number}", response_model=schemas.TrackingResponse, tags=["Tracking"])
def track_application(serial_number: str, db: Session = Depends(get_db)):
    """Track application by serial number (public)"""
    app = db.query(models.Application).filter(
        models.Application.serial_number == serial_number
    ).first()
    
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    service = db.query(models.Service).filter(models.Service.id == app.service_id).first()
    
    return {
        "serial_number": app.serial_number,
        "applicant_name": app.applicant_name,
        "service_title": service.title if service else "Unknown Service",
        "status": app.status,
        "created_at": app.created_at,
        "updated_at": app.updated_at,
        "admin_remarks": app.admin_remarks,
        "official_document_path": app.official_document_path
    }


# ==================== ADMIN - APPLICATIONS ====================

@app.get("/api/admin/applications", response_model=List[schemas.ApplicationResponse], tags=["Admin - Applications"])
def get_all_applications(
    status: Optional[str] = None,
    service_id: Optional[int] = None,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    """Admin: Get all applications"""
    query = db.query(models.Application)
    if status:
        query = query.filter(models.Application.status == status)
    if service_id:
        query = query.filter(models.Application.service_id == service_id)
    return query.order_by(models.Application.created_at.desc()).all()


@app.put("/api/admin/applications/{application_id}/status", response_model=schemas.ApplicationResponse, tags=["Admin - Applications"])
def update_application_status(
    application_id: int,
    update: schemas.ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    """Admin: Update application status"""
    app = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    valid_statuses = ["Submitted", "Under Review", "Approved", "Rejected"]
    if update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Use: {valid_statuses}")
    
    app.status = update.status
    if update.admin_remarks:
        app.admin_remarks = update.admin_remarks
    app.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(app)
    return app


@app.post("/api/admin/applications/{application_id}/official-document", tags=["Admin - Applications"])
async def upload_official_document(
    application_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    """Admin: Upload official approved document"""
    app = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    filename = f"official_{app.serial_number}_{file.filename}"
    filepath = f"{UPLOAD_DIR}/official/{filename}"
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    app.official_document_path = f"/uploads/official/{filename}"
    db.commit()
    
    return {"message": "Official document uploaded", "path": app.official_document_path}


# ==================== COMPLAINTS ====================

@app.post("/api/complaints", response_model=schemas.ComplaintResponse, tags=["Complaints"])
def create_complaint(
    complaint: schemas.ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Submit a complaint"""
    new_complaint = models.Complaint(
        user_id=current_user.id,
        **complaint.model_dump()
    )
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    return new_complaint


@app.get("/api/complaints", response_model=List[schemas.ComplaintResponse], tags=["Complaints"])
def get_my_complaints(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get current user's complaints"""
    return db.query(models.Complaint).filter(
        models.Complaint.user_id == current_user.id
    ).order_by(models.Complaint.created_at.desc()).all()


@app.post("/api/complaints/{complaint_id}/upload", tags=["Complaints"])
async def upload_complaint_attachment(
    complaint_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Upload attachment for complaint"""
    complaint = db.query(models.Complaint).filter(
        models.Complaint.id == complaint_id,
        models.Complaint.user_id == current_user.id
    ).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    filename = f"complaint_{complaint_id}_{file.filename}"
    filepath = f"{UPLOAD_DIR}/complaints/{filename}"
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    complaint.attachment_path = f"/uploads/complaints/{filename}"
    db.commit()
    
    return {"message": "Attachment uploaded", "path": complaint.attachment_path}


# ==================== ADMIN - COMPLAINTS ====================

@app.get("/api/admin/complaints", response_model=List[schemas.ComplaintResponse], tags=["Admin - Complaints"])
def get_all_complaints(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    """Admin: Get all complaints"""
    query = db.query(models.Complaint)
    if status:
        query = query.filter(models.Complaint.status == status)
    return query.order_by(models.Complaint.created_at.desc()).all()


@app.put("/api/admin/complaints/{complaint_id}", response_model=schemas.ComplaintResponse, tags=["Admin - Complaints"])
def update_complaint(
    complaint_id: int,
    update: schemas.ComplaintUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    """Admin: Update complaint status and response"""
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    if update.status:
        complaint.status = update.status
    if update.admin_response:
        complaint.admin_response = update.admin_response
    complaint.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(complaint)
    return complaint


# ==================== NOTICES ====================

@app.get("/api/notices", response_model=List[schemas.NoticeResponse], tags=["Notices"])
def get_notices(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all active notices"""
    query = db.query(models.Notice).filter(models.Notice.is_active == True)
    if category:
        query = query.filter(models.Notice.category == category)
    return query.order_by(models.Notice.created_at.desc()).all()


@app.get("/api/notices/{notice_id}", response_model=schemas.NoticeResponse, tags=["Notices"])
def get_notice(notice_id: int, db: Session = Depends(get_db)):
    """Get notice by ID"""
    notice = db.query(models.Notice).filter(models.Notice.id == notice_id).first()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    return notice


# ==================== ADMIN - NOTICES ====================

@app.post("/api/admin/notices", response_model=schemas.NoticeResponse, tags=["Admin - Notices"])
def create_notice(
    notice: schemas.NoticeCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    """Admin: Create notice"""
    new_notice = models.Notice(**notice.model_dump())
    db.add(new_notice)
    db.commit()
    db.refresh(new_notice)
    return new_notice


@app.put("/api/admin/notices/{notice_id}", response_model=schemas.NoticeResponse, tags=["Admin - Notices"])
def update_notice(
    notice_id: int,
    notice: schemas.NoticeUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    """Admin: Update notice"""
    db_notice = db.query(models.Notice).filter(models.Notice.id == notice_id).first()
    if not db_notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    
    update_data = notice.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_notice, key, value)
    
    db.commit()
    db.refresh(db_notice)
    return db_notice


@app.delete("/api/admin/notices/{notice_id}", tags=["Admin - Notices"])
def delete_notice(
    notice_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    """Admin: Delete notice"""
    notice = db.query(models.Notice).filter(models.Notice.id == notice_id).first()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    db.delete(notice)
    db.commit()
    return {"message": "Notice deleted successfully"}


# ==================== ADMIN DASHBOARD STATS ====================

@app.get("/api/admin/stats", response_model=schemas.AdminStats, tags=["Admin - Dashboard"])
def get_admin_stats(
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    """Admin: Get dashboard statistics"""
    return {
        "total_users": db.query(models.User).count(),
        "total_services": db.query(models.Service).count(),
        "total_applications": db.query(models.Application).count(),
        "pending_applications": db.query(models.Application).filter(
            models.Application.status.in_(["Submitted", "Under Review"])
        ).count(),
        "approved_applications": db.query(models.Application).filter(
            models.Application.status == "Approved"
        ).count(),
        "rejected_applications": db.query(models.Application).filter(
            models.Application.status == "Rejected"
        ).count(),
        "total_complaints": db.query(models.Complaint).count(),
        "pending_complaints": db.query(models.Complaint).filter(
            models.Complaint.status == "Pending"
        ).count(),
        "total_notices": db.query(models.Notice).count(),
        "approved_today": db.query(models.Application).filter(
            models.Application.status == "Approved",
            models.Application.updated_at >= datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        ).count()
    }


@app.get("/api/admin/users", response_model=List[schemas.UserResponse], tags=["Admin - Users"])
def get_all_users(
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    """Admin: Get all users"""
    users = db.query(models.User).all()
    return users


# ==================== SEED DATA ====================

@app.post("/api/seed", tags=["Utility"])
def seed_data(db: Session = Depends(get_db)):
    """Seed initial data (services and admin user)"""
    
    # Check if already seeded
    if db.query(models.Service).count() > 0:
        return {"message": "Data already seeded"}
    
    # Create admin user
    admin = models.User(
        full_name="Admin User",
        email="admin@janasewa.gov.np",
        password=hashing.Hash.bcrypt("admin123"),
        role="admin"
    )
    db.add(admin)
    
    # Create services
    services = [
        {
            "title": "Citizenship Certificate",
            "description": "Apply for new citizenship certificate or renewal",
            "required_documents": ["Birth Certificate", "Father/Mother's Citizenship", "Ward Recommendation", "2 Passport Photos"],
            "office_type": "dao",
            "fee": 100.0,
            "estimated_days": 15
        },
        {
            "title": "Driving License",
            "description": "Apply for new driving license or renewal",
            "required_documents": ["Citizenship Copy", "Medical Certificate", "Training Certificate", "2 Passport Photos"],
            "office_type": "yatayat",
            
            "estimated_days": 30
        },
        {
            "title": "Passport",
            "description": "Apply for new passport or renewal",
            "required_documents": ["Citizenship Copy", "Old Passport (if renewal)", "4 Passport Photos", "Online Form Print"],
            "office_type": "passport",
            "fee": 5000.0,
            "estimated_days": 15
        },
        {
            "title": "Tax Clearance",
            "description": "Get tax clearance certificate",
            "required_documents": ["PAN Certificate", "Previous Year Returns", "Bank Statement"],
            "office_type": "tax",
            "fee": 200.0,
            "estimated_days": 7
        },
        {
            "title": "Land Registration",
            "description": "Register land ownership or transfer",
            "required_documents": ["Land Ownership Certificate", "Citizenship Copy", "Tax Receipt", "Agreement Papers"],
            "office_type": "ward",
            "fee": 1000.0,
            "estimated_days": 30
        },
        {
            "title": "Birth Certificate",
            "description": "Apply for birth registration certificate",
            "required_documents": ["Hospital Birth Record", "Parent's Citizenship", "Ward Recommendation"],
            "office_type": "ward",
            "fee": 50.0,
            "estimated_days": 3
        },
        {
            "title": "Marriage Certificate",
            "description": "Register marriage and get certificate",
            "required_documents": ["Both Party's Citizenship", "Passport Photos", "Witnesses"],
            "office_type": "ward",
            "fee": 100.0,
            "estimated_days": 7
        },
        {
            "title": "Business Registration",
            "description": "Register new business or company",
            "required_documents": ["Citizenship Copy", "PAN Certificate", "Rent Agreement", "Photos"],
            "office_type": "municipality",
            "fee": 2000.0,
            "estimated_days": 15
        }
    ]
    
    for s in services:
        db.add(models.Service(**s))
    
    # Create sample notices
    notices = [
        {
            "title": "National Scholarship Program 2082",
            "description": "Applications open for meritorious students from marginalized communities. Apply before Baisakh 15.",
            "category": "Scholarship"
        },
        {
            "title": "Farmer Subsidy for Khet Land",
            "description": "Government subsidy of up to Rs 50,000 for small-scale farmers for seeds and fertilizers.",
            "category": "Agriculture"
        },
        {
            "title": "New Online Passport System",
            "description": "Department of Passports has launched a new online system effective from Magh 1.",
            "category": "Announcement"
        }
    ]
    
    for n in notices:
        db.add(models.Notice(**n))
    
    db.commit()
    
    return {
        "message": "Data seeded successfully",
        "admin_email": "admin@janasewa.gov.np",
        "admin_password": "admin123"
    }



