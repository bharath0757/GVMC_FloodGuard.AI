from typing import Optional

from app.core.database import get_db

# Re-exporting for easier imports in endpoints
__all__ = ["get_db", "get_current_user", "get_redis"]


async def get_current_user() -> Optional[dict]:
    """
    Placeholder dependency for retrieving the current authenticated user.
    """
    return None


async def get_redis() -> Optional[dict]:
    """
    Placeholder dependency for getting a Redis connection.
    """
    return None
