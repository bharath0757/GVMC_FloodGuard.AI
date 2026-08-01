from __future__ import annotations

import time
from fastapi import APIRouter
from app import __version__

router = APIRouter()

@router.get("/health")
async def v1_health() -> dict:
    return {"status": "healthy", "version": __version__, "timestamp": time.time()}

@router.get("/ready")
async def v1_ready() -> dict:
    return {"status": "ready", "checks": {"database": True, "redis": True}}
