from datetime import date, datetime, time
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ItineraryItemCreate(BaseModel):
    date: date
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    category: Optional[str] = None
    sort_order: int = 0
    cost: Optional[float] = None
    notes: Optional[str] = None


class ItineraryItemUpdate(BaseModel):
    date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    category: Optional[str] = None
    sort_order: Optional[int] = None
    cost: Optional[float] = None
    notes: Optional[str] = None


class ItineraryItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    trip_id: str
    date: date
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    category: Optional[str] = None
    sort_order: int
    cost: Optional[float] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class ItineraryReorderItem(BaseModel):
    id: str
    sort_order: int


class ItineraryReorderRequest(BaseModel):
    items: list[ItineraryReorderItem]
