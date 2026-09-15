from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    """Custom type for MongoDB ObjectId"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


class AppointmentDB(BaseModel):
    """MongoDB model for appointments"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    appointment_id: str
    patient_name: str
    patient_phone: str
    patient_email: EmailStr
    doctor_name: str
    doctor_level: str
    department: str
    appointment_date: str
    appointment_time: str
    symptoms: str
    mode: str = "ai"
    status: str = "scheduled"  # scheduled, completed, cancelled
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class DoctorDB(BaseModel):
    """MongoDB model for doctors"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str
    level: str  # junior, senior
    department: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    available: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class PatientDB(BaseModel):
    """MongoDB model for patients"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    patient_id: str = Field(default_factory=lambda: str(ObjectId()))
    name: str
    phone: str
    email: EmailStr
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class PredictionHistoryDB(BaseModel):
    """MongoDB model for prediction history"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    patient_id: str
    symptoms: list[str]
    predicted_disease: str
    department: str
    doctor_level: str
    severity: str
    confidence: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
