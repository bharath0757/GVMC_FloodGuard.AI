"""
FloodGuard AI - REST API Endpoints: /assistant/*
Domain-specific Flood Assistant endpoints for citizen Q&A, risk queries,
shelter advice, road blockages, and emergency precautions.
"""

from __future__ import annotations

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from app.ai.assistant.flood_assistant import (
    get_assistant_suggestions,
    process_assistant_query,
)

router = APIRouter()


class AssistantQueryRequest(BaseModel):
    query: str = Field(..., description="Citizen flood query e.g. 'Is Gajuwaka safe?'")
    user_lat: float = Field(default=17.6868, ge=15.0, le=25.0)
    user_lng: float = Field(default=83.2185, ge=78.0, le=90.0)


@router.get("/query", summary="Query Flood Assistant via GET")
async def query_assistant_get(
    q: str = Query(..., description="Flood query string"),
    lat: float = Query(default=17.6868),
    lng: float = Query(default=83.2185),
) -> JSONResponse:
    """
    Query the domain-specific Flood Assistant via GET query parameter.
    """
    res = process_assistant_query(query=q, user_lat=lat, user_lng=lng)
    return JSONResponse(content=res)


@router.post("/query", summary="Query Flood Assistant via POST")
async def query_assistant_post(payload: AssistantQueryRequest) -> JSONResponse:
    """
    Query the domain-specific Flood Assistant via POST body.
    """
    res = process_assistant_query(
        query=payload.query,
        user_lat=payload.user_lat,
        user_lng=payload.user_lng,
    )
    return JSONResponse(content=res)


@router.get("/suggestions", summary="Get pre-built query suggestions")
async def get_suggestions() -> JSONResponse:
    """
    Returns pre-built flood query suggestions for the citizen UI.
    """
    suggestions = get_assistant_suggestions()
    return JSONResponse(
        content={
            "total_suggestions": len(suggestions),
            "suggestions": suggestions,
        }
    )
