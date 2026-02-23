# =============================================================================
# Database Models Module
# =============================================================================
# Contains all SQLAlchemy ORM models for the application.
# Implements User and Role models with proper relationships for RBAC.
# =============================================================================

from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, 
    ForeignKey, Table, Text, UniqueConstraint
)
from sqlalchemy.orm import relationship
from app.database import Base

# =============================================================================
# Association Table: User-Role Many-to-Many Relationship
# =============================================================================
# Enables users to have multiple roles (e.g., user can be both 'user' and 'moderator')
# This provides flexibility for complex role hierarchies.
# =============================================================================

user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    Column('role_id', Integer, ForeignKey('roles.id', ondelete='CASCADE'), primary_key=True),
)


class Role(Base):
    """
    Role model for Role-Based Access Control (RBAC).
    
    Defines different access levels in the application.
    Default roles: user, admin, superadmin
    
    Attributes:
        id: Unique identifier
        name: Role name (unique, e.g., 'admin', 'user')
        description: Human-readable description of the role
        permissions: JSON-like string of permissions (extensible)
        is_active: Whether the role is currently active
        created_at: Timestamp of role creation
        updated_at: Timestamp of last update
    """
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(String(255), nullable=True)
    permissions = Column(Text, nullable=True, default="{}")  # JSON string for extensibility
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )
    
    # Relationship: Roles -> Users (many-to-many)
    users = relationship("User", secondary=user_roles, back_populates="roles")
    
    def __repr__(self):
        return f"<Role(id={self.id}, name='{self.name}')>"


class User(Base):
    """
    User model for authentication and authorization.
    
    Stores user credentials and profile information.
    Passwords are stored as bcrypt hashes, NEVER plaintext!
    
    Attributes:
        id: Unique identifier
        name: User's display name
        email: Unique email address (used for login)
        password: Bcrypt hashed password
        is_active: Whether the user account is active
        is_verified: Whether the email has been verified
        created_at: Timestamp of account creation
        updated_at: Timestamp of last update
        last_login: Timestamp of last successful login
        roles: List of assigned roles (many-to-many relationship)
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)  # Stores bcrypt hash
    
    # Account status flags
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)  # For email verification
    is_admin = Column(Boolean, default=False)     # Set True to grant admin access directly
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationship: User -> Roles (many-to-many)
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"
    
    def has_role(self, role_name: str) -> bool:
        """
        Check if user has a specific role.
        
        Args:
            role_name: Name of the role to check
            
        Returns:
            bool: True if user has the role, False otherwise
        """
        return any(role.name == role_name for role in self.roles)
    
    def has_any_role(self, role_names: list[str]) -> bool:
        """
        Check if user has any of the specified roles.
        
        Args:
            role_names: List of role names to check
            
        Returns:
            bool: True if user has at least one of the roles
        """
        user_role_names = {role.name for role in self.roles}
        return bool(user_role_names.intersection(role_names))
    
    def check_is_admin(self) -> bool:
        """
        Returns True if user is admin either by the is_admin column
        OR by having the admin/superadmin role assigned.
        """
        return self.is_admin or self.has_role("admin") or self.has_role("superadmin")

    @property
    def is_superadmin(self) -> bool:
        """Check if user has superadmin role."""
        return self.has_role("superadmin")


# =============================================================================
# Role Constants
# =============================================================================
# Define role names as constants to avoid typos and enable IDE autocompletion.
# =============================================================================

class RoleNames:
    """Constants for role names used throughout the application."""
    USER = "user"
    ADMIN = "admin"
    SUPERADMIN = "superadmin"
    MODERATOR = "moderator"


# =============================================================================
# Database Initialization Helper
# =============================================================================
# Creates default roles if they don't exist.
# Call this during application startup.
# =============================================================================

def create_default_roles(db_session):
    """
    Create default roles in the database if they don't exist.
    
    Default roles:
        - user: Basic user access
        - admin: Administrative access
        - superadmin: Full system access
        - moderator: Content moderation access
    
    Args:
        db_session: SQLAlchemy database session
    """
    default_roles = [
        {
            "name": RoleNames.USER,
            "description": "Standard user with basic access",
            "permissions": '{"can_read": true, "can_write": true}'
        },
        {
            "name": RoleNames.ADMIN,
            "description": "Administrator with elevated privileges",
            "permissions": '{"can_read": true, "can_write": true, "can_delete": true, "can_manage_users": true}'
        },
        {
            "name": RoleNames.SUPERADMIN,
            "description": "Super administrator with full system access",
            "permissions": '{"all": true}'
        },
        {
            "name": RoleNames.MODERATOR,
            "description": "Moderator with content management access",
            "permissions": '{"can_read": true, "can_write": true, "can_moderate": true}'
        }
    ]
    
    for role_data in default_roles:
        existing_role = db_session.query(Role).filter(Role.name == role_data["name"]).first()
        if not existing_role:
            new_role = Role(**role_data)
            db_session.add(new_role)
    
    db_session.commit()
