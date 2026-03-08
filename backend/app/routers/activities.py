from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas.activity import ActivityCreate, ActivityRead, ActivityUpdate
from app.utils import raise_not_found

router = APIRouter(prefix="/api/v1/trips/{trip_id}/activities", tags=["activities"])


@router.get("", response_model=list[ActivityRead])
def list_activities(trip_id: str, skip: int = Query(default=0, ge=0), limit: int = Query(default=100, ge=1, le=1000), db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    return crud.activities.get_multi(db, skip=skip, limit=limit, trip_id=trip_id)


@router.post("", response_model=ActivityRead, status_code=201)
def create_activity(trip_id: str, activity_in: ActivityCreate, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    return crud.activities.create(db, obj_in=activity_in, trip_id=trip_id)


@router.get("/{activity_id}", response_model=ActivityRead)
def get_activity(trip_id: str, activity_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    activity = crud.activities.get(db, activity_id)
    if not activity or activity.trip_id != trip_id:
        raise_not_found("Activity", activity_id)
    return activity


@router.put("/{activity_id}", response_model=ActivityRead)
def update_activity(
    trip_id: str, activity_id: str, activity_in: ActivityUpdate, db: Session = Depends(get_db)
):
    crud.trips.get_or_404(db, trip_id)
    activity = crud.activities.get(db, activity_id)
    if not activity or activity.trip_id != trip_id:
        raise_not_found("Activity", activity_id)
    return crud.activities.update(db, db_obj=activity, obj_in=activity_in)


@router.delete("/{activity_id}", status_code=204)
def delete_activity(trip_id: str, activity_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    activity = crud.activities.get(db, activity_id)
    if not activity or activity.trip_id != trip_id:
        raise_not_found("Activity", activity_id)
    crud.activities.remove(db, record_id=activity_id)
