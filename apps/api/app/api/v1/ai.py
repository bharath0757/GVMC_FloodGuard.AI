from __future__ import annotations

from typing import Optional

"""
FloodGuard AI — REST API Endpoints: /ai/*
Exposes AI prediction, shelter recommendation, evacuation routing,
high-risk zone queries, and dashboard summary.
"""


import time
from typing import Any

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from app.ai.prediction.risk_predictor import predict_flood_risk
from app.ai.recommendation.shelter_recommender import recommend_shelters
from app.ai.routing.evacuation_router import compute_safe_routes
from app.ai.services.ai_service import (
    get_all_ward_predictions,
    get_dashboard_summary,
    get_high_risk_zones,
)

router = APIRouter()


def _safe(obj: Any) -> Any:
    """Recursively convert numpy types to native Python types for JSON serialization."""
    try:
        import numpy as np

        if isinstance(obj, (np.integer,)):
            return int(obj)
        if isinstance(obj, (np.floating,)):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
    except ImportError:
        pass
    if isinstance(obj, dict):
        return {k: _safe(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_safe(i) for i in obj]
    return obj


# ---------------------------------------------------------------------------
# In-memory explanation store (maps prediction_id → full prediction)
# ---------------------------------------------------------------------------
_EXPLANATION_STORE: dict[str, dict[str, Any]] = {}


# ---------------------------------------------------------------------------
# Request / Response Schemas
# ---------------------------------------------------------------------------


class RiskPredictionRequest(BaseModel):
    ward_number: int = Field(default=14, ge=1, le=72, description="GVMC Ward number")
    rainfall_mm_hr: float = Field(default=42.8, ge=0.0, le=300.0)
    water_level_cm: float = Field(default=98.0, ge=0.0, le=500.0)
    elevation_override: Optional[float] = Field(default=None)
    drainage_score_override: Optional[float] = Field(default=None, ge=0.0, le=1.0)


class ShelterRecommendationRequest(BaseModel):
    user_lat: float = Field(default=17.6868, ge=15.0, le=25.0)
    user_lng: float = Field(default=83.2185, ge=78.0, le=90.0)
    risk_score: float = Field(default=72.0, ge=0.0, le=100.0)
    ward_risk_category: str = Field(default="High")
    needs_medical: bool = False
    needs_accessible: bool = False


class SafeRouteRequest(BaseModel):
    start_ward: str = Field(default="w14", description="Starting ward ID (e.g. w14)")
    high_risk_wards: list[str] = Field(default_factory=lambda: ["w14", "w22", "w1"])
    flooded_wards: list[str] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.post("/predict-risk", summary="Predict flood risk score for a ward")
async def predict_risk(payload: RiskPredictionRequest) -> dict[str, Any]:
    """
    XGBoost + Analytical ensemble flood risk prediction.
    Returns risk score (0-100), category, alert color, confidence, and SHAP explanations.
    """
    result = predict_flood_risk(
        rainfall_mm_hr=payload.rainfall_mm_hr,
        water_level_cm=payload.water_level_cm,
        ward_number=payload.ward_number,
        elevation_override=payload.elevation_override,
        drainage_score_override=payload.drainage_score_override,
    )
    safe_result = _safe(result)
    # Store for /explanations endpoint
    _EXPLANATION_STORE[safe_result["prediction_id"]] = safe_result
    return JSONResponse(content=safe_result)


@router.post("/recommend-shelter", summary="Recommend best evacuation shelters")
async def recommend_shelter(payload: ShelterRecommendationRequest):
    """
    Multi-criteria shelter recommendation engine.
    Considers distance, capacity, occupancy, medical availability, accessibility.
    """
    result = recommend_shelters(
        user_lat=payload.user_lat,
        user_lng=payload.user_lng,
        risk_score=payload.risk_score,
        needs_medical=payload.needs_medical,
        needs_accessible=payload.needs_accessible,
        ward_risk_category=payload.ward_risk_category,
    )
    return JSONResponse(content=_safe(result))


@router.post("/safe-route", summary="Compute A* safe evacuation route")
async def safe_route(payload: SafeRouteRequest):
    """
    A* flood-aware evacuation route planning.
    Avoids high-risk and flooded wards. Returns primary + alternative routes.
    """
    result = compute_safe_routes(
        start_ward=payload.start_ward,
        high_risk_wards=payload.high_risk_wards,
        flooded_wards=payload.flooded_wards,
    )
    return JSONResponse(content=_safe(result))


@router.get("/high-risk-zones", summary="Get all wards with risk score >= 60")
async def high_risk_zones():
    """Returns all wards currently classified as High or Critical risk."""
    zones = get_high_risk_zones()
    return JSONResponse(
        content=_safe(
            {
                "high_risk_count": len(zones),
                "zones": zones,
                "alert_summary": {
                    "critical": len(
                        [z for z in zones if z["risk_category"] == "Critical"]
                    ),
                    "high": len([z for z in zones if z["risk_category"] == "High"]),
                },
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }
        )
    )


@router.get(
    "/dashboard-summary", summary="AI-powered dashboard summary for all 15 wards"
)
async def dashboard_summary():
    """
    Aggregated AI intelligence summary for the FloodGuard Command Center dashboard.
    Includes per-ward risk scores, alert distribution, and overall alert level.
    """
    return JSONResponse(content=_safe(get_dashboard_summary()))


@router.get(
    "/explanations/{prediction_id}", summary="Get SHAP explanations for a prediction"
)
async def get_explanation(prediction_id: str):
    """
    Returns full prediction with SHAP-style feature importance explanations.
    """
    explanation = _EXPLANATION_STORE.get(prediction_id)
    if not explanation:
        raise HTTPException(
            status_code=404,
            detail=f"Prediction ID '{prediction_id}' not found. Explanations expire after server restart.",
        )
    return JSONResponse(content=_safe(explanation))


@router.get("/ward-predictions", summary="Get risk predictions for all 15 wards")
async def ward_predictions():
    """Returns AI risk prediction summary for all Visakhapatnam GVMC wards."""
    preds = get_all_ward_predictions()
    return JSONResponse(
        content=_safe(
            {
                "total_wards": len(preds),
                "predictions": preds,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }
        )
    )
