from __future__ import annotations

from typing import Optional

"""
FloodGuard AI - AI Orchestrator Service
Central service that aggregates predictions, recommendations & dashboard summaries.
Uses an in-memory cache to prevent redundant ML inference.
"""


import logging
import time
from typing import Any

from app.ai.prediction.risk_predictor import predict_flood_risk

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# In-Memory Prediction Cache (TTL = 5 minutes)
# ---------------------------------------------------------------------------
_CACHE: dict[str, dict[str, Any]] = {}
_CACHE_TTL = 300  # seconds


def _cache_get(key: str) -> dict[str, Optional[Any]]:
    entry = _CACHE.get(key)
    if entry and (time.time() - entry["_cached_at"]) < _CACHE_TTL:
        return entry
    return None


def _cache_set(key: str, value: dict[str, Any]) -> None:
    _CACHE[key] = {**value, "_cached_at": time.time()}


# ---------------------------------------------------------------------------
# Ward Telemetry Baseline (used when DB is offline)
# ---------------------------------------------------------------------------
WARD_TELEMETRY = {
    14: {"rainfall_mm_hr": 68.2, "water_level_cm": 142.0, "name": "Gajuwaka"},
    8: {"rainfall_mm_hr": 54.8, "water_level_cm": 98.0, "name": "One Town"},
    3: {"rainfall_mm_hr": 42.1, "water_level_cm": 72.0, "name": "Maharanipeta"},
    22: {"rainfall_mm_hr": 61.5, "water_level_cm": 121.0, "name": "Sheela Nagar"},
    11: {"rainfall_mm_hr": 38.4, "water_level_cm": 55.0, "name": "Seethammadhara"},
    16: {"rainfall_mm_hr": 29.2, "water_level_cm": 38.0, "name": "Muralinagar"},
    5: {"rainfall_mm_hr": 45.3, "water_level_cm": 83.0, "name": "Dwaraka Nagar"},
    19: {"rainfall_mm_hr": 57.6, "water_level_cm": 112.0, "name": "Gopalapatnam"},
    2: {"rainfall_mm_hr": 33.8, "water_level_cm": 46.0, "name": "MVP Colony"},
    1: {"rainfall_mm_hr": 64.9, "water_level_cm": 135.0, "name": "Old Town"},
    6: {"rainfall_mm_hr": 49.7, "water_level_cm": 94.0, "name": "Kancharapalem"},
    9: {"rainfall_mm_hr": 37.6, "water_level_cm": 61.0, "name": "Akkayyapalem"},
    12: {"rainfall_mm_hr": 71.3, "water_level_cm": 158.0, "name": "Pendurthi"},
    15: {"rainfall_mm_hr": 28.4, "water_level_cm": 34.0, "name": "Madhurawada"},
    20: {"rainfall_mm_hr": 59.1, "water_level_cm": 118.0, "name": "Kommadi"},
}


def get_all_ward_predictions() -> list[dict[str, Any]]:
    """Run predictions for all 15 Visakhapatnam wards and return summary list."""
    results = []
    for ward_num, telemetry in WARD_TELEMETRY.items():
        cache_key = f"ward_{ward_num}_{int(telemetry['rainfall_mm_hr'])}_{int(telemetry['water_level_cm'])}"
        cached = _cache_get(cache_key)
        if cached:
            results.append(cached)
            continue

        pred = predict_flood_risk(
            rainfall_mm_hr=telemetry["rainfall_mm_hr"],
            water_level_cm=telemetry["water_level_cm"],
            ward_number=ward_num,
        )
        summary = {
            "ward_number": ward_num,
            "ward_name": telemetry["name"],
            "risk_score": pred["risk_score"],
            "risk_category": pred["risk_category"],
            "alert_color": pred["alert_color"],
            "confidence": pred["confidence"],
            "rainfall_mm_hr": telemetry["rainfall_mm_hr"],
            "water_level_cm": telemetry["water_level_cm"],
            "model_used": pred["model_used"],
            "timestamp": pred["timestamp"],
            "top_factor": pred["explanations"][0]["feature"]
            if pred["explanations"]
            else "rainfall_mm_hr",
        }
        _cache_set(cache_key, summary)
        results.append(summary)

    results.sort(key=lambda x: x["risk_score"], reverse=True)
    return results


def get_dashboard_summary() -> dict[str, Any]:
    """Aggregate AI intelligence for the dashboard summary panel."""
    ward_predictions = get_all_ward_predictions()

    critical = [w for w in ward_predictions if w["risk_category"] == "Critical"]
    high = [w for w in ward_predictions if w["risk_category"] == "High"]
    medium = [w for w in ward_predictions if w["risk_category"] == "Medium"]
    safe = [w for w in ward_predictions if w["risk_category"] in ("Low", "Very Low")]

    top_risk_ward = ward_predictions[0] if ward_predictions else {}
    avg_risk = round(
        sum(w["risk_score"] for w in ward_predictions) / max(1, len(ward_predictions)),
        1,
    )

    alert_distribution = {
        "Red": len(critical),
        "Orange": len(high),
        "Yellow": len(medium),
        "Green": len(safe),
    }

    overall_alert = (
        "Red" if critical else ("Orange" if high else ("Yellow" if medium else "Green"))
    )

    return {
        "overall_alert_level": overall_alert,
        "total_wards_monitored": len(ward_predictions),
        "critical_wards": len(critical),
        "high_risk_wards": len(high),
        "medium_risk_wards": len(medium),
        "safe_wards": len(safe),
        "average_risk_score": avg_risk,
        "top_risk_ward": top_risk_ward,
        "alert_distribution": alert_distribution,
        "ward_predictions": ward_predictions,
        "model_status": "XGBoost + Analytical Ensemble Active",
        "last_updated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "next_update_in_sec": _CACHE_TTL,
    }


def get_high_risk_zones() -> list[dict[str, Any]]:
    """Return list of wards with risk score >= 60 (High or Critical)."""
    all_preds = get_all_ward_predictions()
    return [w for w in all_preds if w["risk_score"] >= 60]
