def test_create_trip(client):
    response = client.post(
        "/api/v1/trips",
        json={"name": "Rome Adventure", "destination": "Rome"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Rome Adventure"
    assert data["destination"] == "Rome"
    assert data["currency"] == "USD"
    assert data["status"] == "planning"
    assert "id" in data
    assert "created_at" in data


def test_create_trip_with_all_fields(client):
    response = client.post(
        "/api/v1/trips",
        json={
            "name": "Japan Trip",
            "destination": "Tokyo",
            "start_date": "2026-04-01",
            "end_date": "2026-04-15",
            "description": "Cherry blossom season",
            "budget": 3000.0,
            "currency": "JPY",
            "status": "confirmed",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["start_date"] == "2026-04-01"
    assert data["budget"] == 3000.0
    assert data["currency"] == "JPY"
    assert data["status"] == "confirmed"


def test_list_trips_empty(client):
    response = client.get("/api/v1/trips")
    assert response.status_code == 200
    assert response.json() == []


def test_list_trips(client, trip):
    response = client.get("/api/v1/trips")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == trip["id"]


def test_get_trip(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == trip["id"]


def test_get_trip_not_found(client):
    response = client.get("/api/v1/trips/nonexistent-id")
    assert response.status_code == 404


def test_update_trip(client, trip):
    response = client.put(
        f"/api/v1/trips/{trip['id']}",
        json={"name": "Updated Name", "status": "confirmed"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["status"] == "confirmed"
    assert data["destination"] == trip["destination"]


def test_update_trip_not_found(client):
    response = client.put(
        "/api/v1/trips/nonexistent-id",
        json={"name": "Nope"},
    )
    assert response.status_code == 404


def test_delete_trip(client, trip):
    response = client.delete(f"/api/v1/trips/{trip['id']}")
    assert response.status_code == 204
    get_response = client.get(f"/api/v1/trips/{trip['id']}")
    assert get_response.status_code == 404


def test_delete_trip_not_found(client):
    response = client.delete("/api/v1/trips/nonexistent-id")
    assert response.status_code == 404


def test_trip_summary(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["trip"]["id"] == trip["id"]
    assert data["activity_count"] == 0
    assert data["expense_count"] == 0
    assert data["total_spent_usd"] == 0.0
    assert data["budget_remaining_usd"] is None


def test_trip_summary_with_budget(client, trip_with_budget):
    response = client.get(f"/api/v1/trips/{trip_with_budget['id']}/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["budget_remaining_usd"] == 5000.0


def test_trip_summary_not_found(client):
    response = client.get("/api/v1/trips/nonexistent-id/summary")
    assert response.status_code == 404


def test_trip_budget(client, trip_with_budget):
    response = client.get(f"/api/v1/trips/{trip_with_budget['id']}/budget")
    assert response.status_code == 200
    data = response.json()
    assert data["budget"] == 5000.0
    assert data["currency"] == "USD"
    assert data["total_spent_usd"] == 0.0
    assert data["budget_remaining_usd"] == 5000.0


def test_trip_budget_no_budget(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}/budget")
    assert response.status_code == 200
    data = response.json()
    assert data["budget"] is None
    assert data["budget_remaining_usd"] is None


def test_update_trip_budget(client, trip):
    response = client.put(
        f"/api/v1/trips/{trip['id']}/budget",
        json={"budget": 2000.0, "currency": "EUR"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["budget"] == 2000.0
    assert data["currency"] == "EUR"


def test_trip_currency(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}/currency")
    assert response.status_code == 200
    assert response.json()["currency"] == "USD"
