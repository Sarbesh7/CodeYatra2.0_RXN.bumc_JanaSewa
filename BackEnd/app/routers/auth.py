# =============================================================================
# Authentication Router
# =============================================================================
# Handles user registration, login, token refresh, and password management.
# All authentication-related endpoints are grouped here.
# =============================================================================

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.auth import (
    PasswordManager, 
    TokenManager, 
    create_access_token, 
    create_refresh_token
)
from app.dependencies import get_current_user
from app.config import settings
from app.models import RoleNames

# Create router with prefix and tags for Swagger UI organization
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
    responses={
        401: {"description": "Unauthorized"},
        403: {"description": "Forbidden"},
    }
)


# =============================================================================
# User Registration
# =============================================================================

@router.post(
    "/register",
    response_model=schemas.UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="""
    Register a new user account.
    
    **Password Requirements:**
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    
    The user is automatically assigned the 'user' role upon registration.
    """
)
async def register(
    user_data: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new user account.
    
    Steps:
    1. Check if email already exists
    2. Hash the password
    3. Create user with default 'user' role
    4. Return user data (without password)
    """
    # Check if email already registered
    existing_user = db.query(models.User).filter(
        models.User.email == user_data.email
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password before storing
    hashed_password = PasswordManager.hash_password(user_data.password)
    
    # Create new user
    new_user = models.User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        is_active=True,
        is_verified=False  # Email verification can be implemented later
    )
    
    # Assign default 'user' role
    default_role = db.query(models.Role).filter(
        models.Role.name == RoleNames.USER
    ).first()
    
    if default_role:
        new_user.roles.append(default_role)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


# =============================================================================
# User Login
# =============================================================================

@router.post(
    "/login",
    response_model=schemas.TokenWithRefresh,
    summary="Login and get access token",
    description="""
    Authenticate user and receive JWT tokens.
    
    Returns:
    - **access_token**: Short-lived token for API authentication (30 min)
    - **refresh_token**: Long-lived token for getting new access tokens (7 days)
    - **expires_in**: Token expiration time in seconds
    
    Use the access_token in the Authorization header: `Bearer <token>`
    """
)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Authenticate user and return JWT tokens.
    
    OAuth2PasswordRequestForm is used for Swagger UI compatibility.
    It expects 'username' and 'password' fields (we use email as username).
    """
    # Find user by email (form_data.username = email)
    user = db.query(models.User).filter(
        models.User.email == form_data.username
    ).first()
    
    # Check if user exists
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive. Please contact support."
        )
    
    # Verify password
    if not PasswordManager.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login timestamp
    user.last_login = datetime.now(timezone.utc)
    db.commit()
    
    # Determine primary role and redirect path
    # Checks both is_admin column (set directly in DB) and role assignments
    role_names = [r.name for r in user.roles]
    if user.is_admin or "superadmin" in role_names or "admin" in role_names:
        primary_role = "admin"
        redirect_to = "/admin-dashboard"
    else:
        primary_role = "user"
        redirect_to = "/dashboard"

    # Generate tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.access_token_expire_minutes * 60,
        "role": primary_role,
        "redirect_to": redirect_to,
    }


@router.post(
    "/login/json",
    response_model=schemas.TokenWithRefresh,
    summary="Login with JSON body",
    description="Alternative login endpoint accepting JSON body instead of form data."
)
async def login_json(
    credentials: schemas.LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Login with JSON body for non-form clients.
    """
    user = db.query(models.User).filter(
        models.User.email == credentials.email
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
    
    if not PasswordManager.verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user.last_login = datetime.now(timezone.utc)
    db.commit()

    # Determine primary role and redirect path
    # Checks both is_admin column (set directly in DB) and role assignments
    role_names = [r.name for r in user.roles]
    if user.is_admin or "superadmin" in role_names or "admin" in role_names:
        primary_role = "admin"
        redirect_to = "/admin-dashboard"
    else:
        primary_role = "user"
        redirect_to = "/dashboard"
    
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.access_token_expire_minutes * 60,
        "role": primary_role,
        "redirect_to": redirect_to,
    }


# =============================================================================
# Token Refresh
# =============================================================================

@router.post(
    "/refresh",
    response_model=schemas.Token,
    summary="Refresh access token",
    description="""
    Get a new access token using a refresh token.
    
    Use this when your access token expires to get a new one
    without requiring the user to log in again.
    """
)
async def refresh_token(
    token_data: schemas.RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Exchange refresh token for new access token.
    """
    # Decode and validate refresh token
    payload = TokenManager.decode_token(token_data.refresh_token, token_type="refresh")
    user_id = payload.get("sub")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    # Verify user still exists and is active
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Generate new access token
    new_access_token = create_access_token(data={"sub": str(user.id)})
    
    role_names = [r.name for r in user.roles]
    primary_role = "admin" if (user.is_admin or "admin" in role_names or "superadmin" in role_names) else "user"
    redirect_to = "/admin-dashboard" if primary_role == "admin" else "/dashboard"

    return {
        "access_token": new_access_token,
        "token_type": "bearer",
        "expires_in": settings.access_token_expire_minutes * 60,
        "role": primary_role,
        "redirect_to": redirect_to,
    }


# =============================================================================
# Password Management
# =============================================================================

@router.post(
    "/change-password",
    response_model=schemas.MessageResponse,
    summary="Change password",
    description="Change the current user's password. Requires current password verification."
)
async def change_password(
    password_data: schemas.UserUpdatePassword,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Change password for authenticated user.
    """
    # Verify current password
    if not PasswordManager.verify_password(
        password_data.current_password, 
        current_user.password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Check new password is different from current
    if PasswordManager.verify_password(
        password_data.new_password, 
        current_user.password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password"
        )
    
    # Hash and save new password
    current_user.password = PasswordManager.hash_password(password_data.new_password)
    current_user.updated_at = datetime.now(timezone.utc)
    db.commit()
    
    return {"message": "Password changed successfully", "success": True}


# =============================================================================
# Current User Info
# =============================================================================

@router.get(
    "/me",
    response_model=schemas.UserResponse,
    summary="Get current user",
    description="Get the currently authenticated user's profile information."
)
async def get_me(current_user: models.User = Depends(get_current_user)):
    """
    Return current user's profile.
    
    This endpoint is useful for:
    - Verifying token is valid
    - Getting user profile after login
    - Checking assigned roles
    """
    return current_user


@router.delete(
    "/logout",
    response_model=schemas.MessageResponse,
    summary="Logout user",
    description="""
    Logout the current user.
    
    Note: Since JWTs are stateless, this endpoint is mainly for client-side
    token cleanup. For full logout, implement token blacklisting.
    """
)
async def logout(current_user: models.User = Depends(get_current_user)):
    """
    Logout endpoint.
    
    In a stateless JWT system, the client should simply discard the token.
    For additional security, implement token blacklisting.
    """
    return {
        "message": "Successfully logged out. Please discard your tokens.",
        "success": True
    }
