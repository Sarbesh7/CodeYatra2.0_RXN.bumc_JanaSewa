from sqlalchemy import Column, String, Integer, Boolean, Date, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    password = Column(String)
    is_admin = Column(Boolean, default=False, nullable=False)
    
    # Relationship to citizenship applications
    citizenship_applications = relationship("CitizenshipApplication", back_populates="user")


class CitizenshipApplication(Base):

    __tablename__ = "citizenship_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    applicant_name = Column(String, nullable=False)
    permanent_district = Column(String, nullable=False)
    ward_no = Column(Integer, nullable=False)
    municipality = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    father_name = Column(String, nullable=False)
    mother_name = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    status = Column(String, default="pending")  # pending, approved, rejected
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship back to user
    user = relationship("User", back_populates="citizenship_applications") 