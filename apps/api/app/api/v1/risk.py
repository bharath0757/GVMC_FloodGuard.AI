from __future__ import annotations

from typing import Sequence
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.risk_zone import RiskZone
from app.schemas.risk_zone import RiskZoneResponse
from app.services.risk_service import RiskService

router = APIRouter()

@router.get("", response_model=list[RiskZoneResponse])
async def list_risk_zones(db: AsyncSession = Depends(get_db)) -> Sequence[RiskZone]:
    """
    Get ward flood risk scores and categories.
    """
    return await RiskService.get_all_risk_zones(db)
