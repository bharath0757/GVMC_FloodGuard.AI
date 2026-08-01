"""
FloodGuard AI - Weighted Shelter Recommendation Engine
Scores shelters using a multi-criteria decision analysis (MCDA) algorithm.
"""
from __future__ import annotations

import math
from typing import Dict, Any, List, Optional


# Visakhapatnam Shelter Database (static fallback)
SHELTER_DB = [
    {"id": "sh1", "name": "AU Engineering College Sports Complex", "ward": "MVP Colony", "lat": 17.7326, "lng": 83.3309, "capacity": 800, "current_occupancy": 320, "is_accessible": True, "has_medical": True, "has_food": True},
    {"id": "sh2", "name": "Bheemunipatnam Municipal School", "ward": "Bheemunipatnam", "lat": 17.8933, "lng": 83.4531, "capacity": 400, "current_occupancy": 180, "is_accessible": True, "has_medical": False, "has_food": True},
    {"id": "sh3", "name": "Gajuwaka Sports Stadium", "ward": "Gajuwaka", "lat": 17.6851, "lng": 83.2101, "capacity": 1200, "current_occupancy": 950, "is_accessible": True, "has_medical": True, "has_food": True},
    {"id": "sh4", "name": "Simhachalam Temple Dharmasala", "ward": "Simhachalam", "lat": 17.7711, "lng": 83.2544, "capacity": 600, "current_occupancy": 120, "is_accessible": False, "has_medical": False, "has_food": True},
    {"id": "sh5", "name": "VMRDA City Centre Convention Hall", "ward": "Dwaraka Nagar", "lat": 17.7194, "lng": 83.3177, "capacity": 500, "current_occupancy": 240, "is_accessible": True, "has_medical": True, "has_food": True},
    {"id": "sh6", "name": "Seethammadhara High School", "ward": "Seethammadhara", "lat": 17.7443, "lng": 83.3108, "capacity": 350, "current_occupancy": 80, "is_accessible": True, "has_medical": False, "has_food": True},
    {"id": "sh7", "name": "Marripalem Vari Lova Community Hall", "ward": "Marripalem", "lat": 17.7050, "lng": 83.2710, "capacity": 450, "current_occupancy": 210, "is_accessible": True, "has_medical": True, "has_food": True},
    {"id": "sh8", "name": "Kancharapalem Town Hall", "ward": "Kancharapalem", "lat": 17.6953, "lng": 83.2381, "capacity": 300, "current_occupancy": 260, "is_accessible": False, "has_medical": False, "has_food": False},
]


def _haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Haversine formula for great-circle distance in km."""
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lam = math.radians(lng2 - lng1)
    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lam / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def _score_shelter(
    shelter: Dict[str, Any],
    user_lat: float,
    user_lng: float,
    risk_score: float,
    needs_medical: bool = False,
    needs_accessible: bool = False,
) -> float:
    """
    Multi-Criteria Decision Analysis scoring for shelter selection.
    Weights are calibrated for disaster response priorities.
    """
    # 1. Distance score (max 10km range; closer = better)
    dist_km = _haversine_km(user_lat, user_lng, shelter["lat"], shelter["lng"])
    if dist_km > 15:
        return -1.0  # Too far, disqualify
    dist_score = max(0.0, 1.0 - dist_km / 10.0)

    # 2. Capacity score (available = capacity - occupancy)
    available = shelter["capacity"] - shelter["current_occupancy"]
    occupancy_rate = shelter["current_occupancy"] / max(1, shelter["capacity"])
    capacity_score = max(0.0, 1.0 - occupancy_rate) * min(1.0, available / 200.0)

    # 3. Amenity scores
    medical_score = 1.0 if shelter.get("has_medical") else 0.0
    food_score = 1.0 if shelter.get("has_food") else 0.0
    access_score = 1.0 if shelter.get("is_accessible") else 0.3

    # 4. Risk-aware weight adjustment (higher risk → distance matters more)
    risk_weight = min(1.0, risk_score / 100.0)
    dist_weight = 0.30 + (risk_weight * 0.10)  # 30-40% weight

    total_score = (
        dist_score    * dist_weight +
        capacity_score * 0.35 +
        medical_score  * (0.20 if needs_medical else 0.10) +
        food_score     * 0.10 +
        access_score   * (0.15 if needs_accessible else 0.05)
    )

    return round(total_score, 4)


def recommend_shelters(
    user_lat: float,
    user_lng: float,
    risk_score: float,
    needs_medical: bool = False,
    needs_accessible: bool = False,
    ward_risk_category: str = "Medium",
    shelters: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    """
    Returns ranked shelter recommendations with reasoning.
    """
    shelter_pool = shelters or SHELTER_DB

    scored = []
    for sh in shelter_pool:
        score = _score_shelter(
            sh, user_lat, user_lng, risk_score, needs_medical, needs_accessible
        )
        if score >= 0:
            dist_km = _haversine_km(user_lat, user_lng, sh["lat"], sh["lng"])
            available = sh["capacity"] - sh["current_occupancy"]
            scored.append({
                **sh,
                "recommendation_score": score,
                "distance_km": round(dist_km, 2),
                "available_capacity": available,
                "occupancy_pct": round(sh["current_occupancy"] / max(1, sh["capacity"]) * 100, 1),
                "estimated_travel_min": round(dist_km * 3.5, 0),  # ~17 km/h evacuation speed
            })

    scored.sort(key=lambda x: x["recommendation_score"], reverse=True)

    if not scored:
        return {"error": "No suitable shelters found within range.", "recommendations": []}

    best = scored[0]
    alternatives = scored[1:4]

    reasoning = _generate_reasoning(best, risk_score, needs_medical, needs_accessible)

    return {
        "primary_shelter": best,
        "alternative_shelters": alternatives,
        "reasoning": reasoning,
        "total_shelters_evaluated": len(shelter_pool),
        "shelters_in_range": len(scored),
        "risk_context": {
            "risk_score": risk_score,
            "ward_risk_category": ward_risk_category,
            "priority_criteria": _get_priority_criteria(risk_score),
        },
    }


def _generate_reasoning(
    shelter: Dict[str, Any],
    risk_score: float,
    needs_medical: bool,
    needs_accessible: bool,
) -> List[str]:
    reasons = [
        f"📍 Nearest safe shelter: {shelter['name']} at {shelter['distance_km']} km.",
        f"🏠 Available capacity: {shelter['available_capacity']} of {shelter['capacity']} spaces ({100 - shelter['occupancy_pct']:.0f}% free).",
    ]
    if shelter.get("has_medical"):
        reasons.append("🏥 Medical first-aid team deployed at this shelter.")
    if shelter.get("has_food"):
        reasons.append("🍲 Food and water supplies available.")
    if risk_score >= 80:
        reasons.append("🚨 CRITICAL RISK: Prioritize immediate movement to this shelter.")
    reasons.append(f"⏱️ Estimated evacuation travel: ~{int(shelter['estimated_travel_min'])} minutes on foot.")
    return reasons


def _get_priority_criteria(risk_score: float) -> List[str]:
    if risk_score >= 80:
        return ["Speed", "Proximity", "Medical Availability"]
    elif risk_score >= 60:
        return ["Proximity", "Capacity", "Accessibility"]
    else:
        return ["Capacity", "Amenities", "Proximity"]
