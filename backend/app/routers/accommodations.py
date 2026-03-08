from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas.accommodation import AccommodationCreate, AccommodationRead, AccommodationUpdate
from app.utils import raise_not_found

router = APIRouter(prefix="/api/v1/trips/{trip_id}/accommodations", tags=["accommodations"])


@router.get("", response_model=list[AccommodationRead])
def list_accommodations(trip_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    return crud.accommodations.get_multi(db, skip=skip, limit=limit, trip_id=trip_id)


@router.post("", response_model=AccommodationRead, status_code=201)
def create_accommodation(trip_id: str, acc_in: AccommodationCreate, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    return crud.accommodations.create(db, obj_in=acc_in, trip_id=trip_id)


@router.get("/{accommodation_id}", response_model=AccommodationRead)
def get_accommodation(trip_id: str, accommodation_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    acc = crud.accommodations.get(db, accommodation_id)
    if not acc or acc.trip_id != trip_id:
        raise_not_found("Accommodation", accommodation_id)
    return acc


@router.put("/{accommodation_id}", response_model=AccommodationRead)
def update_accommodation(
    trip_id: str,
    accommodation_id: str,
    acc_in: AccommodationUpdate,
    db: Session = Depends(get_db),
):
    crud.trips.get_or_404(db, trip_id)
    acc = crud.accommodations.get(db, accommodation_id)
    if not acc or acc.trip_id != trip_id:
        raise_not_found("Accommodation", accommodation_id)
    return crud.accommodations.update(db, db_obj=acc, obj_in=acc_in)


@router.delete("/{accommodation_id}", status_code=204)
def delete_accommodation(trip_id: str, accommodation_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    acc = crud.accommodations.get(db, accommodation_id)
    if not acc or acc.trip_id != trip_id:
        raise_not_found("Accommodation", accommodation_id)
    crud.accommodations.remove(db, record_id=accommodation_id)
