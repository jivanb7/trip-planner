from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas.itinerary_item import (
    ItineraryItemCreate,
    ItineraryItemRead,
    ItineraryItemUpdate,
    ItineraryReorderRequest,
)
from app.utils import raise_not_found

router = APIRouter(prefix="/api/v1/trips/{trip_id}/itinerary", tags=["itinerary"])


@router.get("", response_model=list[ItineraryItemRead])
def list_itinerary(trip_id: str, skip: int = Query(default=0, ge=0), limit: int = Query(default=200, ge=1, le=1000), db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    return crud.itinerary.get_multi(db, skip=skip, limit=limit, trip_id=trip_id)


@router.post("", response_model=ItineraryItemRead, status_code=201)
def create_itinerary_item(
    trip_id: str, item_in: ItineraryItemCreate, db: Session = Depends(get_db)
):
    crud.trips.get_or_404(db, trip_id)
    return crud.itinerary.create(db, obj_in=item_in, trip_id=trip_id)


@router.put("/reorder", response_model=list[ItineraryItemRead])
def reorder_itinerary(
    trip_id: str, reorder_in: ItineraryReorderRequest, db: Session = Depends(get_db)
):
    crud.trips.get_or_404(db, trip_id)
    return crud.itinerary.reorder(db, reorder_in, trip_id=trip_id)


@router.put("/{item_id}", response_model=ItineraryItemRead)
def update_itinerary_item(
    trip_id: str, item_id: str, item_in: ItineraryItemUpdate, db: Session = Depends(get_db)
):
    crud.trips.get_or_404(db, trip_id)
    item = crud.itinerary.get(db, item_id)
    if not item or item.trip_id != trip_id:
        raise_not_found("ItineraryItem", item_id)
    return crud.itinerary.update(db, db_obj=item, obj_in=item_in)


@router.delete("/{item_id}", status_code=204)
def delete_itinerary_item(trip_id: str, item_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    item = crud.itinerary.get(db, item_id)
    if not item or item.trip_id != trip_id:
        raise_not_found("ItineraryItem", item_id)
    crud.itinerary.remove(db, record_id=item_id)
