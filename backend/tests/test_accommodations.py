def test_create_accommodation(client, trip):
    response = client.post(
        f"/api/v1/trips/{trip['id']}/accommodations",
        json={
            "name": "Hotel Ritz",
            "type": "hotel",
            "address": "15 Place Vendome",
            "check_in": "2026-06-01",
            "check_out": "2026-06-05",
            "cost_per_night": 500.0,
            "currency": "EUR",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Hotel Ritz"
    assert data["type"] == "hotel"
    assert data["trip_id"] == trip["id"]
    assert data["cost_per_night"] == 500.0


def test_create_accommodation_trip_not_found(client):
    response = client.post(
        "/api/v1/trips/nonexistent-id/accommodations",
        json={"name": "Hotel"},
    )
    assert response.status_code == 404


def test_list_accommodations_empty(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}/accommodations")
    assert response.status_code == 200
    assert response.json() == []


def test_list_accommodations(client, trip, accommodation):
    response = client.get(f"/api/v1/trips/{trip['id']}/accommodations")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == accommodation["id"]


def test_get_accommodation(client, trip, accommodation):
    response = client.get(f"/api/v1/trips/{trip['id']}/accommodations/{accommodation['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == accommodation["id"]


def test_get_accommodation_not_found(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}/accommodations/nonexistent-id")
    assert response.status_code == 404


def test_update_accommodation(client, trip, accommodation):
    response = client.put(
        f"/api/v1/trips/{trip['id']}/accommodations/{accommodation['id']}",
        json={"name": "Hotel Grand", "cost_per_night": 200.0},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Hotel Grand"
    assert data["cost_per_night"] == 200.0


def test_update_accommodation_not_found(client, trip):
    response = client.put(
        f"/api/v1/trips/{trip['id']}/accommodations/nonexistent-id",
        json={"name": "Nope"},
    )
    assert response.status_code == 404


def test_delete_accommodation(client, trip, accommodation):
    response = client.delete(f"/api/v1/trips/{trip['id']}/accommodations/{accommodation['id']}")
    assert response.status_code == 204
    get_response = client.get(f"/api/v1/trips/{trip['id']}/accommodations/{accommodation['id']}")
    assert get_response.status_code == 404


def test_delete_accommodation_not_found(client, trip):
    response = client.delete(f"/api/v1/trips/{trip['id']}/accommodations/nonexistent-id")
    assert response.status_code == 404
