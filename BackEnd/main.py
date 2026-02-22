from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
import models
import Config, schemas, auth_token, hashing
from sqlalchemy.orm import Session
from datetime import timedelta
from Config import engine, session
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def greet():
    return {"message": "Welcome to JanaSewa"}


@app.post("/users", response_model=schemas.ShowUser, tags=['user'])
def create_user(user: schemas.User, db: Session = Depends(get_db)):
    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashing.Hash.bcrypt(user.password),
        is_admin=user.is_admin
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.get("/all_users/")
def get_all_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@app.delete("/users/{id}", tags=['user'])
def delete_users(id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return {"message": "Deleted Successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")


@app.post("/login", response_model=schemas.Token, tags=['login'])
def login_user(request: schemas.Login, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not hashing.Hash.verify(user.password, request.password):
        raise HTTPException(status_code=401, detail="Invalid Password")

    access_token = auth_token.create_access_token(
        data={'sub': str(user.id)}, expires_delta=timedelta(minutes=15)
    )

    # Determine role and redirect based on is_admin
    if user.is_admin:
        role = "admin"
        redirect_to = "/admin-dashboard"
    else:
        role = "user"
        redirect_to = "/dashboard"

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": role,
        "redirect_to": redirect_to
    }



def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = auth_token.decode_access_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user



@app.get("/admin_dashboard", tags=['admin'])
def admin_dashboard(current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Access forbidden: Admins only")
    return RedirectResponse(url="http://localhost:5173/admin-dashboard", status_code=302)



@app.get("/user_dashboard", tags=['user'])
def user_dashboard(current_user: models.User = Depends(get_current_user)):
    return RedirectResponse(url="http://localhost:5173/", status_code=302)


# ================== CITIZENSHIP APPLICATION ENDPOINTS ==================

@app.post("/citizenship", response_model=schemas.CitizenshipApplicationResponse, tags=['citizenship'])
def create_citizenship_application(
    application: schemas.CitizenshipApplicationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Create a new citizenship application for the logged-in user"""
    new_application = models.CitizenshipApplication(
        user_id=current_user.id,
        applicant_name=application.applicant_name,
        permanent_district=application.permanent_district,
        ward_no=application.ward_no,
        municipality=application.municipality,
        date_of_birth=application.date_of_birth,
        father_name=application.father_name,
        mother_name=application.mother_name,
        gender=application.gender
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application


@app.get("/citizenship", response_model=list[schemas.CitizenshipApplicationResponse], tags=['citizenship'])
def get_user_citizenship_applications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get all citizenship applications for the logged-in user"""
    applications = db.query(models.CitizenshipApplication).filter(
        models.CitizenshipApplication.user_id == current_user.id
    ).all()
    return applications


@app.get("/citizenship/{application_id}", response_model=schemas.CitizenshipApplicationResponse, tags=['citizenship'])
def get_citizenship_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get a specific citizenship application by ID"""
    application = db.query(models.CitizenshipApplication).filter(
        models.CitizenshipApplication.id == application_id,
        models.CitizenshipApplication.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application


@app.get("/admin/citizenship", response_model=list[schemas.CitizenshipApplicationResponse], tags=['admin'])
def get_all_citizenship_applications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Admin endpoint: Get all citizenship applications"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Access forbidden: Admins only")
    
    applications = db.query(models.CitizenshipApplication).all()
    return applications


@app.put("/admin/citizenship/{application_id}/status", response_model=schemas.CitizenshipApplicationResponse, tags=['admin'])
def update_citizenship_status(
    application_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Admin endpoint: Update citizenship application status (pending/approved/rejected)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Access forbidden: Admins only")
    
    if status not in ["pending", "approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status. Use: pending, approved, or rejected")
    
    application = db.query(models.CitizenshipApplication).filter(
        models.CitizenshipApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.status = status
    db.commit()
    db.refresh(application)
    return application



