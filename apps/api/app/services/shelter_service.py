from __future__ import annotations

import uuid
from collections.abc import Sequence

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.shelter import Shelter
from app.schemas.shelter import ShelterCreate


class ShelterService:
    @staticmethod
    async def get_all_shelters(db: AsyncSession) -> Sequence[Shelter]:
        stmt = select(Shelter).where(not Shelter.is_deleted).order_by(Shelter.name)
        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def get_shelter_by_id(db: AsyncSession, shelter_id: uuid.UUID) -> Shelter:
        stmt = select(Shelter).where(Shelter.id == shelter_id, not Shelter.is_deleted)
        result = await db.execute(stmt)
        shelter = result.scalar_one_or_none()
        if not shelter:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Shelter with id {shelter_id} not found",
            )
        return shelter

    @staticmethod
    async def create_shelter(db: AsyncSession, req: ShelterCreate) -> Shelter:
        new_shelter = Shelter(
            name=req.name,
            ward_name=req.ward_name,
            address=req.address,
            capacity=req.capacity,
            current_occupancy=0,
            contact_phone=req.contact_phone,
            is_accessible=req.is_accessible,
            amenities=req.amenities or ["Food Station", "First Aid"],
            status="Open",
            lat=req.lat,
            lng=req.lng,
        )
        db.add(new_shelter)
        await db.commit()
        await db.refresh(new_shelter)
        return new_shelter
