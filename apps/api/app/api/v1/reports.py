"""
FloodGuard AI - REST API Endpoints: /reports/*
Handles citizen report creation, image uploads, citizen history ('my'),
and government authority verification/resolution workflows.
"""
from __future__ import annotations

import uuid
import time
from typing import Sequence, List, Dict, Any, Optional
from fastapi import APIRouter, Depends, status, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_optional, get_db
from app.models.user import User
from app.schemas.report import (
    FloodReportCreate,
    VerifyReportRequest,
    ResolveReportRequest,
)
from app.services.report_service import ReportService

router = APIRouter()


@router.get("", summary="Get all flood incident reports")
async def list_reports(db: Optional[AsyncSession] = Depends(get_db)) -> JSONResponse:
    """List all crowdsourced flood incident reports."""
    reports = await ReportService.get_all_reports(db)
    return JSONResponse(content=reports)


@router.get("/my", summary="Get reports submitted by current user")
async def list_my_reports(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Optional[AsyncSession] = Depends(get_db),
) -> JSONResponse:
    """Get citizen's own submitted flood reports."""
    user_id = current_user.id if current_user else uuid.UUID("00000000-0000-0000-0000-000000000001")
    reports = await ReportService.get_user_reports(db, user_id)
    return JSONResponse(content=reports)


@router.post("", summary="Submit new flood report", status_code=status.HTTP_201_CREATED)
@router.post("/create", summary="Submit new flood report (alias)", status_code=status.HTTP_201_CREATED)
async def create_report(
    req: FloodReportCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Optional[AsyncSession] = Depends(get_db),
) -> JSONResponse:
    """Submit a new crowdsourced flood report & trigger AI analysis."""
    dummy_user = current_user or type('User', (), {
        "id": uuid.UUID("00000000-0000-0000-0000-000000000001"),
        "full_name": "Citizen Contributor",
    })()
    report = await ReportService.create_report(db, dummy_user, req)
    return JSONResponse(content=report, status_code=201)


@router.post("/upload-image", summary="Upload evidence image for a report")
async def upload_report_image(
    file: UploadFile = File(...),
) -> JSONResponse:
    """
    Simulates image file upload to S3/CDN.
    Returns uploaded image URL for frontend form integration.
    """
    filename = file.filename or "flood_photo.jpg"
    image_url = f"https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&filename={filename}"
    return JSONResponse(content={
        "status": "success",
        "filename": filename,
        "image_url": image_url,
        "content_type": file.content_type,
    })


@router.patch("/{report_id}/verify", summary="Verify or reject a citizen report")
async def verify_report(
    report_id: str,
    payload: VerifyReportRequest,
    db: Optional[AsyncSession] = Depends(get_db),
) -> JSONResponse:
    """Government authority verifies/rejects a report, assigns priority & notes."""
    result = await ReportService.verify_report(
        db=db,
        report_id=report_id,
        status=payload.status,
        priority=payload.priority,
        internal_notes=payload.internal_notes,
        authority_name=payload.authority_name or "Municipal Officer",
    )
    return JSONResponse(content=result)


@router.patch("/{report_id}/resolve", summary="Update resolution status of a report")
async def resolve_report(
    report_id: str,
    payload: ResolveReportRequest,
    db: Optional[AsyncSession] = Depends(get_db),
) -> JSONResponse:
    """Update resolution status (In Progress or Resolved)."""
    result = await ReportService.resolve_report(
        db=db,
        report_id=report_id,
        resolution_status=payload.resolution_status,
        internal_notes=payload.internal_notes,
    )
    return JSONResponse(content=result)
