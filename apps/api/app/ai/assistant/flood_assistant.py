"""
FloodGuard AI - Domain-Specific Flood Intelligence Assistant
Processes citizen natural language queries about flood risks, shelters,
road blockages, and safety precautions using live telemetry and AI models.
"""

from __future__ import annotations

import re
from typing import Any

from app.ai.prediction.risk_predictor import predict_flood_risk
from app.ai.recommendation.shelter_recommender import recommend_shelters
from app.ai.routing.evacuation_router import compute_safe_routes
from app.ai.services.ai_service import WARD_TELEMETRY, get_all_ward_predictions

# Visakhapatnam Ward Name Mapping
WARD_NAME_TO_NUM = {
    "gajuwaka": 14,
    "one town": 8,
    "maharanipeta": 3,
    "sheela nagar": 22,
    "seethammadhara": 11,
    "muralinagar": 16,
    "dwaraka nagar": 5,
    "gopalapatnam": 19,
    "mvp colony": 2,
    "old town": 1,
    "kancharapalem": 6,
    "akkayyapalem": 9,
    "pendurthi": 12,
    "madhurawada": 15,
    "kommadi": 20,
}


def _extract_ward(text: str) -> tuple[int, str]:
    text_lower = text.lower()
    for name, num in WARD_NAME_TO_NUM.items():
        if name in text_lower:
            return num, name.title()
    # Check ward number directly e.g. "ward 14"
    match = re.search(r"ward\s*#?\s*(\d+)", text_lower)
    if match:
        num = int(match.group(1))
        if num in WARD_TELEMETRY:
            return num, WARD_TELEMETRY[num]["name"]
    return 14, "Gajuwaka"  # Default


def process_assistant_query(
    query: str, user_lat: float = 17.6868, user_lng: float = 83.2185
) -> dict[str, Any]:
    """
    Process a user's natural language query using live AI inference & database telemetry.
    Returns domain-specific answer with structured actionable cards.
    """
    q_lower = query.lower()
    ward_num, ward_name = _extract_ward(query)
    telemetry = WARD_TELEMETRY.get(ward_num, WARD_TELEMETRY[14])

    # Run live prediction for the target ward
    pred = predict_flood_risk(
        rainfall_mm_hr=telemetry["rainfall_mm_hr"],
        water_level_cm=telemetry["water_level_cm"],
        ward_number=ward_num,
    )

    intent = "general_info"
    cards = []
    actions = []

    # 1. Intent: Area Safety / Flood Risk
    if any(
        k in q_lower
        for k in [
            "safe",
            "risk",
            "hazard",
            "water level",
            "flood level",
            "danger",
            "condition",
        ]
    ):
        intent = "area_risk"
        answer = (
            f"📍 **{ward_name} (Ward #{ward_num}) Risk Assessment**:\n"
            f"• **Risk Score:** {pred['risk_score']}/100 ({pred['risk_category']} Risk - {pred['alert_color']} Alert)\n"
            f"• **Current Telemetry:** 🌧 {telemetry['rainfall_mm_hr']} mm/h rainfall | 💧 {telemetry['water_level_cm']} cm water level\n"
            f"• **Model Confidence:** {int(pred['confidence'] * 100)}% (XGBoost Engine)\n"
        )
        if pred["risk_category"] in ["Critical", "High"]:
            answer += (
                f"🚨 **Advisory:** High risk detected! {pred['recommendations'][0]}"
            )
        else:
            answer += (
                "✅ **Advisory:** Conditions currently manageable. Monitor updates."
            )

        cards.append(
            {
                "type": "risk_card",
                "title": f"{ward_name} Risk Breakdown",
                "data": pred,
            }
        )
        actions.append(
            {
                "label": "Find Shelters",
                "query": f"Which shelter should I use near {ward_name}?",
            }
        )
        actions.append(
            {
                "label": "Evacuation Route",
                "query": f"Which roads should I avoid in {ward_name}?",
            }
        )

    # 2. Intent: Shelter Recommendation
    elif any(
        k in q_lower for k in ["shelter", "refuge", "camp", "stay", "medical", "relief"]
    ):
        intent = "shelter_recommendation"
        needs_medical = "medical" in q_lower or "doctor" in q_lower
        needs_access = (
            "wheelchair" in q_lower or "accessible" in q_lower or "disabled" in q_lower
        )

        shelter_data = recommend_shelters(
            user_lat=user_lat,
            user_lng=user_lng,
            risk_score=pred["risk_score"],
            needs_medical=needs_medical,
            needs_accessible=needs_access,
            ward_risk_category=pred["risk_category"],
        )
        best = shelter_data.get("primary_shelter", {})
        answer = (
            f"🏥 **Recommended Relief Shelter for {ward_name} Area**:\n"
            f"• **Primary Shelter:** {best.get('name', 'Gajuwaka Sports Stadium')} ({best.get('ward', 'Gajuwaka')})\n"
            f"• **Proximity:** {best.get('distance_km', 1.2)} km away (~{int(best.get('estimated_travel_min', 15))} min on foot)\n"
            f"• **Capacity:** {best.get('available_capacity', 250)} / {best.get('capacity', 1200)} spaces free\n"
            f"• **Amenities:** {'🏥 Medical Team' if best.get('has_medical') else ''} {'🍲 Food & Water' if best.get('has_food') else ''}\n"
        )
        cards.append(
            {
                "type": "shelter_card",
                "title": "Nearest Shelter Recommendation",
                "data": shelter_data,
            }
        )
        actions.append(
            {
                "label": "Safe Route to Shelter",
                "query": f"Which roads should I avoid to get to {best.get('name')}?",
            }
        )

    # 3. Intent: Roads to Avoid / Evacuation Route
    elif any(
        k in q_lower
        for k in [
            "road",
            "route",
            "avoid",
            "path",
            "drive",
            "navigate",
            "blocked",
            "evacuate",
        ]
    ):
        intent = "evacuation_routing"
        all_preds = get_all_ward_predictions()
        high_risk_wards = [
            f"w{w['ward_number']}" for w in all_preds if w["risk_score"] >= 60
        ]

        route_data = compute_safe_routes(
            start_ward=f"w{ward_num}",
            high_risk_wards=high_risk_wards,
            flooded_wards=[f"w{ward_num}"] if pred["risk_score"] >= 80 else [],
        )
        path = route_data.get("primary_route", {}).get("path", [f"w{ward_num}"])
        answer = (
            f"🚗 **A* Flood-Aware Route Navigation for {ward_name}**:\n"
            f"• **Avoid Wards:** Wards classified as High/Critical risk ({', '.join(high_risk_wards[:3])})\n"
            f"• **Recommended Path:** {' ➔ '.join(path)}\n"
            f"• **Total Distance:** {route_data.get('primary_route', {}).get('total_distance_km', 3.2)} km (~{route_data.get('primary_route', {}).get('estimated_time_min', 12)} min)\n"
            f"⚠️ **Warning:** Do not attempt to cross underpasses or roads with >30cm visible water level."
        )
        cards.append(
            {
                "type": "route_card",
                "title": "Evacuation Route & Road Blockages",
                "data": route_data,
            }
        )

    # 4. Intent: Safety Precautions
    elif any(
        k in q_lower
        for k in ["precaution", "safety", "tip", "do", "prepare", "kit", "emergency"]
    ):
        intent = "precautions"
        answer = (
            f"🛡️ **Monsoon & Cyclone Emergency Precautions ({pred['alert_color']} Level Alert)**:\n"
            f"1. 🎒 **Prepare Go-Bag:** Pack drinking water, dry food, torch, power bank, first-aid, & ID documents.\n"
            f"2. ⚡ **Electrical Safety:** Switch off main power circuit if water enters ground floor. Stay away from fallen electrical poles.\n"
            f"3. 🌊 **Water Hazards:** Never drive or wade through moving water — 15cm of water can knock you over.\n"
            f"4. 📱 **Stay Connected:** Save Helpline **1077** (GVMC Disaster Cell) and monitor FloodGuard notifications.\n"
        )
        cards.append(
            {
                "type": "precaution_card",
                "title": "Emergency Precautions Checklist",
                "data": {"helpline": "1077", "stage": "Stage 3 Monsoon Warning"},
            }
        )
        actions.append(
            {"label": "Check Area Risk", "query": f"Is {ward_name} safe right now?"}
        )

    else:
        intent = "overview"
        answer = (
            "👋 **FloodGuard AI Assistant**: I am connected to Visakhapatnam GVMC live sensors & XGBoost models.\n"
            "I can help you with:\n"
            "• **Area Risk Status:** 'Is Gajuwaka safe?' or 'What is Ward 14 risk?'\n"
            "• **Shelter Finder:** 'Which shelter should I use near MVP Colony?'\n"
            "• **Road Blockages:** 'Which roads should I avoid in Ward 14?'\n"
            "• **Safety Precautions:** 'What precautions should I take during heavy rain?'\n"
        )
        actions = [
            {"label": "Is Gajuwaka safe?", "query": "Is Gajuwaka safe right now?"},
            {
                "label": "Nearest Shelter",
                "query": "Which shelter should I use near Gajuwaka?",
            },
            {
                "label": "Roads to Avoid",
                "query": "Which roads should I avoid in Ward 14?",
            },
            {"label": "Safety Precautions", "query": "What precautions should I take?"},
        ]

    return {
        "query": query,
        "intent": intent,
        "target_ward_number": ward_num,
        "target_ward_name": ward_name,
        "response_text": answer,
        "cards": cards,
        "suggested_actions": actions,
    }


def get_assistant_suggestions() -> list[dict[str, str]]:
    """Return pre-built quick prompt suggestions for the citizen UI."""
    return [
        {"label": "Is Gajuwaka safe?", "query": "Is Gajuwaka safe right now?"},
        {
            "label": "What is Ward 14 flood risk?",
            "query": "What is Ward 14 flood risk score?",
        },
        {
            "label": "Nearest shelter with medical team",
            "query": "Which shelter should I use with medical aid near MVP Colony?",
        },
        {
            "label": "Which roads should I avoid?",
            "query": "Which roads should I avoid in Ward 14?",
        },
        {
            "label": "Emergency precautions",
            "query": "What precautions should I take during Stage 3 cyclone?",
        },
    ]
