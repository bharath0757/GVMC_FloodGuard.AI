import time

from fastapi import APIRouter

from app import __version__

router = APIRouter()


@router.get("/health")
async def health_check() -> dict:
    """
    Basic health check endpoint for API v1.
    """
    return {
        "status": "healthy",
        "version": __version__,
        "timestamp": time.time(),
    }


@router.get("/ready")
async def readiness_check() -> dict:
    """
    Readiness check endpoint for API v1 with dependency checks.
    """
    return {
        "status": "ready",
        "checks": {
            "database": True,  # Placeholder for real DB check
            "redis": True,  # Placeholder for real Redis check
        },
    }
