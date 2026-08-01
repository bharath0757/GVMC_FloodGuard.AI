from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.weather import WeatherSnapshot
from app.schemas.weather import WeatherSnapshotResponse
from app.services.weather_service import WeatherService

router = APIRouter()

@router.get("/latest", response_model=WeatherSnapshotResponse)
async def get_latest_weather(db: AsyncSession = Depends(get_db)) -> WeatherSnapshot:
    """
    Get latest meteorological sensor telemetry snapshot.
    """
    return await WeatherService.get_latest_weather(db)
