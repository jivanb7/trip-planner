def test_create_activity(client, trip):
    response = client.post(
        f"/api/v1/trips/{trip['id']}/activities",
        json={"name": "Louvre Museum", "location": "Paris", "cost": 17.0, "currency": "EUR"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Louvre Museum"
    assert data["trip_id"] == trip["id"]
    assert data["cost"] == 17.0
    assert data["currency"] == "EUR"


def test_create_activity_trip_not_found(client):
    response = client.post(
        "/api/v1/trips/nonexistent-id/activities",
        json={"name": "Museum"},
    )
    assert response.status_code == 404


def test_list_activities_empty(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}/activities")
    assert response.status_code == 200
    assert response.json() == []


def test_list_activities(client, trip, activity):
    response = client.get(f"/api/v1/trips/{trip['id']}/activities")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == activity["id"]


def test_get_activity(client, trip, activity):
    response = client.get(f"/api/v1/trips/{trip['id']}/activities/{activity['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == activity["id"]


def test_get_activity_not_found(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}/activities/nonexistent-id")
    assert response.status_code == 404


def test_update_activity(client, trip, activity):
    response = client.put(
        f"/api/v1/trips/{trip['id']}/activities/{activity['id']}",
        json={"name": "Eiffel Tower Night Show", "cost": 25.0},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Eiffel Tower Night Show"
    assert data["cost"] == 25.0
    assert data["trip_id"] == trip["id"]


def test_update_activity_not_found(client, trip):
    response = client.put(
        f"/api/v1/trips/{trip['id']}/activities/nonexistent-id",
        json={"name": "Nope"},
    )
    assert response.status_code == 404


def test_delete_activity(client, trip, activity):
    response = client.delete(f"/api/v1/trips/{trip['id']}/activities/{activity['id']}")
    assert response.status_code == 204
    get_response = client.get(f"/api/v1/trips/{trip['id']}/activities/{activity['id']}")
    assert get_response.status_code == 404


def test_delete_activity_not_found(client, trip):
    response = client.delete(f"/api/v1/trips/{trip['id']}/activities/nonexistent-id")
    assert response.status_code == 404


def test_activity_belongs_to_trip(client):
    # Create two trips
    t1 = client.post("/api/v1/trips", json={"name": "Trip A", "destination": "A"}).json()
    t2 = client.post("/api/v1/trips", json={"name": "Trip B", "destination": "B"}).json()
    # Create activity under trip 1
    act = client.post(
        f"/api/v1/trips/{t1['id']}/activities",
        json={"name": "Activity A"},
    ).json()
    # Try to access activity via trip 2 — should 404
    response = client.get(f"/api/v1/trips/{t2['id']}/activities/{act['id']}")
    assert response.status_code == 404
