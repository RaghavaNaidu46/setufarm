from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class AddressCreate(BaseModel):
    label: str # e.g., 'Home', 'Work', 'Shop'
    address_line: str
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = "Telangana"
    pincode: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    is_default: bool = False

class AddressUpdate(BaseModel):
    label: Optional[str] = None
    address_line: Optional[str] = None
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    is_default: Optional[bool] = None

class AddressResponse(BaseModel):
    id: UUID
    user_id: UUID
    label: str
    address_line: str
    village: Optional[str] = None
    district: Optional[str] = None
    state: str
    pincode: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    is_default: bool
    created_at: datetime

    class Config:
        from_attributes = True
