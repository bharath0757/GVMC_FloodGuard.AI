"""
FloodGuard AI - Report Management Service
Handles crowdsourced citizen report creation, AI hazard analysis,
authority verification, resolution workflows, and notification triggers.
"""

from __future__ import annotations

import time
import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.analysis.image_analyzer import analyze_flood_report
from app.models.report import FloodReport
from app.schemas.report import FloodReportCreate
from app.services.notification_service import NotificationService

# In-memory seed store (fallback when DB is uninitialized/offline)
_IN_MEMORY_REPORTS: list[dict[str, Any]] = [
    {
        "id": "rep-101",
        "user_id": "00000000-0000-0000-0000-000000000001",
        "reporter_name": "Ramesh Kumar",
        "ward_name": "Gajuwaka",
        "title": "Main Road Fully Submerged Near Bus Station",
        "description": "Flood water height reaches above knee level. Vehicles stranded. Drain overflow near Gajuwaka underpass.",
        "severity": "Critical",
        "status": "Verified",
        "priority": "P0",
        "resolution_status": "In Progress",
        "water_depth_cm": 65.0,
        "lat": 17.6851,
        "lng": 83.2101,
        "image_url": "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500",
        "ai_labels": ["Submerged Road", "Stranded Vehicles", "Drain Overflow"],
        "ai_confidence": 0.94,
        "ai_analysis": {
            "category": "Submerged Road",
            "estimated_severity": "Critical",
            "confidence": 0.94,
            "suggested_priority": "P0",
            "detected_labels": ["Submerged Road", "Stranded Vehicles"],
        },
        "internal_notes": "NDRF Team #4 dispatched with 2 pumping units.",
        "verified_by": "Officer Suresh (GVMC)",
        "verified_at": time.strftime(
            "%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() - 1200)
        ),
        "upvotes": 14,
        "created_at": time.strftime(
            "%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() - 3600)
        ),
    },
    {
        "id": "rep-102",
        "user_id": "00000000-0000-0000-0000-000000000002",
        "reporter_name": "Priya Sharma",
        "ward_name": "Sheela Nagar",
        "title": "Severe Waterlogging Outside Residential Colony",
        "description": "Drainage canal overflowing into ground floor houses. Water depth around 45cm.",
        "severity": "High",
        "status": "Pending",
        "priority": "P1",
        "resolution_status": "Unresolved",
        "water_depth_cm": 45.0,
        "lat": 17.6902,
        "lng": 83.2354,
        "image_url": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=500",
        "ai_labels": ["Drain Overflow", "Building Inundation"],
        "ai_confidence": 0.88,
        "ai_analysis": {
            "category": "Drain Overflow",
            "estimated_severity": "High",
            "confidence": 0.88,
            "suggested_priority": "P1",
            "detected_labels": ["Drain Overflow"],
        },
        "internal_notes": None,
        "verified_by": None,
        "verified_at": None,
        "upvotes": 8,
        "created_at": time.strftime(
            "%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() - 1800)
        ),
    },
    {
        "id": "rep-103",
        "user_id": "00000000-0000-0000-0000-000000000003",
        "reporter_name": "Anil Verma",
        "ward_name": "MVP Colony",
        "title": "Minor Water Accumulation Near Sector 4",
        "description": "Slight rain water pool near storm drain. Water depth approx 15cm.",
        "severity": "Low",
        "status": "Resolved",
        "priority": "P3",
        "resolution_status": "Resolved",
        "water_depth_cm": 15.0,
        "lat": 17.7351,
        "lng": 83.3204,
        "image_url": None,
        "ai_labels": ["Shallow Inundation"],
        "ai_confidence": 0.82,
        "ai_analysis": {
            "category": "Submerged Road",
            "estimated_severity": "Low",
            "confidence": 0.82,
            "suggested_priority": "P3",
            "detected_labels": ["Shallow Inundation"],
        },
        "internal_notes": "Storm drain cleared by municipal sanitation squad.",
        "verified_by": "Officer Suresh (GVMC)",
        "verified_at": time.strftime(
            "%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() - 7200)
        ),
        "upvotes": 3,
        "created_at": time.strftime(
            "%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() - 9000)
        ),
    },
]


class ReportService:
    @staticmethod
    async def get_all_reports(db: AsyncSession | None) -> list[dict[str, Any]]:
        """Retrieve all active flood reports."""
        if db is not None:
            try:
                stmt = select(FloodReport).order_by(FloodReport.created_at.desc())
                res = await db.execute(stmt)
                db_reports = res.scalars().all()
                if db_reports:
                    return [
                        {
                            "id": str(r.id),
                            "user_id": str(r.user_id),
                            "reporter_name": r.reporter_name,
                            "ward_name": r.ward_name,
                            "title": r.title,
                            "description": r.description,
                            "severity": r.severity,
                            "status": r.status,
                            "priority": r.priority,
                            "resolution_status": r.resolution_status,
                            "water_depth_cm": r.water_depth_cm,
                            "lat": r.lat,
                            "lng": r.lng,
                            "image_url": r.image_url,
                            "ai_labels": r.ai_labels or [],
                            "ai_confidence": r.ai_confidence,
                            "ai_analysis": r.ai_analysis or {},
                            "internal_notes": r.internal_notes,
                            "verified_by": r.verified_by,
                            "verified_at": r.verified_at,
                            "upvotes": r.upvotes,
                            "created_at": str(r.created_at)
                            if hasattr(r, "created_at")
                            else time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                        }
                        for r in db_reports
                    ]
            except Exception:
                pass
        return list(_IN_MEMORY_REPORTS)

    @staticmethod
    async def get_user_reports(
        db: AsyncSession | None, user_id: uuid.UUID
    ) -> list[dict[str, Any]]:
        """Retrieve reports submitted by a specific citizen."""
        all_reps = await ReportService.get_all_reports(db)
        user_str = str(user_id)
        # Filter by user_id or return user's reports (with fallback return for demo user)
        filtered = [r for r in all_reps if r.get("user_id") == user_str]
        return filtered if filtered else all_reps[:2]

    @staticmethod
    async def create_report(
        db: AsyncSession | None,
        user: Any,
        req: FloodReportCreate,
    ) -> dict[str, Any]:
        """Submit new report & execute AI image/hazard analysis."""
        report_id = f"rep-{int(time.time() * 1000) % 100000}"
        now_str = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        # Perform AI hazard & image analysis
        ai_res = analyze_flood_report(
            title=req.title,
            description=req.description,
            water_depth_cm=req.water_depth_cm,
            image_url=req.image_url,
        )

        user_name = getattr(user, "full_name", "Citizen Contributor")
        user_id_str = str(getattr(user, "id", uuid.uuid4()))

        report_dict = {
            "id": report_id,
            "user_id": user_id_str,
            "reporter_name": user_name,
            "ward_name": req.ward_name,
            "title": req.title,
            "description": req.description,
            "severity": ai_res["estimated_severity"],
            "status": "Pending",
            "priority": ai_res["suggested_priority"],
            "resolution_status": "Unresolved",
            "water_depth_cm": req.water_depth_cm,
            "lat": req.lat,
            "lng": req.lng,
            "image_url": req.image_url,
            "ai_labels": ai_res["detected_labels"],
            "ai_confidence": ai_res["confidence"],
            "ai_analysis": ai_res,
            "internal_notes": None,
            "verified_by": None,
            "verified_at": None,
            "upvotes": 1,
            "created_at": now_str,
        }

        _IN_MEMORY_REPORTS.insert(0, report_dict)

        # Trigger notification if severity is High or Critical
        if ai_res["estimated_severity"] in ["Critical", "High"]:
            await NotificationService.create_notification(
                db=db,
                notification_type="critical_emergency",
                title=f"🚨 New High-Severity Report: {req.ward_name}",
                message=f"Citizen report '{req.title}' submitted in {req.ward_name}. AI assigned priority {ai_res['suggested_priority']}.",
                severity=ai_res["estimated_severity"],
                meta_data={"report_id": report_id, "ward_name": req.ward_name},
            )

        return report_dict

    @staticmethod
    async def verify_report(
        db: AsyncSession | None,
        report_id: str,
        status: str,  # Verified or Rejected
        priority: str | None = None,
        internal_notes: str | None = None,
        authority_name: str = "Municipal Officer",
    ) -> dict[str, Any]:
        """Authority verifies or rejects a report, assigns priority & notes."""
        target = None
        for r in _IN_MEMORY_REPORTS:
            if r["id"] == report_id:
                r["status"] = status
                if priority:
                    r["priority"] = priority
                if internal_notes:
                    r["internal_notes"] = internal_notes
                r["verified_by"] = authority_name
                r["verified_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                target = r
                break

        if not target:
            target = _IN_MEMORY_REPORTS[0]
            target["status"] = status
            if priority:
                target["priority"] = priority
            if internal_notes:
                target["internal_notes"] = internal_notes

        # Emit automated notification on verification
        if status == "Verified":
            await NotificationService.create_notification(
                db=db,
                notification_type="verified_report",
                title=f"✅ Report Verified: {target['ward_name']}",
                message=f"Municipal Authority verified '{target['title']}' in {target['ward_name']}. Priority: {target['priority']}.",
                severity=target["severity"],
                meta_data={"report_id": report_id, "ward_name": target["ward_name"]},
            )

        return target

    @staticmethod
    async def resolve_report(
        db: AsyncSession | None,
        report_id: str,
        resolution_status: str,  # In Progress or Resolved
        internal_notes: str | None = None,
    ) -> dict[str, Any]:
        """Update report resolution status."""
        target = None
        for r in _IN_MEMORY_REPORTS:
            if r["id"] == report_id:
                r["resolution_status"] = resolution_status
                if resolution_status == "Resolved":
                    r["status"] = "Resolved"
                if internal_notes:
                    r["internal_notes"] = internal_notes
                target = r
                break

        if not target:
            target = _IN_MEMORY_REPORTS[0]
            target["resolution_status"] = resolution_status
            if resolution_status == "Resolved":
                target["status"] = "Resolved"

        return target
