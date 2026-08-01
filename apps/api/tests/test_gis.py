import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_gis_shelters_geojson(client: AsyncClient):
    response = await client.get("/api/v1/gis/shelters")
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "FeatureCollection"
    assert "features" in data

@pytest.mark.asyncio
async def test_gis_reports_geojson(client: AsyncClient):
    response = await client.get("/api/v1/gis/reports")
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "FeatureCollection"
    assert "features" in data

@pytest.mark.asyncio
async def test_gis_risk_zones_geojson(client: AsyncClient):
    response = await client.get("/api/v1/gis/risk-zones")
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "FeatureCollection"
    assert "features" in data
