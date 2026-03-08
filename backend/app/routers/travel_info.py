from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas.travel_info import TravelInfoRead, TravelInfoUpdate
from app.utils import raise_not_found

router = APIRouter(prefix="/api/v1/trips/{trip_id}/travel-info", tags=["travel_info"])


@router.get("", response_model=TravelInfoRead)
def get_travel_info(trip_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    info = crud.travel_info.get_by_trip(db, trip_id)
    if not info:
        raise_not_found("TravelInfo", trip_id)
    return info


@router.put("", response_model=TravelInfoRead)
def upsert_travel_info(trip_id: str, info_in: TravelInfoUpdate, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    return crud.travel_info.upsert(db, trip_id, info_in)
