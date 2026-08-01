from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RiskZoneResponse(BaseModel):
    id: uuid.UUID
    ward_number: int
    ward_name: str
    risk_score: int
    risk_category: str
    population: int
    elevation_meters: float
    water_level_cm: float
    rainfall_mm_hr: float
    active_alerts_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
