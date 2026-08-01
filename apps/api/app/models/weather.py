from __future__ import annotations

from sqlalchemy import String, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class WeatherSnapshot(Base):
    """
    Meteorological sensor telemetry model.
    """
    __tablename__ = "weather_snapshots"

    temperature_c: Mapped[float] = mapped_column(Float, nullable=False)
    humidity_percent: Mapped[float] = mapped_column(Float, nullable=False)
    rainfall_mm_hr: Mapped[float] = mapped_column(Float, nullable=False)
    rainfall_cumulative_24h: Mapped[float] = mapped_column(Float, nullable=False)
    wind_speed_kmh: Mapped[float] = mapped_column(Float, nullable=False)
    wind_direction: Mapped[str] = mapped_column(String(50), nullable=False)
    tide_level_m: Mapped[float] = mapped_column(Float, nullable=False)
    sea_level_trend: Mapped[str] = mapped_column(String(100), nullable=False)
    forecast_summary: Mapped[str] = mapped_column(String(500), nullable=False)
