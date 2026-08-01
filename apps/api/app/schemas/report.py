from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class FloodReportResponse(BaseModel):
    id: str
    user_id: str
    reporter_name: str
    ward_name: str
    title: str
    description: str
    severity: str
    status: str
    priority: str = "P2"
    resolution_status: str = "Unresolved"
    water_depth_cm: float
    lat: float
    lng: float
    image_url: str | None = None
    ai_labels: list[str] | None = None
    ai_confidence: float = 0.0
    ai_analysis: Any | None = None
    internal_notes: str | None = None
    verified_by: str | None = None
    verified_at: str | None = None
    upvotes: int = 1
    created_at: str

    model_config = ConfigDict(from_attributes=True)


class FloodReportCreate(BaseModel):
    ward_name: str = Field(default="Gajuwaka")
    title: str = Field(..., description="Short report title")
    description: str = Field(..., description="Detailed description of flood situation")
    severity: str = Field(default="Medium")
    water_depth_cm: float = Field(default=30.0, ge=0.0)
    lat: float = Field(default=17.6851)
    lng: float = Field(default=83.2101)
    image_url: str | None = Field(default=None)


class VerifyReportRequest(BaseModel):
    status: str = Field(default="Verified", description="Verified or Rejected")
    priority: str | None = Field(default="P1", description="P0, P1, P2, P3")
    internal_notes: str | None = Field(default=None)
    authority_name: str | None = Field(default="Municipal Officer")


class ResolveReportRequest(BaseModel):
    resolution_status: str = Field(
        default="Resolved", description="In Progress or Resolved"
    )
    internal_notes: str | None = Field(default=None)
