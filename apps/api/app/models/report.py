from __future__ import annotations

import uuid
from typing import Optional, Any
from sqlalchemy import String, Float, ForeignKey, JSON, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class FloodReport(Base):
    """
    Crowdsourced flood incident report model.
    Includes verification workflow, priority assignment, internal notes,
    and automated AI image/hazard analysis.
    """
    __tablename__ = "flood_reports"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    reporter_name: Mapped[str] = mapped_column(String(255), nullable=False)
    ward_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=False)
    severity: Mapped[str] = mapped_column(String(50), default="Medium", nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(50), default="Pending", nullable=False, index=True) # Pending, Verified, Rejected, Resolved
    priority: Mapped[str] = mapped_column(String(20), default="P2", nullable=False, index=True) # P0, P1, P2, P3
    resolution_status: Mapped[str] = mapped_column(String(50), default="Unresolved", nullable=False, index=True) # Unresolved, In Progress, Resolved
    water_depth_cm: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lng: Mapped[float] = mapped_column(Float, nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    ai_labels: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)
    ai_confidence: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    ai_analysis: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True) # Full AI analysis object
    internal_notes: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)
    verified_by: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    verified_at: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)
    upvotes: Mapped[int] = mapped_column(default=0, nullable=False)

    user: Mapped["User"] = relationship("User")
