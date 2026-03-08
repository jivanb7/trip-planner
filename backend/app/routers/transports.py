from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas.transport import TransportCreate, TransportRead, TransportUpdate
from app.utils import raise_not_found

router = APIRouter(prefix="/api/v1/trips/{trip_id}/transports", tags=["transports"])


@router.get("", response_model=list[TransportRead])
def list_transports(trip_id: str, skip: int = Query(default=0, ge=0), limit: int = Query(default=100, ge=1, le=1000), db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    return crud.transports.get_multi(db, skip=skip, limit=limit, trip_id=trip_id)


@router.post("", response_model=TransportRead, status_code=201)
def create_transport(trip_id: str, transport_in: TransportCreate, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    return crud.transports.create(db, obj_in=transport_in, trip_id=trip_id)


@router.get("/{transport_id}", response_model=TransportRead)
def get_transport(trip_id: str, transport_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    transport = crud.transports.get(db, transport_id)
    if not transport or transport.trip_id != trip_id:
        raise_not_found("Transport", transport_id)
    return transport


@router.put("/{transport_id}", response_model=TransportRead)
def update_transport(
    trip_id: str, transport_id: str, transport_in: TransportUpdate, db: Session = Depends(get_db)
):
    crud.trips.get_or_404(db, trip_id)
    transport = crud.transports.get(db, transport_id)
    if not transport or transport.trip_id != trip_id:
        raise_not_found("Transport", transport_id)
    return crud.transports.update(db, db_obj=transport, obj_in=transport_in)


@router.delete("/{transport_id}", status_code=204)
def delete_transport(trip_id: str, transport_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    transport = crud.transports.get(db, transport_id)
    if not transport or transport.trip_id != trip_id:
        raise_not_found("Transport", transport_id)
    crud.transports.remove(db, record_id=transport_id)
