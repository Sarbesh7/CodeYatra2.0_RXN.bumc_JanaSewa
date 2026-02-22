# =============================================================================
# Users Router - User Management Endpoints
# =============================================================================
# Handles user CRUD operations with role-based access control.
# Admin-only endpoints for user management.
# =============================================================================

from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app import models, schemas
from app.auth import PasswordManager
from app.dependencies import (
    get_current_user,
    get_admin_user,
    get_superadmin_user,
    RoleChecker,
    require_admin
)

# Create router with prefix and tags
router = APIRouter(
    prefix="/users",
    tags=["Users"],
    responses={
        401: {"description": "Unauthorized"},
        403: {"description": "Forbidden"},
        404: {"description": "Not Found"},
    }
)


# =============================================================================
# User Profile Endpoints (Self-Service)
# =============================================================================

@router.get(
    "/profile",
    response_model=schemas.UserResponse,
    summary="Get own profile",
    description="Get the current authenticated user's profile."
)
async def get_profile(current_user: models.User = Depends(get_current_user)):
    """Get current user's profile."""
    return current_user


@router.put(
    "/profile",
    response_model=schemas.UserResponse,
    summary="Update own profile",
    description="Update the current user's profile information."
)
async def update_profile(
    update_data: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile.
    
    Users can update their name and email.
    They cannot change their own active status or roles.
    """
    # Check if new email is already taken
    if update_data.email and update_data.email != current_user.email:
        existing = db.query(models.User).filter(
            models.User.email == update_data.email
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        current_user.email = update_data.email
        current_user.is_verified = False  # Require re-verification
    
    if update_data.name:
        current_user.name = update_data.name
    
    current_user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(current_user)
    
    return current_user


# =============================================================================
# Admin User Management Endpoints
# =============================================================================

@router.get(
    "/",
    response_model=List[schemas.UserResponse],
    summary="List all users (Admin)",
    description="Get a list of all users. Admin access required.",
    dependencies=[Depends(require_admin)]
)
async def list_users(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Max records to return"),
    search: Optional[str] = Query(None, description="Search by name or email"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    role: Optional[str] = Query(None, description="Filter by role name"),
    db: Session = Depends(get_db)
):
    """
    List all users with pagination and filtering.
    
    Query Parameters:
    - skip: Pagination offset
    - limit: Maximum records to return
    - search: Search in name or email
    - is_active: Filter by active status
    - role: Filter by role name
    """
    query = db.query(models.User)
    
    # Apply search filter
    if search:
        query = query.filter(
            or_(
                models.User.name.ilike(f"%{search}%"),
                models.User.email.ilike(f"%{search}%")
            )
        )
    
    # Apply active status filter
    if is_active is not None:
        query = query.filter(models.User.is_active == is_active)
    
    # Apply role filter
    if role:
        query = query.join(models.User.roles).filter(models.Role.name == role)
    
    # Apply pagination
    users = query.offset(skip).limit(limit).all()
    
    return users


@router.get(
    "/{user_id}",
    response_model=schemas.UserResponse,
    summary="Get user by ID (Admin)",
    description="Get a specific user by their ID. Admin access required.",
    dependencies=[Depends(require_admin)]
)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific user by ID."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.post(
    "/",
    response_model=schemas.UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create user (Admin)",
    description="Create a new user with role assignment. Admin access required.",
    dependencies=[Depends(require_admin)]
)
async def create_user(
    user_data: schemas.UserCreateAdmin,
    db: Session = Depends(get_db)
):
    """
    Create a new user (admin only).
    
    Allows admin to create users with specific roles.
    """
    # Check if email exists
    existing = db.query(models.User).filter(
        models.User.email == user_data.email
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    new_user = models.User(
        name=user_data.name,
        email=user_data.email,
        password=PasswordManager.hash_password(user_data.password),
        is_active=True,
        is_verified=True  # Admin-created users are pre-verified
    )
    
    # Assign roles
    if user_data.role_ids:
        roles = db.query(models.Role).filter(
            models.Role.id.in_(user_data.role_ids)
        ).all()
        new_user.roles = roles
    else:
        # Default to 'user' role
        default_role = db.query(models.Role).filter(
            models.Role.name == models.RoleNames.USER
        ).first()
        if default_role:
            new_user.roles.append(default_role)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@router.put(
    "/{user_id}",
    response_model=schemas.UserResponse,
    summary="Update user (Admin)",
    description="Update a user's information. Admin access required.",
    dependencies=[Depends(require_admin)]
)
async def update_user(
    user_id: int,
    update_data: schemas.UserUpdate,
    db: Session = Depends(get_db)
):
    """Update user information (admin only)."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields if provided
    if update_data.name is not None:
        user.name = update_data.name
    
    if update_data.email is not None and update_data.email != user.email:
        existing = db.query(models.User).filter(
            models.User.email == update_data.email
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        user.email = update_data.email
    
    if update_data.is_active is not None:
        user.is_active = update_data.is_active

    if update_data.is_admin is not None:
        user.is_admin = update_data.is_admin
    
    user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)
    
    return user


@router.delete(
    "/{user_id}",
    response_model=schemas.MessageResponse,
    summary="Delete user (Admin)",
    description="Delete a user account. Admin access required.",
    dependencies=[Depends(require_admin)]
)
async def delete_user(
    user_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a user (admin only)."""
    # Prevent self-deletion
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent deletion of superadmin by non-superadmin
    if user.is_superadmin and not current_user.is_superadmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot delete a superadmin user"
        )
    
    db.delete(user)
    db.commit()
    
    return {"message": f"User {user.email} deleted successfully", "success": True}


# =============================================================================
# Role Management Endpoints
# =============================================================================

@router.post(
    "/{user_id}/roles",
    response_model=schemas.UserResponse,
    summary="Assign roles to user (Admin)",
    description="Assign roles to a user. Admin access required.",
    dependencies=[Depends(require_admin)]
)
async def assign_roles(
    user_id: int,
    role_data: schemas.UserRoleAssign,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Assign roles to a user."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Only superadmin can assign superadmin role
    roles_to_assign = db.query(models.Role).filter(
        models.Role.id.in_(role_data.role_ids)
    ).all()
    
    for role in roles_to_assign:
        if role.name == models.RoleNames.SUPERADMIN and not current_user.is_superadmin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only superadmin can assign superadmin role"
            )
    
    # Add roles (avoiding duplicates)
    current_role_ids = {r.id for r in user.roles}
    for role in roles_to_assign:
        if role.id not in current_role_ids:
            user.roles.append(role)

    # Sync is_admin column: True if any admin/superadmin role present
    all_role_names = {r.name for r in user.roles}
    user.is_admin = bool(all_role_names & {"admin", "superadmin"})

    db.commit()
    db.refresh(user)
    
    return user


@router.delete(
    "/{user_id}/roles",
    response_model=schemas.UserResponse,
    summary="Remove roles from user (Admin)",
    description="Remove roles from a user. Admin access required.",
    dependencies=[Depends(require_admin)]
)
async def remove_roles(
    user_id: int,
    role_data: schemas.UserRoleRemove,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove roles from a user."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent removing own admin/superadmin role
    if user_id == current_user.id:
        admin_roles = db.query(models.Role).filter(
            models.Role.id.in_(role_data.role_ids),
            models.Role.name.in_([models.RoleNames.ADMIN, models.RoleNames.SUPERADMIN])
        ).all()
        if admin_roles:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot remove your own admin role"
            )
    
    # Only superadmin can remove superadmin role
    roles_to_remove = db.query(models.Role).filter(
        models.Role.id.in_(role_data.role_ids)
    ).all()
    
    for role in roles_to_remove:
        if role.name == models.RoleNames.SUPERADMIN and not current_user.is_superadmin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only superadmin can remove superadmin role"
            )
    
    # Remove roles
    role_ids_to_remove = set(role_data.role_ids)
    user.roles = [r for r in user.roles if r.id not in role_ids_to_remove]

    # Sync is_admin column after removal
    remaining_role_names = {r.name for r in user.roles}
    user.is_admin = bool(remaining_role_names & {"admin", "superadmin"})

    db.commit()
    db.refresh(user)
    
    return user


# =============================================================================
# Role Listing
# =============================================================================

@router.get(
    "/roles/all",
    response_model=List[schemas.RoleResponse],
    summary="List all roles",
    description="Get all available roles. Admin access required.",
    dependencies=[Depends(require_admin)]
)
async def list_roles(db: Session = Depends(get_db)):
    """Get all available roles."""
    roles = db.query(models.Role).filter(models.Role.is_active == True).all()
    return roles
