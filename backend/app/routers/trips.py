from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas.trip import (
    TripBudget,
    TripBudgetUpdate,
    TripCreate,
    TripCurrency,
    TripRead,
    TripSummary,
    TripUpdate,
)

router = APIRouter(prefix="/api/v1/trips", tags=["trips"])


@router.get("", response_model=list[TripRead])
def list_trips(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.trips.get_multi(db, skip=skip, limit=limit)


@router.post("", response_model=TripRead, status_code=201)
def create_trip(trip_in: TripCreate, db: Session = Depends(get_db)):
    return crud.trips.create(db, obj_in=trip_in)


@router.get("/{trip_id}", response_model=TripRead)
def get_trip(trip_id: str, db: Session = Depends(get_db)):
    return crud.trips.get_or_404(db, trip_id)


@router.put("/{trip_id}", response_model=TripRead)
def update_trip(trip_id: str, trip_in: TripUpdate, db: Session = Depends(get_db)):
    trip = crud.trips.get_or_404(db, trip_id)
    return crud.trips.update(db, db_obj=trip, obj_in=trip_in)


@router.delete("/{trip_id}", status_code=204)
def delete_trip(trip_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    crud.trips.remove(db, record_id=trip_id)


@router.get("/{trip_id}/summary", response_model=TripSummary)
def get_trip_summary(trip_id: str, db: Session = Depends(get_db)):
    trip = crud.trips.get_or_404(db, trip_id)
    total_spent_usd = crud.trips.get_total_spent_usd(db, trip_id)
    budget_remaining = None
    if trip.budget is not None:
        from app.utils import convert_to_usd
        budget_usd = convert_to_usd(trip.budget, trip.currency)
        budget_remaining = round(budget_usd - total_spent_usd, 2)

    return TripSummary(
        trip=TripRead.model_validate(trip),
        activity_count=len(trip.activities),
        expense_count=len(trip.expenses),
        accommodation_count=len(trip.accommodations),
        flight_count=len(trip.flights),
        transport_count=len(trip.transports),
        itinerary_item_count=len(trip.itinerary_items),
        packing_item_count=len(trip.packing_items),
        total_spent_usd=total_spent_usd,
        budget_remaining_usd=budget_remaining,
    )


@router.get("/{trip_id}/currency", response_model=TripCurrency)
def get_trip_currency(trip_id: str, db: Session = Depends(get_db)):
    trip = crud.trips.get_or_404(db, trip_id)
    return TripCurrency(currency=trip.currency)


@router.get("/{trip_id}/budget", response_model=TripBudget)
def get_trip_budget(trip_id: str, db: Session = Depends(get_db)):
    trip = crud.trips.get_or_404(db, trip_id)
    total_spent_usd = crud.trips.get_total_spent_usd(db, trip_id)
    budget_remaining = None
    if trip.budget is not None:
        from app.utils import convert_to_usd
        budget_usd = convert_to_usd(trip.budget, trip.currency)
        budget_remaining = round(budget_usd - total_spent_usd, 2)
    return TripBudget(
        budget=trip.budget,
        currency=trip.currency,
        total_spent_usd=total_spent_usd,
        budget_remaining_usd=budget_remaining,
    )


@router.put("/{trip_id}/budget", response_model=TripRead)
def update_trip_budget(
    trip_id: str, budget_in: TripBudgetUpdate, db: Session = Depends(get_db)
):
    trip = crud.trips.get_or_404(db, trip_id)
    trip.budget = budget_in.budget
    if budget_in.currency:
        trip.currency = budget_in.currency
    db.commit()
    db.refresh(trip)
    return trip
