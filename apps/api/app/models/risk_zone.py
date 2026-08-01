from __future__ import annotations

from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class RiskZone(Base):
    """
    Municipal Ward flood risk category model.
    """

    __tablename__ = "risk_zones"

    ward_number: Mapped[int] = mapped_column(
        Integer, unique=True, index=True, nullable=False
    )
    ward_name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    risk_score: Mapped[int] = mapped_column(
        Integer, nullable=False, index=True
    )  # 0 - 100
    risk_category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    population: Mapped[int] = mapped_column(Integer, nullable=False)
    elevation_meters: Mapped[float] = mapped_column(Float, nullable=False)
    water_level_cm: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    rainfall_mm_hr: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    active_alerts_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
