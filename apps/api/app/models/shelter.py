from __future__ import annotations

from typing import Any, Optional

from sqlalchemy import JSON, Boolean, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Shelter(Base):
    """
    Emergency relief shelter model.
    """

    __tablename__ = "shelters"

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    ward_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    address: Mapped[str] = mapped_column(String(500), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    current_occupancy: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    contact_phone: Mapped[str] = mapped_column(String(50), nullable=False)
    is_accessible: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    amenities: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)
    status: Mapped[str] = mapped_column(
        String(50), default="Open", nullable=False, index=True
    )
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lng: Mapped[float] = mapped_column(Float, nullable=False)
