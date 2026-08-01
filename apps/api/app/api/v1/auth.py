from __future__ import annotations

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, RefreshTokenRequest
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    """
    Register a new citizen or government officer account.
    """
    return await AuthService.register_user(db, req)

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    """
    Authenticate user credentials and return JWT access & refresh tokens.
    """
    return await AuthService.login_user(db, req)

@router.post("/refresh", response_model=TokenResponse)
async def refresh(req: RefreshTokenRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    """
    Refresh an expired JWT access token using a valid refresh token.
    """
    return await AuthService.refresh_token(db, req.refresh_token)

@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout() -> dict[str, str]:
    """
    Revoke user session and invalidate local tokens.
    """
    return {"message": "Successfully logged out"}
