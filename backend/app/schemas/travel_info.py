from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict


class TravelInfoCreate(BaseModel):
    visa_requirements: Optional[str] = None
    vaccination_info: Optional[str] = None
    travel_insurance: Optional[str] = None
    local_currency: Optional[str] = None
    language: Optional[str] = None
    timezone: Optional[str] = None
    power_outlet: Optional[str] = None
    emergency_numbers: Optional[Any] = None
    useful_phrases: Optional[Any] = None
    notes: Optional[str] = None


class TravelInfoUpdate(BaseModel):
    visa_requirements: Optional[str] = None
    vaccination_info: Optional[str] = None
    travel_insurance: Optional[str] = None
    local_currency: Optional[str] = None
    language: Optional[str] = None
    timezone: Optional[str] = None
    power_outlet: Optional[str] = None
    emergency_numbers: Optional[Any] = None
    useful_phrases: Optional[Any] = None
    notes: Optional[str] = None


class TravelInfoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    trip_id: str
    visa_requirements: Optional[str] = None
    vaccination_info: Optional[str] = None
    travel_insurance: Optional[str] = None
    local_currency: Optional[str] = None
    language: Optional[str] = None
    timezone: Optional[str] = None
    power_outlet: Optional[str] = None
    emergency_numbers: Optional[Any] = None
    useful_phrases: Optional[Any] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
