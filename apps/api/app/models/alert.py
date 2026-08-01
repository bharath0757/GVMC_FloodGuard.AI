from __future__ import annotations

from sqlalchemy import JSON, Boolean, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Alert(Base):
    """
    Emergency broadcast alert model.
    """

    __tablename__ = "alerts"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    severity: Mapped[str] = mapped_column(
        String(50), default="Warning", nullable=False, index=True
    )
    affected_wards: Mapped[dict] = mapped_column(JSON, nullable=False)
    message: Mapped[str] = mapped_column(String(1000), nullable=False)
    issued_by: Mapped[str] = mapped_column(String(255), nullable=False)
    active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False, index=True
    )
