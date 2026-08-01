from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class AlertResponse(BaseModel):
    id: uuid.UUID
    title: str
    severity: str
    affected_wards: Any
    message: str
    issued_by: str
    active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AlertCreate(BaseModel):
    title: str
    severity: str = "Warning"
    affected_wards: list[str]
    message: str
