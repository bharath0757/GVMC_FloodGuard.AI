from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.weather import WeatherSnapshot

class WeatherService:
    @staticmethod
    async def get_latest_weather(db: AsyncSession) -> WeatherSnapshot:
        stmt = select(WeatherSnapshot).order_by(WeatherSnapshot.created_at.desc()).limit(1)
        result = await db.execute(stmt)
        snapshot = result.scalar_one_or_none()
        if not snapshot:
            # Fallback mock object if table empty
            return WeatherSnapshot(
                temperature_c=27.4,
                humidity_percent=89.0,
                rainfall_mm_hr=42.8,
                rainfall_cumulative_24h=184.2,
                wind_speed_kmh=34.5,
                wind_direction="SSW",
                tide_level_m=2.15,
                sea_level_trend="Rising (+0.12m/hr)",
                forecast_summary="Heavy to very heavy rainfall expected in coastal wards.",
            )
        return snapshot
