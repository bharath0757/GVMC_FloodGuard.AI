from __future__ import annotations

from fastapi import APIRouter

from app.api.v1.ai import router as ai_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.assistant import router as assistant_router
from app.api.v1.auth import router as auth_router
from app.api.v1.gis import router as gis_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.reports import router as reports_router
from app.api.v1.risk import router as risk_router
from app.api.v1.shelters import router as shelters_router
from app.api.v1.system import router as system_router
from app.api.v1.users import router as users_router
from app.api.v1.weather import router as weather_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(shelters_router, prefix="/shelters", tags=["shelters"])
api_router.include_router(reports_router, prefix="/reports", tags=["reports"])
api_router.include_router(alerts_router, prefix="/alerts", tags=["alerts"])
api_router.include_router(weather_router, prefix="/weather", tags=["weather"])
api_router.include_router(risk_router, prefix="/risk-zones", tags=["risk-zones"])
api_router.include_router(gis_router, prefix="/gis", tags=["gis"])
api_router.include_router(ai_router, prefix="/ai", tags=["ai"])
api_router.include_router(
    notifications_router, prefix="/notifications", tags=["notifications"]
)
api_router.include_router(assistant_router, prefix="/assistant", tags=["assistant"])
api_router.include_router(system_router, prefix="/system", tags=["system"])

__all__ = ["api_router"]
