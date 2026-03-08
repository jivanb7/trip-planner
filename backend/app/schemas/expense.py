from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ExpenseCreate(BaseModel):
    description: str
    amount: float
    currency: str = "USD"
    category: str
    date: Optional[date] = None
    notes: Optional[str] = None
    paid_by: Optional[str] = None


class ExpenseUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
    category: Optional[str] = None
    date: Optional[date] = None
    notes: Optional[str] = None
    paid_by: Optional[str] = None


class ExpenseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    trip_id: str
    description: str
    amount: float
    currency: str
    amount_usd: float
    category: str
    date: Optional[date] = None
    notes: Optional[str] = None
    paid_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class ExpenseCategorySummary(BaseModel):
    category: str
    total_usd: float
    count: int


class ExpenseSummary(BaseModel):
    categories: list[ExpenseCategorySummary]
    grand_total_usd: float
