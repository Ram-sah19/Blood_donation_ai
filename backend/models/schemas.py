from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str # donor, hospital, admin
    bloodGroup: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class NLRequest(BaseModel):
    message: str
