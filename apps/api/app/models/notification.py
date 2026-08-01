from __future__ import annotations

import uuid
from typing import Optional, Any
from sqlalchemy import String, Boolean, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class Notification(Base):
    """
    Notification model for system alerts, verified reports, high-risk warnings,
    and shelter capacity alerts.
    """
    __tablename__ = "notifications"

    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    notification_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True) # high_risk_prediction, verified_report, shelter_capacity_warning, critical_emergency
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(String(1000), nullable=False)
    severity: Mapped[str] = mapped_column(String(50), default="Medium", nullable=False, index=True) # Critical, High, Medium, Low
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    meta_data: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)

    user: Mapped[Optional["User"]] = relationship("User")
