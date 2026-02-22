# database.py — Database connection setup

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# PostgreSQL connection URL
DATABASE_URL = "postgresql://postgres:swikrity@localhost:5432/Janasewa"

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create a session factory (each request gets its own session)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models
Base = declarative_base()


def get_db():
    """Dependency that provides a DB session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
