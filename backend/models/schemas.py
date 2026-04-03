from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str # donor, hospital, admin
    bloodGroup: Optional[str] = None
    admin_secret: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class NLRequest(BaseModel):
    message: str

class StructuredBloodRequest(BaseModel):
    patient_name: str
    patient_age: int
    patient_gender: str
    disease: Optional[str] = None
    blood_group_required: str
    units_needed: int
    urgency_level: str
    required_date: Optional[str] = None
    notes: Optional[str] = None
    # Auto-filled by backend
    hospital_name: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = "open"
    ai_prediction: Optional[int] = None
    prediction_message: Optional[str] = None
