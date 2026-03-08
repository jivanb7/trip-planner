from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class PackingItemCreate(BaseModel):
    name: str
    category: str = "general"
    quantity: int = 1
    packed: bool = False


class PackingItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[int] = None
    packed: Optional[bool] = None


class PackingItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    trip_id: str
    name: str
    category: str
    quantity: int
    packed: bool
    created_at: datetime
    updated_at: datetime
