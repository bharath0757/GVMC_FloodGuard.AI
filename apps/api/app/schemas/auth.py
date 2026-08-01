from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2)
    role: str = Field("citizen", pattern="^(citizen|government|admin)$")
    language_pref: str = Field("en", pattern="^(en|te|hi)$")
    phone: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: str
    role: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str
