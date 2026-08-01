from __future__ import annotations

import uuid
from typing import Sequence
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, require_role
from app.models.shelter import Shelter
from app.models.user import User
from app.schemas.shelter import ShelterResponse, ShelterCreate
from app.services.shelter_service import ShelterService

router = APIRouter()

@router.get("", response_model=list[ShelterResponse])
async def list_shelters(db: AsyncSession = Depends(get_db)) -> Sequence[Shelter]:
    """
    List all active relief shelters.
    """
    return await ShelterService.get_all_shelters(db)

@router.get("/{id}", response_model=ShelterResponse)
async def get_shelter(id: uuid.UUID, db: AsyncSession = Depends(get_db)) -> Shelter:
    """
    Get detailed information for a specific shelter.
    """
    return await ShelterService.get_shelter_by_id(db, id)

@router.post("", response_model=ShelterResponse, status_code=status.HTTP_201_CREATED)
async def create_shelter(
    req: ShelterCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["government", "admin"])),
) -> Shelter:
    """
    Create a new shelter entry (Government Authorities & Admins only).
    """
    return await ShelterService.create_shelter(db, req)
