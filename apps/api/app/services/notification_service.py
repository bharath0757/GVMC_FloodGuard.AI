from __future__ import annotations

from typing import Optional

"""
FloodGuard AI - System Notification Service
Manages automated creation, persistence, and querying of system notifications
for high-risk predictions, verified reports, shelter capacity warnings, and emergency alerts.
"""


import time
import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification

# In-memory notification store fallback
_NOTIFICATION_STORE: list[dict[str, Any]] = [
    {
        "id": "notif-1",
        "notification_type": "high_risk_prediction",
        "title": "🚨 Critical Flood Warning: Ward 14 (Gajuwaka)",
        "message": "XGBoost model predicts 88.2 risk score with 68.2mm/h rainfall. Immediate evacuation advisory.",
        "severity": "Critical",
        "is_read": False,
        "created_at": time.strftime(
            "%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() - 300)
        ),
        "meta_data": {"ward_number": 14, "risk_score": 88.2},
    },
    {
        "id": "notif-2",
        "notification_type": "verified_report",
        "title": "✅ Crowd Report Verified: Submerged Road",
        "message": "Municipal authority verified flood report at Gajuwaka Main Road (65cm water depth). Assigned priority P1.",
        "severity": "High",
        "is_read": False,
        "created_at": time.strftime(
            "%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() - 900)
        ),
        "meta_data": {"report_id": "rep-101", "ward_name": "Gajuwaka"},
    },
    {
        "id": "notif-3",
        "notification_type": "shelter_capacity_warning",
        "title": "⚠️ Shelter Capacity Alert: Gajuwaka Sports Stadium",
        "message": "Occupancy reached 79% (950 / 1200 capacity). Secondary shelter AU Complex opened.",
        "severity": "Medium",
        "is_read": True,
        "created_at": time.strftime(
            "%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() - 1800)
        ),
        "meta_data": {"shelter_name": "Gajuwaka Sports Stadium", "occupancy_pct": 79.1},
    },
    {
        "id": "notif-4",
        "notification_type": "critical_emergency",
        "title": "📢 GVMC Monsoon Warning Stage 3",
        "message": "Monsoon Stage 3 active for Visakhapatnam coastal wards. Emergency hotline 1077 active 24x7.",
        "severity": "High",
        "is_read": True,
        "created_at": time.strftime(
            "%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() - 3600)
        ),
        "meta_data": {"helpline": "1077"},
    },
]


class NotificationService:
    @staticmethod
    async def create_notification(
        db: Optional[AsyncSession],
        notification_type: str,
        title: str,
        message: str,
        severity: str = "Medium",
        user_id: Optional[uuid.UUID] = None,
        meta_data: dict[str, Optional[Any]] = None,
    ) -> dict[str, Any]:
        """Creates a new notification in DB and in-memory fallback list."""
        notif_id = str(uuid.uuid4())
        now_str = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        notif_dict = {
            "id": notif_id,
            "user_id": str(user_id) if user_id else None,
            "notification_type": notification_type,
            "title": title,
            "message": message,
            "severity": severity,
            "is_read": False,
            "created_at": now_str,
            "meta_data": meta_data or {},
        }

        # Add to in-memory fallback
        _NOTIFICATION_STORE.insert(0, notif_dict)

        # Also insert in database if session available
        if db is not None:
            try:
                db_notif = Notification(
                    id=uuid.UUID(notif_id),
                    user_id=user_id,
                    notification_type=notification_type,
                    title=title,
                    message=message,
                    severity=severity,
                    is_read=False,
                    meta_data=meta_data,
                )
                db.add(db_notif)
                await db.commit()
            except Exception:
                pass  # Suppress DB offline error, fallback handles it

        return notif_dict

    @staticmethod
    async def get_notifications(
        db: Optional[AsyncSession],
        notification_type: Optional[str] = None,
        unread_only: bool = False,
    ) -> list[dict[str, Any]]:
        """Retrieve system notifications."""
        items = list(_NOTIFICATION_STORE)
        if db is not None:
            try:
                stmt = select(Notification).order_by(Notification.created_at.desc())
                res = await db.execute(stmt)
                db_items = res.scalars().all()
                if db_items:
                    items = [
                        {
                            "id": str(n.id),
                            "user_id": str(n.user_id) if n.user_id else None,
                            "notification_type": n.notification_type,
                            "title": n.title,
                            "message": n.message,
                            "severity": n.severity,
                            "is_read": n.is_read,
                            "created_at": str(n.created_at)
                            if hasattr(n, "created_at")
                            else time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                            "meta_data": n.meta_data or {},
                        }
                        for n in db_items
                    ]
            except Exception:
                pass

        if notification_type:
            items = [i for i in items if i["notification_type"] == notification_type]
        if unread_only:
            items = [i for i in items if not i["is_read"]]

        return items

    @staticmethod
    async def mark_as_read(db: Optional[AsyncSession], notification_id: str) -> bool:
        """Mark a notification as read."""
        for i in _NOTIFICATION_STORE:
            if i["id"] == notification_id:
                i["is_read"] = True
                break
        return True

    @staticmethod
    async def mark_all_read(db: Optional[AsyncSession]) -> bool:
        """Mark all notifications as read."""
        for i in _NOTIFICATION_STORE:
            i["is_read"] = True
        return True
