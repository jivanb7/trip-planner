def test_create_packing_item(client, trip):
    response = client.post(
        f"/api/v1/trips/{trip['id']}/packing",
        json={"name": "Sunscreen", "category": "toiletries", "quantity": 2},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Sunscreen"
    assert data["category"] == "toiletries"
    assert data["quantity"] == 2
    assert data["packed"] is False
    assert data["trip_id"] == trip["id"]


def test_create_packing_item_defaults(client, trip):
    response = client.post(
        f"/api/v1/trips/{trip['id']}/packing",
        json={"name": "Toothbrush"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["category"] == "general"
    assert data["quantity"] == 1
    assert data["packed"] is False


def test_create_packing_item_trip_not_found(client):
    response = client.post(
        "/api/v1/trips/nonexistent-id/packing",
        json={"name": "Passport"},
    )
    assert response.status_code == 404


def test_list_packing_empty(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}/packing")
    assert response.status_code == 200
    assert response.json() == []


def test_list_packing(client, trip, packing_item):
    response = client.get(f"/api/v1/trips/{trip['id']}/packing")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == packing_item["id"]


def test_get_packing_item(client, trip, packing_item):
    response = client.get(f"/api/v1/trips/{trip['id']}/packing/{packing_item['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == packing_item["id"]


def test_get_packing_item_not_found(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}/packing/nonexistent-id")
    assert response.status_code == 404


def test_update_packing_item(client, trip, packing_item):
    response = client.put(
        f"/api/v1/trips/{trip['id']}/packing/{packing_item['id']}",
        json={"packed": True, "quantity": 3},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["packed"] is True
    assert data["quantity"] == 3
    assert data["name"] == packing_item["name"]


def test_update_packing_item_not_found(client, trip):
    response = client.put(
        f"/api/v1/trips/{trip['id']}/packing/nonexistent-id",
        json={"packed": True},
    )
    assert response.status_code == 404


def test_delete_packing_item(client, trip, packing_item):
    response = client.delete(f"/api/v1/trips/{trip['id']}/packing/{packing_item['id']}")
    assert response.status_code == 204
    get_response = client.get(f"/api/v1/trips/{trip['id']}/packing/{packing_item['id']}")
    assert get_response.status_code == 404


def test_delete_packing_item_not_found(client, trip):
    response = client.delete(f"/api/v1/trips/{trip['id']}/packing/nonexistent-id")
    assert response.status_code == 404


def test_mark_item_packed(client, trip):
    item = client.post(
        f"/api/v1/trips/{trip['id']}/packing",
        json={"name": "Laptop", "category": "electronics"},
    ).json()
    assert item["packed"] is False

    response = client.put(
        f"/api/v1/trips/{trip['id']}/packing/{item['id']}",
        json={"packed": True},
    )
    assert response.status_code == 200
    assert response.json()["packed"] is True
