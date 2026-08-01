from __future__ import annotations

import uuid
from collections.abc import AsyncGenerator
from typing import Callable, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.db.session import AsyncSessionLocal
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency yielding async database session per request.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> User:
    """
    Dependency decoding JWT Bearer token and retrieving current User model instance.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        user_id_str: str = payload.get("sub")
        token_type: str = payload.get("type")
        if user_id_str is None or token_type != "access":
            raise credentials_exception
        user_id = uuid.UUID(user_id_str)
    except (JWTError, ValueError) as e:
        raise credentials_exception from e

    stmt = select(User).where(User.id == user_id, User.is_active, not User.is_deleted)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception

    return user


def require_role(allowed_roles: list[str]) -> Callable:
    """
    Dependency factory enforcing role-based authorization (e.g. government, admin).
    """

    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User role '{current_user.role}' is not authorized to access this resource",
            )
        return current_user

    return role_checker


async def get_current_user_optional(
    db: AsyncSession = Depends(get_db),
    token: Optional[str] = Depends(
        OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)
    ),
) -> Optional[User]:
    """
    Optional user dependency returning User if token present and valid, otherwise None.
    """
    if not token:
        return None
    try:
        return await get_current_user(db, token)
    except Exception:
        return None
