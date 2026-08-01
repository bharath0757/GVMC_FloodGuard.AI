import pytest
from httpx import AsyncClient

from app import __version__


@pytest.mark.asyncio
async def test_root(client: AsyncClient) -> None:
    """
    Test the root endpoint returns expected application info.
    """
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert data["version"] == __version__
    assert data["docs_url"] == "/docs"


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient) -> None:
    """
    Test the top-level health endpoint.
    """
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["version"] == __version__
    assert "timestamp" in data


@pytest.mark.asyncio
async def test_readiness_check(client: AsyncClient) -> None:
    """
    Test the top-level readiness endpoint.
    """
    response = await client.get("/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"
    assert data["checks"]["database"] is True
    assert data["checks"]["redis"] is True


@pytest.mark.asyncio
async def test_v1_health_check(client: AsyncClient) -> None:
    """
    Test the API v1 health endpoint.
    """
    response = await client.get("/api/v1/system/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_v1_readiness_check(client: AsyncClient) -> None:
    """
    Test the API v1 readiness endpoint.
    """
    response = await client.get("/api/v1/system/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"
