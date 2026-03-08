from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas.flight import FlightCreate, FlightRead, FlightUpdate
from app.utils import raise_not_found

router = APIRouter(prefix="/api/v1/trips/{trip_id}/flights", tags=["flights"])


@router.get("", response_model=list[FlightRead])
def list_flights(trip_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    return crud.flights.get_multi(db, skip=skip, limit=limit, trip_id=trip_id)


@router.post("", response_model=FlightRead, status_code=201)
def create_flight(trip_id: str, flight_in: FlightCreate, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    return crud.flights.create(db, obj_in=flight_in, trip_id=trip_id)


@router.get("/{flight_id}", response_model=FlightRead)
def get_flight(trip_id: str, flight_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    flight = crud.flights.get(db, flight_id)
    if not flight or flight.trip_id != trip_id:
        raise_not_found("Flight", flight_id)
    return flight


@router.put("/{flight_id}", response_model=FlightRead)
def update_flight(
    trip_id: str, flight_id: str, flight_in: FlightUpdate, db: Session = Depends(get_db)
):
    crud.trips.get_or_404(db, trip_id)
    flight = crud.flights.get(db, flight_id)
    if not flight or flight.trip_id != trip_id:
        raise_not_found("Flight", flight_id)
    return crud.flights.update(db, db_obj=flight, obj_in=flight_in)


@router.delete("/{flight_id}", status_code=204)
def delete_flight(trip_id: str, flight_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    flight = crud.flights.get(db, flight_id)
    if not flight or flight.trip_id != trip_id:
        raise_not_found("Flight", flight_id)
    crud.flights.remove(db, record_id=flight_id)
