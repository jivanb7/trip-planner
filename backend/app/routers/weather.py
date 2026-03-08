from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas.weather_info import WeatherInfoCreate, WeatherInfoRead
from app.utils import raise_not_found

router = APIRouter(prefix="/api/v1/trips/{trip_id}/weather", tags=["weather"])


@router.get("", response_model=list[WeatherInfoRead])
def list_weather(trip_id: str, skip: int = Query(default=0, ge=0), limit: int = Query(default=100, ge=1, le=1000), db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    return crud.weather.get_multi(db, skip=skip, limit=limit, trip_id=trip_id)


@router.post("", response_model=WeatherInfoRead, status_code=201)
def create_weather(trip_id: str, weather_in: WeatherInfoCreate, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    return crud.weather.create(db, obj_in=weather_in, trip_id=trip_id)


@router.delete("/{weather_id}", status_code=204)
def delete_weather(trip_id: str, weather_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    w = crud.weather.get(db, weather_id)
    if not w or w.trip_id != trip_id:
        raise_not_found("WeatherInfo", weather_id)
    crud.weather.remove(db, record_id=weather_id)
