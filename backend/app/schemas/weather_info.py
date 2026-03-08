from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class WeatherInfoCreate(BaseModel):
    date: date
    condition: Optional[str] = None
    high_temp: Optional[float] = None
    low_temp: Optional[float] = None
    humidity: Optional[float] = None
    precipitation_chance: Optional[float] = None
    wind_speed: Optional[float] = None


class WeatherInfoUpdate(BaseModel):
    date: Optional[date] = None
    condition: Optional[str] = None
    high_temp: Optional[float] = None
    low_temp: Optional[float] = None
    humidity: Optional[float] = None
    precipitation_chance: Optional[float] = None
    wind_speed: Optional[float] = None


class WeatherInfoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    trip_id: str
    date: date
    condition: Optional[str] = None
    high_temp: Optional[float] = None
    low_temp: Optional[float] = None
    humidity: Optional[float] = None
    precipitation_chance: Optional[float] = None
    wind_speed: Optional[float] = None
    created_at: datetime
    updated_at: datetime
