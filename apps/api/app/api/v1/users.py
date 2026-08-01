from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)) -> User:
    """
    Get profile information of currently authenticated user.
    """
    return current_user

@router.patch("/me", response_model=UserResponse)
async def update_me(
    req: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Update profile preferences of current user.
    """
    if req.full_name is not None:
        current_user.full_name = req.full_name
    if req.language_pref is not None:
        current_user.language_pref = req.language_pref
    if req.phone is not None:
        current_user.phone = req.phone

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user
