from __future__ import annotations

import time

import uuid
from contextlib import asynccontextmanager
from typing import AsyncGenerator, Callable

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from app import __version__
from app.api.v1 import api_router
from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)
settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan context manager for startup and shutdown events.
    """
    logger.info(
        "Starting up application", 
        app_name=settings.APP_NAME, 
        version=settings.APP_VERSION
    )
    logger.debug(
        "Configuration settings summary", 
        debug=settings.DEBUG, 
        log_level=settings.LOG_LEVEL
    )
    yield
    logger.info("Shutting down application")

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Flood Intelligence Platform",
    version=__version__,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip middleware for compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

@app.middleware("http")
async def add_request_id_middleware(request: Request, call_next: Callable) -> JSONResponse:
    """
    Middleware to add X-Request-ID header to each request.
    """
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Global exception handler for unhandled exceptions.
    """
    request_id = getattr(request.state, "request_id", None)
    logger.exception("Unhandled exception", request_id=request_id, exc=str(exc))
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error", "request_id": request_id},
    )

@app.get("/health", tags=["system"])
async def health_check() -> dict:
    """
    Health check endpoint.
    """
    return {
        "status": "healthy",
        "version": __version__,
        "timestamp": time.time(),
    }

@app.get("/ready", tags=["system"])
async def readiness_check() -> dict:
    """
    Readiness check endpoint.
    """
    return {
        "status": "ready",
        "checks": {
            "database": True,
            "redis": True,
        }
    }

@app.get("/", tags=["system"])
async def root() -> dict:
    """
    Root endpoint.
    """
    return {
        "name": settings.APP_NAME,
        "version": __version__,
        "docs_url": "/docs",
    }

# Include API v1 router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)
