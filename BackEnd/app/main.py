# =============================================================================
# JanaSewa Backend - Main Application Entry Point
# =============================================================================
# FastAPI application with authentication and role-based authorization.
# Production-ready structure with modular routers and dependencies.
# =============================================================================

from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Application imports
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

# Routers
from app.routers import auth, users


# =============================================================================
# Application Lifespan Events
# =============================================================================
# Handle startup and shutdown events for the application.
# Creates database tables and default roles on startup.
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    
    On Startup:
    - Create database tables
    - Create default roles
    
    On Shutdown:
    - Clean up resources
    """
    # Startup
    print("🚀 Starting JanaSewa Backend...")
    
    # Create all database tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    
    # Create default roles
    db = SessionLocal()
    try:
        create_default_roles(db)
        print("✅ Default roles initialized")
    finally:
        db.close()
    
    print("✅ Application startup complete")
    print(f"📖 API docs available at: http://127.0.0.1:8000/docs")
    
    yield
    
    # Shutdown
    print("👋 Shutting down JanaSewa Backend...")


# =============================================================================
# FastAPI Application Instance
# =============================================================================

app = FastAPI(
    title="JanaSewa API",
    description="""
## JanaSewa Backend API

A secure FastAPI backend with authentication and role-based authorization.

### Features:
- 🔐 **JWT Authentication** - Secure token-based authentication
- 🛡️ **Role-Based Access Control** - Fine-grained authorization
- 👤 **User Management** - Complete CRUD operations
- 📝 **Swagger UI** - Interactive API documentation

### Authentication:
1. Register a new account at `/api/v1/auth/register`
2. Login at `/api/v1/auth/login` to get your JWT token
3. Click the 🔒 **Authorize** button above and enter your token
4. All protected endpoints will now work!

### Roles:
- **user** - Basic access to user endpoints
- **moderator** - Content moderation capabilities
- **admin** - User management and administration
- **superadmin** - Full system access
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)


# =============================================================================
# CORS Middleware Configuration
# =============================================================================
# Configure Cross-Origin Resource Sharing for frontend integration.
# Adjust origins in production!
# =============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # React default
        "http://localhost:5173",      # Vite default
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# Exception Handlers
# =============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler with consistent response format."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code
        }
    )


# =============================================================================
# Include Routers
# =============================================================================
# Mount all routers with API version prefix.
# =============================================================================

app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")


# =============================================================================
# Root and Health Check Endpoints
# =============================================================================

@app.get(
    "/",
    tags=["Root"],
    summary="Welcome endpoint",
    description="Returns a welcome message and API information."
)
async def root():
    """Welcome endpoint with API information."""
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
    """
    Health check endpoint.
    
    Verifies:
    - API is running
    - Database connection is working
    """
    try:
        # Test database connection (SQLAlchemy 2.0 requires text())
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status,
        "version": "1.0.0"
    }


# =============================================================================
# Protected Example Endpoints
# =============================================================================
# Examples demonstrating different authorization levels.
# =============================================================================

@app.get(
    "/api/v1/dashboard/user",
    tags=["Dashboards"],
    summary="User Dashboard",
    description="Dashboard accessible to all authenticated users."
)
async def user_dashboard(current_user: models.User = Depends(get_current_user)):
    """
    User dashboard - accessible to any authenticated user.
    
    Returns personalized greeting with user's roles.
    """
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
    """
    Admin dashboard - requires admin or superadmin role.
    
    Returns admin-specific information.
    """
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
    """
    Superadmin dashboard - requires superadmin role.
    
    Returns system-wide information.
    """
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
    """
    Example endpoint accessible to moderators and above.
    
    Demonstrates custom role checking using RoleChecker dependency.
    """
    return {
        "message": f"Hello {current_user.name}!",
        "access_level": "moderator+",
        "your_roles": [role.name for role in current_user.roles]
    }


# =============================================================================
# Run with Uvicorn (Development)
# =============================================================================
# For development: python main.py
# For production: uvicorn app.main:app --host 0.0.0.0 --port 8000
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,  # Enable auto-reload for development
        log_level="info"
    )
