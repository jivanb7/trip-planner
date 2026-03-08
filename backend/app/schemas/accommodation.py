from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AccommodationCreate(BaseModel):
    name: str
    type: Optional[str] = None
    address: Optional[str] = None
    check_in: Optional[date] = None
    check_out: Optional[date] = None
    cost_per_night: Optional[float] = None
    currency: str = "USD"
    confirmation_number: Optional[str] = None
    booking_url: Optional[str] = None
    notes: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class AccommodationUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    address: Optional[str] = None
    check_in: Optional[date] = None
    check_out: Optional[date] = None
    cost_per_night: Optional[float] = None
    currency: Optional[str] = None
    confirmation_number: Optional[str] = None
    booking_url: Optional[str] = None
    notes: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class AccommodationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    trip_id: str
    name: str
    type: Optional[str] = None
    address: Optional[str] = None
    check_in: Optional[date] = None
    check_out: Optional[date] = None
    cost_per_night: Optional[float] = None
    currency: str
    confirmation_number: Optional[str] = None
    booking_url: Optional[str] = None
    notes: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: datetime
    updated_at: datetime
