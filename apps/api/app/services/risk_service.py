from __future__ import annotations

from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.risk_zone import RiskZone


class RiskService:
    @staticmethod
    async def get_all_risk_zones(db: AsyncSession) -> Sequence[RiskZone]:
        stmt = select(RiskZone).order_by(RiskZone.risk_score.desc())
        result = await db.execute(stmt)
        return result.scalars().all()
