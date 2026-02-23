from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List, Any
from datetime import date, datetime


# ==================== USER SCHEMAS ====================

class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    phone: Optional[str] = None
    role: str = "citizen"


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    user_name: str


# ==================== SERVICE SCHEMAS ====================

class ServiceCreate(BaseModel):
    title: str
    description: Optional[str] = None
    required_documents: List[str] = []
    office_type: str
    fee: float = 0.0
    estimated_days: int = 7


class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    required_documents: Optional[List[str]] = None
    office_type: Optional[str] = None
    fee: Optional[float] = None
    estimated_days: Optional[int] = None
    is_active: Optional[bool] = None


class ServiceResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    required_documents: List[str] = []
    office_type: str
    fee: float
    estimated_days: int
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ==================== APPLICATION SCHEMAS ====================

class ApplicationCreate(BaseModel):
    service_id: int
    applicant_name: str
    applicant_address: Optional[str] = None
    district: Optional[str] = None
    municipality: Optional[str] = None
    ward_no: Optional[int] = None
    phone: Optional[str] = None
    form_data: dict = {}
    remarks: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: str
    admin_remarks: Optional[str] = None


class ApplicationResponse(BaseModel):
    id: int
    serial_number: str
    user_id: int
    service_id: int
    applicant_name: str
    applicant_address: Optional[str] = None
    district: Optional[str] = None
    municipality: Optional[str] = None
    ward_no: Optional[int] = None
    phone: Optional[str] = None
    form_data: dict = {}
    documents: List[str] = []
    status: str
    remarks: Optional[str] = None
    admin_remarks: Optional[str] = None
    official_document_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ApplicationWithService(ApplicationResponse):
    service: Optional[ServiceResponse] = None


class TrackingResponse(BaseModel):
    serial_number: str
    applicant_name: str
    service_title: str
    status: str
    created_at: datetime
    updated_at: datetime
    admin_remarks: Optional[str] = None
    official_document_path: Optional[str] = None


# ==================== COMPLAINT SCHEMAS ====================

class ComplaintCreate(BaseModel):
    office_type: str
    subject: str
    description: str


class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    admin_response: Optional[str] = None


class ComplaintResponse(BaseModel):
    id: int
    user_id: int
    office_type: str
    subject: str
    description: str
    attachment_path: Optional[str] = None
    status: str
    admin_response: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ==================== NOTICE SCHEMAS ====================

class NoticeCreate(BaseModel):
    title: str
    description: str
    category: str
    deadline: Optional[date] = None


class NoticeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    deadline: Optional[date] = None
    is_active: Optional[bool] = None


class NoticeResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    deadline: Optional[date] = None
    attachment_path: Optional[str] = None
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ==================== DASHBOARD STATS ====================

class AdminStats(BaseModel):
    total_users: int
    total_services: int = 0
    total_applications: int
    pending_applications: int
    approved_applications: int
    rejected_applications: int
    total_complaints: int
    pending_complaints: int
    total_notices: int
    approved_today: int = 0