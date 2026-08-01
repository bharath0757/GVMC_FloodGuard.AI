from __future__ import annotations

from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.alert import Alert


class AlertService:
    @staticmethod
    async def get_active_alerts(db: AsyncSession) -> Sequence[Alert]:
        stmt = (
            select(Alert)
            .where(Alert.active, not Alert.is_deleted)
            .order_by(Alert.created_at.desc())
        )
        result = await db.execute(stmt)
        return result.scalars().all()
