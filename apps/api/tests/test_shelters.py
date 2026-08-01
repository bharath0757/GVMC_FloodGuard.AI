import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_shelters_api(client: AsyncClient):
    # Fetch list of shelters
    response = await client.get("/api/v1/shelters")
    assert response.status_code == 200
    shelters = response.json()
    assert isinstance(shelters, list)
