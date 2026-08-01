import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_and_login_user(client: AsyncClient):
    # 1. Register User
    reg_payload = {
        "email": "testcitizen@example.com",
        "password": "Password123!",
        "full_name": "Test Citizen",
        "role": "citizen",
        "language_pref": "en",
        "phone": "+919848012345",
    }
    response = await client.post("/api/v1/auth/register", json=reg_payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["email"] == "testcitizen@example.com"

    # 2. Login User
    login_payload = {
        "email": "testcitizen@example.com",
        "password": "Password123!",
    }
    login_res = await client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data

    # 3. Incorrect Password
    bad_login = await client.post("/api/v1/auth/login", json={"email": "testcitizen@example.com", "password": "WrongPassword"})
    assert bad_login.status_code == 401
