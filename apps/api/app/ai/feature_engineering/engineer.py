from __future__ import annotations

from typing import Optional

"""
FloodGuard AI - Feature Engineering Module
Transforms raw sensor & contextual data into ML-ready feature vectors.
"""


from typing import Any

# ---------------------------------------------------------------------------
# Visakhapatnam Ward Baseline Data (elevation, drainage, river proximity)
# ---------------------------------------------------------------------------
WARD_BASELINES: dict[int, dict[str, float]] = {
    14: {
        "elevation": 3.2,
        "drainage_score": 0.28,
        "distance_to_river_km": 0.4,
        "historical_flood_freq": 0.82,
    },
    8: {
        "elevation": 5.1,
        "drainage_score": 0.42,
        "distance_to_river_km": 0.8,
        "historical_flood_freq": 0.71,
    },
    3: {
        "elevation": 6.4,
        "drainage_score": 0.55,
        "distance_to_river_km": 1.2,
        "historical_flood_freq": 0.58,
    },
    22: {
        "elevation": 4.8,
        "drainage_score": 0.33,
        "distance_to_river_km": 0.6,
        "historical_flood_freq": 0.76,
    },
    11: {
        "elevation": 8.2,
        "drainage_score": 0.68,
        "distance_to_river_km": 1.8,
        "historical_flood_freq": 0.42,
    },
    16: {
        "elevation": 12.5,
        "drainage_score": 0.74,
        "distance_to_river_km": 2.5,
        "historical_flood_freq": 0.31,
    },
    5: {
        "elevation": 7.3,
        "drainage_score": 0.61,
        "distance_to_river_km": 1.4,
        "historical_flood_freq": 0.48,
    },
    19: {
        "elevation": 5.8,
        "drainage_score": 0.45,
        "distance_to_river_km": 1.0,
        "historical_flood_freq": 0.64,
    },
    2: {
        "elevation": 9.1,
        "drainage_score": 0.72,
        "distance_to_river_km": 2.1,
        "historical_flood_freq": 0.36,
    },
    1: {
        "elevation": 4.0,
        "drainage_score": 0.35,
        "distance_to_river_km": 0.7,
        "historical_flood_freq": 0.74,
    },
    6: {
        "elevation": 6.0,
        "drainage_score": 0.50,
        "distance_to_river_km": 1.1,
        "historical_flood_freq": 0.60,
    },
    9: {
        "elevation": 7.8,
        "drainage_score": 0.63,
        "distance_to_river_km": 1.6,
        "historical_flood_freq": 0.45,
    },
    12: {
        "elevation": 3.5,
        "drainage_score": 0.30,
        "distance_to_river_km": 0.5,
        "historical_flood_freq": 0.80,
    },
    15: {
        "elevation": 10.2,
        "drainage_score": 0.70,
        "distance_to_river_km": 2.0,
        "historical_flood_freq": 0.38,
    },
    20: {
        "elevation": 4.5,
        "drainage_score": 0.38,
        "distance_to_river_km": 0.9,
        "historical_flood_freq": 0.70,
    },
}

DEFAULT_BASELINE = {
    "elevation": 6.0,
    "drainage_score": 0.50,
    "distance_to_river_km": 1.0,
    "historical_flood_freq": 0.55,
}


def get_ward_baseline(ward_number: int) -> dict[str, float]:
    return WARD_BASELINES.get(ward_number, DEFAULT_BASELINE)


def build_feature_vector(
    rainfall_mm_hr: float,
    water_level_cm: float,
    ward_number: int = 14,
    elevation_override: Optional[float] = None,
    drainage_score_override: Optional[float] = None,
) -> dict[str, float]:
    """
    Constructs the 6-feature vector used by the XGBoost risk model.

    Features:
      1. rainfall_mm_hr           - Live rainfall rate (mm/hr)
      2. water_level_cm           - Current sensor water level (cm)
      3. elevation_m              - Ward centroid elevation (meters)
      4. drainage_score           - Drainage efficiency [0-1], lower = worse
      5. distance_to_river_km     - Proximity to nearest river / nullah (km)
      6. historical_flood_freq    - Historical flood frequency [0-1], higher = more prone
    """
    baseline = get_ward_baseline(ward_number)

    return {
        "rainfall_mm_hr": float(rainfall_mm_hr),
        "water_level_cm": float(water_level_cm),
        "elevation_m": float(elevation_override or baseline["elevation"]),
        "drainage_score": float(drainage_score_override or baseline["drainage_score"]),
        "distance_to_river_km": float(baseline["distance_to_river_km"]),
        "historical_flood_freq": float(baseline["historical_flood_freq"]),
    }


def normalize_features(features: dict[str, float]) -> list[float]:
    """
    Min-max normalization of feature vector for model input.
    Ranges derived from Visakhapatnam monsoon historical dataset.
    """
    ranges = {
        "rainfall_mm_hr": (0.0, 200.0),
        "water_level_cm": (0.0, 400.0),
        "elevation_m": (0.0, 50.0),
        "drainage_score": (0.0, 1.0),
        "distance_to_river_km": (0.0, 10.0),
        "historical_flood_freq": (0.0, 1.0),
    }
    normalized = []
    for key, (lo, hi) in ranges.items():
        val = features.get(key, 0.0)
        normalized.append((val - lo) / (hi - lo) if hi > lo else 0.0)
    return normalized


def compute_shap_explanation(
    features: dict[str, float], risk_score: float
) -> list[dict[str, Any]]:
    """
    Generates deterministic SHAP-style feature importance explanations.
    """
    weights = {
        "rainfall_mm_hr": 0.32,
        "water_level_cm": 0.28,
        "drainage_score": 0.18,
        "historical_flood_freq": 0.12,
        "elevation_m": 0.06,
        "distance_to_river_km": 0.04,
    }
    normalized = normalize_features(features)
    keys = list(weights.keys())
    explanations = []
    for i, key in enumerate(keys):
        norm_val = normalized[i] if i < len(normalized) else 0.0
        contribution = weights[key] * norm_val * risk_score
        if key in ["drainage_score", "elevation_m", "distance_to_river_km"]:
            # Inverse relationship: higher drainage score = lower risk
            contribution = weights[key] * (1 - norm_val) * risk_score
        explanations.append(
            {
                "feature": key,
                "value": features.get(key, 0.0),
                "contribution": round(contribution, 2),
                "direction": "increases_risk" if contribution > 0 else "reduces_risk",
                "importance_rank": i + 1,
            }
        )
    explanations.sort(key=lambda x: abs(x["contribution"]), reverse=True)
    return explanations
