from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas.packing_item import PackingItemCreate, PackingItemRead, PackingItemUpdate
from app.utils import raise_not_found

router = APIRouter(prefix="/api/v1/trips/{trip_id}/packing", tags=["packing"])


@router.get("", response_model=list[PackingItemRead])
def list_packing(trip_id: str, skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    return crud.packing.get_multi(db, skip=skip, limit=limit, trip_id=trip_id)


@router.post("", response_model=PackingItemRead, status_code=201)
def create_packing_item(
    trip_id: str, item_in: PackingItemCreate, db: Session = Depends(get_db)
):
    crud.trips.get_or_404(db, trip_id)
    return crud.packing.create(db, obj_in=item_in, trip_id=trip_id)


@router.get("/{packing_id}", response_model=PackingItemRead)
def get_packing_item(trip_id: str, packing_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    item = crud.packing.get(db, packing_id)
    if not item or item.trip_id != trip_id:
        raise_not_found("PackingItem", packing_id)
    return item


@router.put("/{packing_id}", response_model=PackingItemRead)
def update_packing_item(
    trip_id: str, packing_id: str, item_in: PackingItemUpdate, db: Session = Depends(get_db)
):
    crud.trips.get_or_404(db, trip_id)
    item = crud.packing.get(db, packing_id)
    if not item or item.trip_id != trip_id:
        raise_not_found("PackingItem", packing_id)
    return crud.packing.update(db, db_obj=item, obj_in=item_in)


@router.delete("/{packing_id}", status_code=204)
def delete_packing_item(trip_id: str, packing_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    item = crud.packing.get(db, packing_id)
    if not item or item.trip_id != trip_id:
        raise_not_found("PackingItem", packing_id)
    crud.packing.remove(db, record_id=packing_id)
