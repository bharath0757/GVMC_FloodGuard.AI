from __future__ import annotations

from collections.abc import Sequence

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.alert import Alert
from app.schemas.alert import AlertResponse
from app.services.alert_service import AlertService

router = APIRouter()


@router.get("", response_model=list[AlertResponse])
async def list_alerts(db: AsyncSession = Depends(get_db)) -> Sequence[Alert]:
    """
    Get all active emergency broadcast alerts.
    """
    return await AlertService.get_active_alerts(db)
