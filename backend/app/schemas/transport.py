from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class TransportCreate(BaseModel):
    type: str
    description: Optional[str] = None
    from_location: Optional[str] = None
    to_location: Optional[str] = None
    departure_time: Optional[datetime] = None
    arrival_time: Optional[datetime] = None
    cost: Optional[float] = None
    currency: str = "USD"
    confirmation_number: Optional[str] = None
    notes: Optional[str] = None


class TransportUpdate(BaseModel):
    type: Optional[str] = None
    description: Optional[str] = None
    from_location: Optional[str] = None
    to_location: Optional[str] = None
    departure_time: Optional[datetime] = None
    arrival_time: Optional[datetime] = None
    cost: Optional[float] = None
    currency: Optional[str] = None
    confirmation_number: Optional[str] = None
    notes: Optional[str] = None


class TransportRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    trip_id: str
    type: str
    description: Optional[str] = None
    from_location: Optional[str] = None
    to_location: Optional[str] = None
    departure_time: Optional[datetime] = None
    arrival_time: Optional[datetime] = None
    cost: Optional[float] = None
    currency: str
    confirmation_number: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
