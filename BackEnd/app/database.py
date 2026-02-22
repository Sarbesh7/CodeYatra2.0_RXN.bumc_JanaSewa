# =============================================================================
# Database Configuration Module
# =============================================================================
# Handles SQLAlchemy engine creation, session management, and base model setup.
# Uses connection pooling for better performance in production.
# =============================================================================

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import QueuePool
from app.config import settings

# =============================================================================
# Database Engine Configuration
# =============================================================================
# Create SQLAlchemy engine with connection pooling for production use.
# Pool settings help manage database connections efficiently.
# =============================================================================

engine = create_engine(
    settings.database_url,
    # Connection pool configuration for production
    poolclass=QueuePool,
    pool_size=5,           # Number of connections to keep open
    max_overflow=10,       # Additional connections when pool is full
    pool_timeout=30,       # Seconds to wait for available connection
    pool_recycle=1800,     # Recycle connections after 30 minutes
    pool_pre_ping=True,    # Test connections before using them
    # Echo SQL statements in debug mode
    echo=settings.debug,
)

# =============================================================================
# Session Factory
# =============================================================================
# SessionLocal creates database sessions for each request.
# autocommit=False: Transactions must be explicitly committed
# autoflush=False: Changes won't be sent to DB until commit
# =============================================================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# =============================================================================
# Declarative Base
# =============================================================================
# Base class for all SQLAlchemy ORM models.
# All models should inherit from this Base class.
# =============================================================================

Base = declarative_base()


def get_db():
    """
    Database session dependency for FastAPI routes.
    
    Yields a database session and ensures it's closed after the request.
    Use this with FastAPI's Depends() for automatic session management.
    
    Usage:
        @app.get("/items")
        def get_items(db: Session = Depends(get_db)):
            return db.query(Item).all()
    
    Yields:
        Session: SQLAlchemy database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialize database tables.
    
    Creates all tables defined by models inheriting from Base.
    Call this on application startup.
    
    Note: In production, use Alembic migrations instead!
    """
    from app import models  # Import to register models
    Base.metadata.create_all(bind=engine)
