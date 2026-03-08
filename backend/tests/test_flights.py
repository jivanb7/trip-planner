def test_create_flight(client, trip):
    response = client.post(
        f"/api/v1/trips/{trip['id']}/flights",
        json={
            "airline": "Air France",
            "flight_number": "AF007",
            "departure_airport": "JFK",
            "arrival_airport": "CDG",
            "departure_time": "2026-06-01T08:00:00",
            "arrival_time": "2026-06-01T20:00:00",
            "cost": 800.0,
            "currency": "USD",
            "confirmation_number": "XYZ123",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["airline"] == "Air France"
    assert data["flight_number"] == "AF007"
    assert data["departure_airport"] == "JFK"
    assert data["arrival_airport"] == "CDG"
    assert data["trip_id"] == trip["id"]


def test_create_flight_minimal(client, trip):
    response = client.post(
        f"/api/v1/trips/{trip['id']}/flights",
        json={"departure_airport": "LAX", "arrival_airport": "NRT"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["departure_airport"] == "LAX"
    assert data["arrival_airport"] == "NRT"
    assert data["airline"] is None


def test_create_flight_trip_not_found(client):
    response = client.post(
        "/api/v1/trips/nonexistent-id/flights",
        json={"departure_airport": "JFK", "arrival_airport": "LHR"},
    )
    assert response.status_code == 404


def test_list_flights_empty(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}/flights")
    assert response.status_code == 200
    assert response.json() == []


def test_list_flights(client, trip, flight):
    response = client.get(f"/api/v1/trips/{trip['id']}/flights")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == flight["id"]


def test_get_flight(client, trip, flight):
    response = client.get(f"/api/v1/trips/{trip['id']}/flights/{flight['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == flight["id"]


def test_get_flight_not_found(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}/flights/nonexistent-id")
    assert response.status_code == 404


def test_update_flight(client, trip, flight):
    response = client.put(
        f"/api/v1/trips/{trip['id']}/flights/{flight['id']}",
        json={"airline": "Delta", "cost": 950.0},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["airline"] == "Delta"
    assert data["cost"] == 950.0


def test_update_flight_not_found(client, trip):
    response = client.put(
        f"/api/v1/trips/{trip['id']}/flights/nonexistent-id",
        json={"airline": "Nope"},
    )
    assert response.status_code == 404


def test_delete_flight(client, trip, flight):
    response = client.delete(f"/api/v1/trips/{trip['id']}/flights/{flight['id']}")
    assert response.status_code == 204
    get_response = client.get(f"/api/v1/trips/{trip['id']}/flights/{flight['id']}")
    assert get_response.status_code == 404


def test_delete_flight_not_found(client, trip):
    response = client.delete(f"/api/v1/trips/{trip['id']}/flights/nonexistent-id")
    assert response.status_code == 404
