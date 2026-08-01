from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class WeatherSnapshotResponse(BaseModel):
    id: uuid.UUID
    temperature_c: float
    humidity_percent: float
    rainfall_mm_hr: float
    rainfall_cumulative_24h: float
    wind_speed_kmh: float
    wind_direction: str
    tide_level_m: float
    sea_level_trend: str
    forecast_summary: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
