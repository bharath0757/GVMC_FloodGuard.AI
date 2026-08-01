import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_reports_api(client: AsyncClient):
    # 1. Register & Login
    reg_payload = {
        "email": "reporter@example.com",
        "password": "Password123!",
        "full_name": "Reporter User",
        "role": "citizen",
    }
    reg_res = await client.post("/api/v1/auth/register", json=reg_payload)
    token = reg_res.json()["access_token"]

    # 2. List Reports
    list_res = await client.get("/api/v1/reports")
    assert list_res.status_code == 200

    # 3. Create Report with Bearer Token
    report_payload = {
        "ward_name": "Gajuwaka Industrial Zone",
        "title": "Water Stagnation test",
        "description": "2ft water accumulation",
        "severity": "High",
        "water_depth_cm": 60.0,
        "lat": 17.6868,
        "lng": 83.2185,
    }
    create_res = await client.post(
        "/api/v1/reports",
        json=report_payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["title"] == "Water Stagnation test"
