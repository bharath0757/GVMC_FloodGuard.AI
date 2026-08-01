from __future__ import annotations

from functools import lru_cache
from typing import List, Union

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict



class Settings(BaseSettings):
    """
    Application configuration settings.
    """
    APP_NAME: str = "FloodGuard AI"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/floodguard"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["*"]
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    
    # JWT
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        case_sensitive=True,
        extra="ignore"
    )

    @field_validator("ALLOWED_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str]:
        """
        Parse comma-separated string to list of origins.
        """
        if isinstance(v, str):
            return [i.strip() for i in v.split(",") if i.strip()]
        return v


@lru_cache()
def get_settings() -> Settings:
    """
    Get the application settings singleton.
    Lazy loaded and cached.
    """
    return Settings()


# Singleton instance accessible module-wide
settings = get_settings()
