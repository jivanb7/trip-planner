from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class TripCreate(BaseModel):
    name: str
    destination: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None
    budget: Optional[float] = None
    currency: str = "USD"
    status: str = "planning"


class TripUpdate(BaseModel):
    name: Optional[str] = None
    destination: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None
    budget: Optional[float] = None
    currency: Optional[str] = None
    status: Optional[str] = None


class TripRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    destination: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None
    budget: Optional[float] = None
    currency: str
    status: str
    created_at: datetime
    updated_at: datetime


class TripBudgetUpdate(BaseModel):
    budget: float
    currency: Optional[str] = None


class TripSummary(BaseModel):
    trip: TripRead
    activity_count: int
    expense_count: int
    accommodation_count: int
    flight_count: int
    transport_count: int
    itinerary_item_count: int
    packing_item_count: int
    total_spent_usd: float
    budget_remaining_usd: Optional[float] = None


class TripBudget(BaseModel):
    budget: Optional[float]
    currency: str
    total_spent_usd: float
    budget_remaining_usd: Optional[float] = None


class TripCurrency(BaseModel):
    currency: str
