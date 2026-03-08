from typing import Any, Generic, Optional, Type, TypeVar

from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.base import Base

ModelT = TypeVar("ModelT", bound=Base)
CreateSchemaT = TypeVar("CreateSchemaT", bound=BaseModel)
UpdateSchemaT = TypeVar("UpdateSchemaT", bound=BaseModel)


class CRUDBase(Generic[ModelT, CreateSchemaT, UpdateSchemaT]):
    def __init__(self, model: Type[ModelT]) -> None:
        self.model = model

    def get(self, db: Session, record_id: str) -> Optional[ModelT]:
        return db.get(self.model, record_id)

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100, **filters: Any
    ) -> list[ModelT]:
        stmt = select(self.model)
        for attr, value in filters.items():
            stmt = stmt.where(getattr(self.model, attr) == value)
        stmt = stmt.offset(skip).limit(limit)
        return list(db.execute(stmt).scalars().all())

    def create(self, db: Session, *, obj_in: CreateSchemaT, **extra: Any) -> ModelT:
        data = obj_in.model_dump(exclude_unset=False)
        data.update(extra)
        db_obj = self.model(**data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: ModelT, obj_in: UpdateSchemaT
    ) -> ModelT:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, record_id: str) -> Optional[ModelT]:
        db_obj = db.get(self.model, record_id)
        if db_obj:
            db.delete(db_obj)
            db.commit()
        return db_obj
