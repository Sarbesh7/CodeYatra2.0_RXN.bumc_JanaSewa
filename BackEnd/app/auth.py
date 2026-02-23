# =============================================================================
# Authentication Module - JWT and Password Handling
# =============================================================================
# Provides secure JWT token generation/validation and password hashing.
# Uses bcrypt for password hashing and python-jose for JWT operations.
# =============================================================================

from datetime import datetime, timedelta, timezone
from typing import Optional, Union
import bcrypt
from jose import JWTError, jwt
from fastapi import HTTPException, status
from app.config import settings


# =============================================================================
# Password Hashing Utilities
# =============================================================================
# Uses bcrypt with automatic salt generation.
# Bcrypt is designed to be slow, making brute-force attacks impractical.
# =============================================================================

class PasswordManager:
    """
    Secure password hashing and verification using bcrypt.
    
    Bcrypt features:
    - Automatic salt generation
    - Adaptive cost factor (work factor)
    - Designed to be computationally expensive
    - Built-in protection against timing attacks
    """
    
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a password using bcrypt.
        
        Args:
            password: Plain text password (max 72 bytes for bcrypt)
            
        Returns:
            str: Bcrypt hash string
            
        Note:
            Bcrypt has a 72-byte limit on passwords. Longer passwords
            are truncated. Consider using SHA-256 pre-hash for longer passwords.
        """
        # Encode and truncate to bcrypt's 72-byte limit
        password_bytes = password[:72].encode('utf-8')
        # Generate salt and hash (cost factor 12 by default)
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password_bytes, salt)
        return hashed.decode('utf-8')
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify a password against its hash.
        
        Args:
            plain_password: Plain text password to verify
            hashed_password: Bcrypt hash to verify against
            
        Returns:
            bool: True if password matches, False otherwise
            
        Note:
            Uses constant-time comparison to prevent timing attacks.
        """
        try:
            plain_bytes = plain_password[:72].encode('utf-8')
            hashed_bytes = hashed_password.encode('utf-8')
            return bcrypt.checkpw(plain_bytes, hashed_bytes)
        except Exception:
            # Return False for any error (invalid hash format, etc.)
            return False


# =============================================================================
# JWT Token Management
# =============================================================================
# Provides secure token generation and validation for authentication.
# Supports both access tokens (short-lived) and refresh tokens (long-lived).
# =============================================================================

class TokenManager:
    """
    JWT token generation and validation.
    
    Token types:
    - Access Token: Short-lived, used for API authentication
    - Refresh Token: Long-lived, used to obtain new access tokens
    
    Security features:
    - Configurable expiration times
    - Token type validation
    - Secure algorithm (HS256)
    """
    
    @staticmethod
    def create_access_token(
        data: dict, 
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """
        Create a JWT access token.
        
        Args:
            data: Payload data (must include 'sub' for user ID)
            expires_delta: Optional custom expiration time
            
        Returns:
            str: Encoded JWT token
            
        Example:
            token = TokenManager.create_access_token(
                data={"sub": str(user.id)},
                expires_delta=timedelta(minutes=30)
            )
        """
        to_encode = data.copy()
        
        # Set expiration time
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(
                minutes=settings.access_token_expire_minutes
            )
        
        # Add standard JWT claims
        to_encode.update({
            "exp": expire,
            "iat": datetime.now(timezone.utc),
            "type": "access"
        })
        
        # Encode token
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.secret_key, 
            algorithm=settings.algorithm
        )
        return encoded_jwt
    
    @staticmethod
    def create_refresh_token(
        data: dict, 
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """
        Create a JWT refresh token.
        
        Refresh tokens are long-lived and used to obtain new access tokens
        without requiring the user to log in again.
        
        Args:
            data: Payload data (must include 'sub' for user ID)
            expires_delta: Optional custom expiration time
            
        Returns:
            str: Encoded JWT refresh token
        """
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(
                days=settings.refresh_token_expire_days
            )
        
        to_encode.update({
            "exp": expire,
            "iat": datetime.now(timezone.utc),
            "type": "refresh"
        })
        
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.secret_key, 
            algorithm=settings.algorithm
        )
        return encoded_jwt
    
    @staticmethod
    def decode_token(token: str, token_type: str = "access") -> dict:
        """
        Decode and validate a JWT token.
        
        Args:
            token: JWT token string to decode
            token_type: Expected token type ('access' or 'refresh')
            
        Returns:
            dict: Decoded token payload
            
        Raises:
            HTTPException: If token is invalid, expired, or wrong type
        """
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        try:
            # Decode the token
            payload = jwt.decode(
                token, 
                settings.secret_key, 
                algorithms=[settings.algorithm]
            )
            
            # Validate token type
            if payload.get("type") != token_type:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Invalid token type. Expected {token_type}",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            # Validate subject exists
            if payload.get("sub") is None:
                raise credentials_exception
            
            return payload
            
        except JWTError as e:
            # Handle specific JWT errors
            if "expired" in str(e).lower():
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has expired",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            raise credentials_exception
    
    @staticmethod
    def verify_token(token: str) -> Union[dict, None]:
        """
        Verify a token without raising exceptions.
        
        Useful for optional authentication or checking token validity.
        
        Args:
            token: JWT token string to verify
            
        Returns:
            dict: Decoded payload if valid, None if invalid
        """
        try:
            payload = jwt.decode(
                token, 
                settings.secret_key, 
                algorithms=[settings.algorithm]
            )
            return payload
        except JWTError:
            return None


# =============================================================================
# Convenience Functions (for backward compatibility)
# =============================================================================

def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return PasswordManager.hash_password(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return PasswordManager.verify_password(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    return TokenManager.create_access_token(data, expires_delta)


def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT refresh token."""
    return TokenManager.create_refresh_token(data, expires_delta)


def decode_access_token(token: str) -> dict:
    """Decode and validate an access token."""
    return TokenManager.decode_token(token, token_type="access")


def decode_refresh_token(token: str) -> dict:
    """Decode and validate a refresh token."""
    return TokenManager.decode_token(token, token_type="refresh")
