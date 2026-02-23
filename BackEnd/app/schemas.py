# =============================================================================
# Pydantic Schemas Module
# =============================================================================
# Contains all Pydantic models for request/response validation.
# Schemas ensure data integrity and provide automatic documentation.
# =============================================================================

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
import re


# =============================================================================
# Role Schemas
# =============================================================================

class RoleBase(BaseModel):
    """Base schema for role data."""
    name: str = Field(..., min_length=2, max_length=50, description="Unique role name")
    description: Optional[str] = Field(None, max_length=255, description="Role description")


class RoleCreate(RoleBase):
    """Schema for creating a new role."""
    permissions: Optional[str] = Field(default="{}", description="JSON string of permissions")


class RoleUpdate(BaseModel):
    """Schema for updating a role (all fields optional)."""
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    description: Optional[str] = Field(None, max_length=255)
    permissions: Optional[str] = None
    is_active: Optional[bool] = None


class RoleResponse(RoleBase):
    """Schema for role response."""
    id: int
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# =============================================================================
# User Schemas
# =============================================================================

class UserBase(BaseModel):
    """Base schema for user data."""
    name: str = Field(..., min_length=2, max_length=100, description="User's display name")
    email: EmailStr = Field(..., description="User's email address")


class UserCreate(UserBase):
    """
    Schema for user registration.
    
    Includes password validation rules for security:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    """
    password: str = Field(
        ..., 
        min_length=8, 
        max_length=128,
        description="Password (min 8 chars, must include upper, lower, digit)"
    )
    
    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """
        Validate password meets security requirements.
        
        Requirements:
        - At least 8 characters (handled by Field min_length)
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one digit
        """
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserCreateAdmin(UserCreate):
    """Schema for admin creating a user with role assignment."""
    role_ids: Optional[List[int]] = Field(default=None, description="List of role IDs to assign")


class UserUpdate(BaseModel):
    """Schema for updating user profile (all fields optional)."""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None


class UserUpdatePassword(BaseModel):
    """Schema for password change."""
    current_password: str = Field(..., description="Current password for verification")
    new_password: str = Field(
        ..., 
        min_length=8, 
        max_length=128,
        description="New password"
    )
    
    @field_validator('new_password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate new password meets security requirements."""
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserResponse(UserBase):
    """
    Schema for user response.
    
    Note: NEVER include password or sensitive data in responses!
    """
    id: int
    is_active: bool
    is_admin: bool
    is_verified: bool
    created_at: datetime
    roles: List[RoleResponse] = []
    
    model_config = ConfigDict(from_attributes=True)


class UserResponseMinimal(BaseModel):
    """Minimal user response without sensitive details."""
    id: int
    name: str
    email: EmailStr
    
    model_config = ConfigDict(from_attributes=True)


# =============================================================================
# Authentication Schemas
# =============================================================================

class LoginRequest(BaseModel):
    """Schema for login request."""
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration time in seconds")
    role: str = Field(..., description="Primary role of the logged-in user")
    redirect_to: str = Field(..., description="Frontend route to redirect to after login")


class TokenWithRefresh(Token):
    """Schema for token response with refresh token."""
    refresh_token: str = Field(..., description="JWT refresh token")


class TokenPayload(BaseModel):
    """Schema for decoded JWT token payload."""
    sub: str = Field(..., description="Subject (user ID)")
    exp: int = Field(..., description="Expiration timestamp")
    iat: int = Field(..., description="Issued at timestamp")
    type: str = Field(default="access", description="Token type (access/refresh)")


class RefreshTokenRequest(BaseModel):
    """Schema for token refresh request."""
    refresh_token: str = Field(..., description="Refresh token to exchange")


# =============================================================================
# Generic Response Schemas
# =============================================================================

class MessageResponse(BaseModel):
    """Generic message response."""
    message: str = Field(..., description="Response message")
    success: bool = Field(default=True, description="Operation success status")


class ErrorResponse(BaseModel):
    """Error response schema."""
    detail: str = Field(..., description="Error detail message")
    error_code: Optional[str] = Field(None, description="Application error code")


class PaginatedResponse(BaseModel):
    """Generic paginated response wrapper."""
    items: List = Field(..., description="List of items")
    total: int = Field(..., description="Total count of items")
    page: int = Field(..., description="Current page number")
    page_size: int = Field(..., description="Items per page")
    total_pages: int = Field(..., description="Total number of pages")


# =============================================================================
# User Role Assignment Schemas
# =============================================================================

class UserRoleAssign(BaseModel):
    """Schema for assigning roles to a user."""
    role_ids: List[int] = Field(..., description="List of role IDs to assign")


class UserRoleRemove(BaseModel):
    """Schema for removing roles from a user."""
    role_ids: List[int] = Field(..., description="List of role IDs to remove")
