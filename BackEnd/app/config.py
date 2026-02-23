# =============================================================================
# Configuration Module - Environment Variables and Settings
# =============================================================================
# This module handles all configuration using environment variables.
# Uses python-dotenv to load from .env file for development.
# In production, set environment variables directly in the deployment platform.
# =============================================================================

import os
from pathlib import Path
from functools import lru_cache
from pydantic_settings import BaseSettings
from pydantic import Field

# Find the .env file - look in current directory and parent
env_path = Path(__file__).parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).parent.parent / ".env"


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    Attributes:
        database_url: PostgreSQL connection string
        secret_key: Secret key for JWT encoding (keep this secure!)
        algorithm: JWT encoding algorithm
        access_token_expire_minutes: Token expiration time in minutes
        refresh_token_expire_days: Refresh token expiration in days
        debug: Enable debug mode (disable in production)
        api_v1_prefix: API version prefix for routes
    """
    
    # Database Configuration
    database_url: str = Field(
        default="postgresql://postgres:swikrity@localhost:5432/JanaSewa",
        description="PostgreSQL database connection URL"
    )
    
    # JWT Configuration
    secret_key: str = Field(
        default="09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7",
        description="Secret key for JWT token encoding"
    )
    algorithm: str = Field(
        default="HS256",
        description="Algorithm used for JWT encoding"
    )
    access_token_expire_minutes: int = Field(
        default=30,
        description="Access token expiration time in minutes"
    )
    refresh_token_expire_days: int = Field(
        default=7,
        description="Refresh token expiration time in days"
    )
    
    # Application Settings
    debug: bool = Field(
        default=True,
        description="Enable debug mode"
    )
    api_v1_prefix: str = Field(
        default="/api/v1",
        description="API version prefix"
    )
    
    class Config:
        env_file = str(env_path)
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Uses lru_cache to avoid reading .env file on every request.
    
    Returns:
        Settings: Application settings instance
    """
    return Settings()


# Export settings instance for easy access
settings = get_settings()
