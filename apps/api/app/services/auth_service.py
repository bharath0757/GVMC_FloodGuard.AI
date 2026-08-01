from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse


class AuthService:
    @staticmethod
    async def register_user(db: AsyncSession, req: RegisterRequest) -> TokenResponse:
        # Check if email exists
        stmt = select(User).where(User.email == req.email.lower(), not User.is_deleted)
        result = await db.execute(stmt)
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists",
            )

        new_user = User(
            email=req.email.lower(),
            password_hash=get_password_hash(req.password),
            full_name=req.full_name,
            role=req.role,
            language_pref=req.language_pref,
            phone=req.phone,
        )
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        access_token = create_access_token(subject=new_user.id, role=new_user.role)
        refresh_token = create_refresh_token(subject=new_user.id, role=new_user.role)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user_id=str(new_user.id),
            email=new_user.email,
            full_name=new_user.full_name,
            role=new_user.role,
        )

    @staticmethod
    async def login_user(db: AsyncSession, req: LoginRequest) -> TokenResponse:
        stmt = select(User).where(User.email == req.email.lower(), not User.is_deleted)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user or not verify_password(req.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user account",
            )

        access_token = create_access_token(subject=user.id, role=user.role)
        refresh_token = create_refresh_token(subject=user.id, role=user.role)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user_id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            role=user.role,
        )

    @staticmethod
    async def refresh_token(db: AsyncSession, refresh_token_str: str) -> TokenResponse:
        try:
            payload = decode_token(refresh_token_str)
            if payload.get("type") != "refresh":
                raise HTTPException(status_code=401, detail="Invalid token type")
            user_id = payload.get("sub")
        except Exception as e:
            raise HTTPException(status_code=401, detail="Invalid refresh token") from e

        stmt = select(User).where(
            User.id == user_id, User.is_active, not User.is_deleted
        )
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        access_token = create_access_token(subject=user.id, role=user.role)
        new_refresh_token = create_refresh_token(subject=user.id, role=user.role)

        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            user_id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            role=user.role,
        )
