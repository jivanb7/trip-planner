def test_create_itinerary_item(client, trip):
    response = client.post(
        f"/api/v1/trips/{trip['id']}/itinerary",
        json={
            "date": "2026-06-01",
            "title": "Visit Eiffel Tower",
            "start_time": "10:00:00",
            "end_time": "12:00:00",
            "location": "Champ de Mars",
            "sort_order": 1,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Visit Eiffel Tower"
    assert data["date"] == "2026-06-01"
    assert data["trip_id"] == trip["id"]
    assert data["sort_order"] == 1


def test_create_itinerary_item_trip_not_found(client):
    response = client.post(
        "/api/v1/trips/nonexistent-id/itinerary",
        json={"date": "2026-06-01", "title": "Walk"},
    )
    assert response.status_code == 404


def test_list_itinerary_empty(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}/itinerary")
    assert response.status_code == 200
    assert response.json() == []


def test_list_itinerary(client, trip, itinerary_item):
    response = client.get(f"/api/v1/trips/{trip['id']}/itinerary")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == itinerary_item["id"]


def test_update_itinerary_item(client, trip, itinerary_item):
    response = client.put(
        f"/api/v1/trips/{trip['id']}/itinerary/{itinerary_item['id']}",
        json={"title": "Updated Walk", "sort_order": 5},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Walk"
    assert data["sort_order"] == 5


def test_update_itinerary_item_not_found(client, trip):
    response = client.put(
        f"/api/v1/trips/{trip['id']}/itinerary/nonexistent-id",
        json={"title": "Nope"},
    )
    assert response.status_code == 404


def test_delete_itinerary_item(client, trip, itinerary_item):
    response = client.delete(f"/api/v1/trips/{trip['id']}/itinerary/{itinerary_item['id']}")
    assert response.status_code == 204
    response = client.get(f"/api/v1/trips/{trip['id']}/itinerary")
    assert response.json() == []


def test_delete_itinerary_item_not_found(client, trip):
    response = client.delete(f"/api/v1/trips/{trip['id']}/itinerary/nonexistent-id")
    assert response.status_code == 404


def test_reorder_itinerary(client, trip):
    # Create two items
    item1 = client.post(
        f"/api/v1/trips/{trip['id']}/itinerary",
        json={"date": "2026-06-01", "title": "Item 1", "sort_order": 1},
    ).json()
    item2 = client.post(
        f"/api/v1/trips/{trip['id']}/itinerary",
        json={"date": "2026-06-01", "title": "Item 2", "sort_order": 2},
    ).json()

    # Reorder: swap sort_order
    response = client.put(
        f"/api/v1/trips/{trip['id']}/itinerary/reorder",
        json={
            "items": [
                {"id": item1["id"], "sort_order": 10},
                {"id": item2["id"], "sort_order": 5},
            ]
        },
    )
    assert response.status_code == 200
    data = response.json()
    order_map = {item["id"]: item["sort_order"] for item in data}
    assert order_map[item1["id"]] == 10
    assert order_map[item2["id"]] == 5


def test_reorder_itinerary_trip_not_found(client):
    response = client.put(
        "/api/v1/trips/nonexistent-id/itinerary/reorder",
        json={"items": []},
    )
    assert response.status_code == 404
