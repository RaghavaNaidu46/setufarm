from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID

class FarmerRegistrationRequest(BaseModel):
    name: str
    phone: Optional[str] = None
    language: str = "telugu"
    village: str
    district: str
    state: str = "Telangana"
    farm_size_acres: float
    aadhar_number: str

class BuyerRegistrationRequest(BaseModel):
    name: str
    phone: str
    language: str = "telugu"
    village: str
    district: str
    state: str = "Telangana"

class DriverRegistrationRequest(BaseModel):
    name: str
    phone: str
    language: str = "telugu"
    vehicle_type: str
    vehicle_number: str
    license_number: str
    aadhar_number: str
    upi_id: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

class UserResponse(BaseModel):
    id: UUID
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    role: str
    aadhar_verified: bool
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    farm_size_acres: Optional[float] = None
    aadhar_number: Optional[str] = None
    vehicle_type: Optional[str] = None
    vehicle_number: Optional[str] = None
    license_number: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None


    class Config:
        from_attributes = True
