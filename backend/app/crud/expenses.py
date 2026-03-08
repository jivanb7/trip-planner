from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.expense import Expense
from app.schemas.expense import ExpenseCategorySummary, ExpenseCreate, ExpenseSummary, ExpenseUpdate


class CRUDExpense(CRUDBase[Expense, ExpenseCreate, ExpenseUpdate]):
    def get_summary(self, db: Session, trip_id: str) -> ExpenseSummary:
        rows = db.execute(
            select(
                Expense.category,
                func.sum(Expense.amount_usd).label("total_usd"),
                func.count(Expense.id).label("count"),
            )
            .where(Expense.trip_id == trip_id)
            .group_by(Expense.category)
        ).all()

        categories = [
            ExpenseCategorySummary(
                category=row.category,
                total_usd=round(float(row.total_usd), 2),
                count=row.count,
            )
            for row in rows
        ]
        grand_total = round(sum(c.total_usd for c in categories), 2)
        return ExpenseSummary(categories=categories, grand_total_usd=grand_total)


expenses = CRUDExpense(Expense)
