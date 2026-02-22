# =============================================================================
# Dependencies Module - FastAPI Dependency Injection
# =============================================================================
# Provides reusable dependencies for authentication and authorization.
# Uses FastAPI's dependency injection system for clean, testable code.
# =============================================================================

from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import TokenManager
from app import models

# =============================================================================
# OAuth2 Password Bearer Setup
# =============================================================================
# Configures the OAuth2 authentication scheme.
# tokenUrl points to the login endpoint for Swagger UI integration.
# =============================================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    scheme_name="JWT",
    description="Enter your JWT access token"
)

# Optional OAuth2 scheme (doesn't require token)
oauth2_scheme_optional = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    auto_error=False
)


# =============================================================================
# Authentication Dependencies
# =============================================================================

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.User:
    """
    Get the current authenticated user from JWT token.
    
    This dependency validates the JWT token, extracts the user ID,
    and fetches the user from the database.
    
    Args:
        token: JWT access token from Authorization header
        db: Database session
        
    Returns:
        User: The authenticated user model
        
    Raises:
        HTTPException 401: If token is invalid or user not found
        HTTPException 403: If user account is inactive
        
    Usage:
        @app.get("/profile")
        def get_profile(user: models.User = Depends(get_current_user)):
            return user
    """
    # Decode and validate token
    payload = TokenManager.decode_token(token, token_type="access")
    user_id = payload.get("sub")
    
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Fetch user from database
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    return user


async def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db)
) -> Optional[models.User]:
    """
    Optionally get the current user if token is provided.
    
    Returns None if no token is provided, allowing routes to work
    for both authenticated and unauthenticated users.
    
    Usage:
        @app.get("/public")
        def public_route(user: Optional[models.User] = Depends(get_current_user_optional)):
            if user:
                return {"message": f"Hello, {user.name}!"}
            return {"message": "Hello, guest!"}
    """
    if token is None:
        return None
    
    try:
        payload = TokenManager.decode_token(token, token_type="access")
        user_id = payload.get("sub")
        if user_id:
            user = db.query(models.User).filter(models.User.id == int(user_id)).first()
            if user and user.is_active:
                return user
    except HTTPException:
        pass
    
    return None


async def get_current_active_verified_user(
    current_user: models.User = Depends(get_current_user)
) -> models.User:
    """
    Get current user who is both active and email verified.
    
    Raises:
        HTTPException 403: If email is not verified
    """
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your email first."
        )
    return current_user


# =============================================================================
# Role-Based Access Control (RBAC) Dependencies
# =============================================================================

class RoleChecker:
    """
    Dependency class for role-based access control.
    
    Creates a callable dependency that checks if the current user
    has any of the required roles.
    
    Usage:
        # Single role check
        @app.get("/admin", dependencies=[Depends(RoleChecker(["admin"]))])
        def admin_only():
            return {"message": "Admin access granted"}
        
        # Multiple roles check (any of the roles)
        @app.get("/staff", dependencies=[Depends(RoleChecker(["admin", "moderator"]))])
        def staff_only():
            return {"message": "Staff access granted"}
    """
    
    def __init__(self, allowed_roles: List[str]):
        """
        Initialize role checker with allowed roles.
        
        Args:
            allowed_roles: List of role names that can access the route
        """
        self.allowed_roles = allowed_roles
    
    async def __call__(
        self, 
        current_user: models.User = Depends(get_current_user)
    ) -> models.User:
        """
        Check if user has required role.
        Also grants access if is_admin column is True and admin role is required.
        """
        admin_roles = {"admin", "superadmin"}
        requires_admin = bool(set(self.allowed_roles) & admin_roles)

        # Grant if is_admin column is set AND an admin role is in allowed list
        if requires_admin and current_user.is_admin:
            return current_user

        # Otherwise check via role assignments
        if not current_user.has_any_role(self.allowed_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(self.allowed_roles)}"
            )
        return current_user


# =============================================================================
# Convenience Role Dependencies
# =============================================================================
# Pre-configured role checkers for common use cases.
# =============================================================================

# Admin access required
require_admin = RoleChecker(["admin", "superadmin"])

# Superadmin access required
require_superadmin = RoleChecker(["superadmin"])

# Moderator or higher access required
require_moderator = RoleChecker(["moderator", "admin", "superadmin"])

# Any authenticated user (with user role or higher)
require_user = RoleChecker(["user", "moderator", "admin", "superadmin"])


async def get_admin_user(
    current_user: models.User = Depends(get_current_user)
) -> models.User:
    """
    Get current user and verify they have admin privileges.
    Checks both the is_admin column (set directly in DB) and role assignments.
    """
    if not current_user.check_is_admin():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user


async def get_superadmin_user(
    current_user: models.User = Depends(get_current_user)
) -> models.User:
    """
    Get current user and verify they have superadmin privileges.
    """
    if not current_user.is_superadmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Superadmin privileges required"
        )
    return current_user


# =============================================================================
# Permission-Based Access Control
# =============================================================================

class PermissionChecker:
    """
    Dependency for checking specific permissions.
    
    For more granular access control beyond roles.
    Permissions are stored as JSON in the Role.permissions field.
    
    Usage:
        @app.delete("/items/{id}", dependencies=[Depends(PermissionChecker("can_delete"))])
        def delete_item(id: int):
            return {"message": "Item deleted"}
    """
    
    def __init__(self, required_permission: str):
        """
        Initialize permission checker.
        
        Args:
            required_permission: Permission key to check
        """
        self.required_permission = required_permission
    
    async def __call__(
        self, 
        current_user: models.User = Depends(get_current_user)
    ) -> models.User:
        """
        Check if user has required permission through any of their roles.
        """
        import json
        
        for role in current_user.roles:
            try:
                permissions = json.loads(role.permissions or "{}")
                # Check for specific permission or 'all' permission
                if permissions.get(self.required_permission) or permissions.get("all"):
                    return current_user
            except json.JSONDecodeError:
                continue
        
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Permission denied. Required permission: {self.required_permission}"
        )
