from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class ShelterResponse(BaseModel):
    id: uuid.UUID
    name: str
    ward_name: str
    address: str
    capacity: int
    current_occupancy: int
    contact_phone: str
    is_accessible: bool
    amenities: Any | None = None
    status: str
    lat: float
    lng: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ShelterCreate(BaseModel):
    name: str
    ward_name: str
    address: str
    capacity: int
    contact_phone: str
    is_accessible: bool = True
    amenities: list[str] | None = None
    lat: float
    lng: float
