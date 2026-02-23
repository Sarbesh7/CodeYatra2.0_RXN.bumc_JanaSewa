
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from app.config import settings
from app.database import engine, Base, get_db, SessionLocal
from app import models
from app.models import create_default_roles
from app.dependencies import (
    get_current_user,
    get_admin_user,
    require_admin,
    require_superadmin,
    RoleChecker
)
from app.routers import auth, users



@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting JanaSewa Backend...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    db = SessionLocal()
    try:
        create_default_roles(db)
        print("✅ Default roles initialized")
    finally:
        db.close()
    print("✅ Application startup complete")
    print(f"📖 API docs available at: http://127.0.0.1:8000/docs")
    yield
    print("👋 Shutting down JanaSewa Backend...")



app = FastAPI(
    title="JanaSewa API",
    description="JanaSewa Backend API with authentication and role-based authorization.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)



app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code
        }
    )



app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")



@app.get(
    "/",
    tags=["Root"],
    summary="Welcome endpoint",
    description="Returns a welcome message and API information."
)
async def root():
    return {
        "message": "Welcome to JanaSewa API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get(
    "/health",
    tags=["Health"],
    summary="Health check",
    description="Check if the API is running and database is connected."
)
async def health_check(db=Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    return {
        "status": "healthy",
        "database": db_status,
        "version": "1.0.0"
    }



@app.get(
    "/api/v1/dashboard/user",
    tags=["Dashboards"],
    summary="User Dashboard",
    description="Dashboard accessible to all authenticated users."
)
async def user_dashboard(current_user: models.User = Depends(get_current_user)):
    role_names = [role.name for role in current_user.roles]
    return {
        "message": f"Welcome to your dashboard, {current_user.name}!",
        "user_id": current_user.id,
        "email": current_user.email,
        "roles": role_names
    }


@app.get(
    "/api/v1/dashboard/admin",
    tags=["Dashboards"],
    summary="Admin Dashboard",
    description="Dashboard accessible only to admin users.",
    dependencies=[Depends(require_admin)]
)
async def admin_dashboard(current_user: models.User = Depends(get_current_user)):
    return {
        "message": f"Welcome Admin {current_user.name}!",
        "admin_panel": True,
        "capabilities": [
            "manage_users",
            "view_reports",
            "system_settings"
        ]
    }


@app.get(
    "/api/v1/dashboard/superadmin",
    tags=["Dashboards"],
    summary="Superadmin Dashboard",
    description="Dashboard accessible only to superadmin users.",
    dependencies=[Depends(require_superadmin)]
)
async def superadmin_dashboard(current_user: models.User = Depends(get_current_user)):
    return {
        "message": f"Welcome Superadmin {current_user.name}!",
        "system_access": "full",
        "capabilities": [
            "all_admin_capabilities",
            "manage_admins",
            "system_configuration",
            "audit_logs"
        ]
    }


@app.get(
    "/api/v1/example/role-check",
    tags=["Examples"],
    summary="Custom role check example",
    description="Example endpoint with custom role requirements.",
    dependencies=[Depends(RoleChecker(["moderator", "admin", "superadmin"]))]
)
async def moderator_endpoint(current_user: models.User = Depends(get_current_user)):
    return {
        "message": f"Hello {current_user.name}!",
        "access_level": "moderator+",
        "your_roles": [role.name for role in current_user.roles]
    }



@app.get(
    "/",
    tags=["Root"],
    summary="Welcome endpoint",
    description="Returns a welcome message and API information."
)
async def root():
    return {
        "message": "Welcome to JanaSewa API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get(
    "/health",
    tags=["Health"],
    summary="Health check",
    description="Check if the API is running and database is connected."
)
async def health_check(db=Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    return {
        "status": "healthy",
        "database": db_status,
        "version": "1.0.0"
    }

@app.get(
    "/api/v1/dashboard/user",
    tags=["Dashboards"],
    summary="User Dashboard",
    description="Dashboard accessible to all authenticated users."
)
async def user_dashboard(current_user: models.User = Depends(get_current_user)):
    role_names = [role.name for role in current_user.roles]
    return {
        "message": f"Welcome to your dashboard, {current_user.name}!",
        "user_id": current_user.id,
        "email": current_user.email,
        "roles": role_names
    }
    # not updated

@app.get(
    "/api/v1/dashboard/admin",
    tags=["Dashboards"],
    summary="Admin Dashboard",
    description="Dashboard accessible only to admin users.",
    dependencies=[Depends(require_admin)]
)
async def admin_dashboard(current_user: models.User = Depends(get_current_user)):
    return {
        "message": f"Welcome Admin {current_user.name}!",
        "admin_panel": True,
        "capabilities": [
            "manage_users",
            "view_reports",
            "system_settings"
        ]
    }

@app.get(
    "/api/v1/dashboard/superadmin",
    tags=["Dashboards"],
    summary="Superadmin Dashboard",
    description="Dashboard accessible only to superadmin users.",
    dependencies=[Depends(require_superadmin)]
)
async def superadmin_dashboard(current_user: models.User = Depends(get_current_user)):
    return {
        "message": f"Welcome Superadmin {current_user.name}!",
        "system_access": "full",
        "capabilities": [
            "all_admin_capabilities",
            "manage_admins",
            "system_configuration",
            "audit_logs"
        ]
    }

@app.get(
    "/api/v1/example/role-check",
    tags=["Examples"],
    summary="Custom role check example",
    description="Example endpoint with custom role requirements.",
    dependencies=[Depends(RoleChecker(["moderator", "admin", "superadmin"]))]
)
async def moderator_endpoint(current_user: models.User = Depends(get_current_user)):
    return {
        "message": f"Hello {current_user.name}!",
        "access_level": "moderator+",
        "your_roles": [role.name for role in current_user.roles]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
