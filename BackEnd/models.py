from sqlalchemy import Column, String, Integer, Boolean, Date, ForeignKey, DateTime, Text, JSON, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import random
import string

Base = declarative_base()


def generate_serial_number():
    """Generate unique serial number like JS-2026-0001"""
    year = datetime.now().year
    random_part = ''.join(random.choices(string.digits, k=4))
    return f"JS-{year}-{random_part}"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(String(20), default="citizen")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    applications = relationship("Application", back_populates="user")
    complaints = relationship("Complaint", back_populates="user")


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    required_documents = Column(JSON, default=list)
    office_type = Column(String(100), nullable=False)
    fee = Column(Float, default=0.0)
    estimated_days = Column(Integer, default=7)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    applications = relationship("Application", back_populates="service")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    serial_number = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    
    applicant_name = Column(String(255), nullable=False)
    applicant_address = Column(String(500), nullable=True)
    district = Column(String(100), nullable=True)
    municipality = Column(String(100), nullable=True)
    ward_no = Column(Integer, nullable=True)
    phone = Column(String(20), nullable=True)
    
    form_data = Column(JSON, default=dict)
    
    documents = Column(JSON, default=list)
    
    status = Column(String(50), default="Submitted")
    remarks = Column(Text, nullable=True)
    admin_remarks = Column(Text, nullable=True)
    official_document_path = Column(String(500), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="applications")
    service = relationship("Service", back_populates="applications")


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    office_type = Column(String(100), nullable=False)
    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    attachment_path = Column(String(500), nullable=True)
    status = Column(String(50), default="Pending")
    admin_response = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="complaints")


class Notice(Base):
    __tablename__ = "notices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)  # Scholarship, Agriculture, Announcement, Scheme, Health, Training
    deadline = Column(Date, nullable=True)
    attachment_path = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow) 