import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.models  # noqa: F401 — register all models with Base
from app.database import get_db
from app.main import app
from app.models.base import Base

# StaticPool ensures all connections share the same in-memory SQLite database
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
def client():
    Base.metadata.create_all(bind=test_engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def trip(client):
    response = client.post(
        "/api/v1/trips",
        json={"name": "Test Trip", "destination": "Paris"},
    )
    assert response.status_code == 201
    return response.json()


@pytest.fixture
def trip_with_budget(client):
    response = client.post(
        "/api/v1/trips",
        json={"name": "Budget Trip", "destination": "Tokyo", "budget": 5000.0, "currency": "USD"},
    )
    assert response.status_code == 201
    return response.json()


@pytest.fixture
def activity(client, trip):
    response = client.post(
        f"/api/v1/trips/{trip['id']}/activities",
        json={"name": "Eiffel Tower", "location": "Paris"},
    )
    assert response.status_code == 201
    return response.json()


@pytest.fixture
def expense(client, trip):
    response = client.post(
        f"/api/v1/trips/{trip['id']}/expenses",
        json={"description": "Dinner", "amount": 50.0, "currency": "USD", "category": "food"},
    )
    assert response.status_code == 201
    return response.json()


@pytest.fixture
def accommodation(client, trip):
    response = client.post(
        f"/api/v1/trips/{trip['id']}/accommodations",
        json={"name": "Hotel Lumiere", "type": "hotel"},
    )
    assert response.status_code == 201
    return response.json()


@pytest.fixture
def flight(client, trip):
    response = client.post(
        f"/api/v1/trips/{trip['id']}/flights",
        json={"departure_airport": "JFK", "arrival_airport": "CDG"},
    )
    assert response.status_code == 201
    return response.json()


@pytest.fixture
def itinerary_item(client, trip):
    response = client.post(
        f"/api/v1/trips/{trip['id']}/itinerary",
        json={"date": "2026-06-01", "title": "Morning walk", "sort_order": 0},
    )
    assert response.status_code == 201
    return response.json()


@pytest.fixture
def packing_item(client, trip):
    response = client.post(
        f"/api/v1/trips/{trip['id']}/packing",
        json={"name": "Passport", "category": "documents"},
    )
    assert response.status_code == 201
    return response.json()
