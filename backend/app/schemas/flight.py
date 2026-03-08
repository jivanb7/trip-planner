from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class FlightCreate(BaseModel):
    airline: Optional[str] = None
    flight_number: Optional[str] = None
    departure_airport: str
    arrival_airport: str
    departure_time: Optional[datetime] = None
    arrival_time: Optional[datetime] = None
    cost: Optional[float] = None
    currency: str = "USD"
    confirmation_number: Optional[str] = None
    booking_url: Optional[str] = None
    notes: Optional[str] = None


class FlightUpdate(BaseModel):
    airline: Optional[str] = None
    flight_number: Optional[str] = None
    departure_airport: Optional[str] = None
    arrival_airport: Optional[str] = None
    departure_time: Optional[datetime] = None
    arrival_time: Optional[datetime] = None
    cost: Optional[float] = None
    currency: Optional[str] = None
    confirmation_number: Optional[str] = None
    booking_url: Optional[str] = None
    notes: Optional[str] = None


class FlightRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    trip_id: str
    airline: Optional[str] = None
    flight_number: Optional[str] = None
    departure_airport: str
    arrival_airport: str
    departure_time: Optional[datetime] = None
    arrival_time: Optional[datetime] = None
    cost: Optional[float] = None
    currency: str
    confirmation_number: Optional[str] = None
    booking_url: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
