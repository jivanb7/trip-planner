from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas.expense import ExpenseCreate, ExpenseRead, ExpenseSummary, ExpenseUpdate
from app.utils import convert_to_usd, raise_not_found

router = APIRouter(prefix="/api/v1/trips/{trip_id}/expenses", tags=["expenses"])


@router.get("", response_model=list[ExpenseRead])
def list_expenses(trip_id: str, skip: int = Query(default=0, ge=0), limit: int = Query(default=100, ge=1, le=1000), db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    return crud.expenses.get_multi(db, skip=skip, limit=limit, trip_id=trip_id)


@router.post("", response_model=ExpenseRead, status_code=201)
def create_expense(trip_id: str, expense_in: ExpenseCreate, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    amount_usd = convert_to_usd(expense_in.amount, expense_in.currency)
    return crud.expenses.create(db, obj_in=expense_in, trip_id=trip_id, amount_usd=amount_usd)


@router.get("/summary", response_model=ExpenseSummary)
def get_expense_summary(trip_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    return crud.expenses.get_summary(db, trip_id)


@router.get("/{expense_id}", response_model=ExpenseRead)
def get_expense(trip_id: str, expense_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    expense = crud.expenses.get(db, expense_id)
    if not expense or expense.trip_id != trip_id:
        raise_not_found("Expense", expense_id)
    return expense


@router.put("/{expense_id}", response_model=ExpenseRead)
def update_expense(
    trip_id: str, expense_id: str, expense_in: ExpenseUpdate, db: Session = Depends(get_db)
):
    crud.trips.get_or_404(db, trip_id)
    expense = crud.expenses.get(db, expense_id)
    if not expense or expense.trip_id != trip_id:
        raise_not_found("Expense", expense_id)
    updated = crud.expenses.update(db, db_obj=expense, obj_in=expense_in)
    # Recompute amount_usd if amount or currency changed
    if expense_in.amount is not None or expense_in.currency is not None:
        updated.amount_usd = convert_to_usd(updated.amount, updated.currency)
        db.commit()
        db.refresh(updated)
    return updated


@router.delete("/{expense_id}", status_code=204)
def delete_expense(trip_id: str, expense_id: str, db: Session = Depends(get_db)):
    crud.trips.get_or_404(db, trip_id)
    expense = crud.expenses.get(db, expense_id)
    if not expense or expense.trip_id != trip_id:
        raise_not_found("Expense", expense_id)
    crud.expenses.remove(db, record_id=expense_id)
