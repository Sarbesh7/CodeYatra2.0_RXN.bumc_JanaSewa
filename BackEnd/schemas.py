from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, datetime


class User(BaseModel):
    name: str
    email: str
    password: str
    is_admin: bool = False


class ShowUser(BaseModel):
    id: int
    name: str
    email: str
    is_admin: bool
    model_config = ConfigDict(from_attributes=True)


class Login(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    redirect_to: str


# Citizenship Application Schemas
class CitizenshipApplicationCreate(BaseModel):
    applicant_name: str
    permanent_district: str
    ward_no: int
    municipality: str
    date_of_birth: date
    father_name: str
    mother_name: str
    gender: str


class CitizenshipApplicationResponse(BaseModel):
    id: int
    user_id: int
    applicant_name: str
    permanent_district: str
    ward_no: int
    municipality: str
    date_of_birth: date
    father_name: str
    mother_name: str
    gender: str
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)