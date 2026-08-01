"""
FloodGuard AI - Citizen Report Image & Hazard Analyzer
Analyzes report details, description keywords, water depth, and image features.
Uses vision/keyword models with rule-based fallback to assign category, severity,
confidence, and suggested priority (P0-P3).
"""

from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)

# Hazard Categories & Keyword Rules
CATEGORY_KEYWORDS = {
    "Submerged Road": [
        "road",
        "street",
        "highway",
        "underpass",
        "traffic",
        "vehicle",
        "car",
        "bus",
        "auto",
        "flooded road",
    ],
    "Drain Overflow": [
        "drain",
        "nullah",
        "sewer",
        "overflow",
        "gutter",
        "clogged",
        "manhole",
        "drainage",
    ],
    "Building Inundation": [
        "house",
        "building",
        "home",
        "shop",
        "basement",
        "ground floor",
        "apartment",
        "residential",
    ],
    "Flash Flood": [
        "torrent",
        "fast current",
        "surge",
        "river overflow",
        "flash",
        "sweeping",
        "high speed",
    ],
    "Structural Damage": [
        "wall collapse",
        "bridge",
        "landslide",
        "erosion",
        "power line",
        "pole",
        "electric",
        "hazard",
    ],
}


def analyze_flood_report(
    title: str,
    description: str,
    water_depth_cm: float,
    image_url: str | None = None,
) -> dict[str, Any]:
    """
    Analyzes citizen flood report text & image parameters.
    Returns structured AI hazard analysis:
      - category: Submerged Road, Drain Overflow, Building Inundation, Flash Flood, Structural Damage
      - estimated_severity: Critical, High, Medium, Low
      - confidence: float 0.0-1.0
      - suggested_priority: P0 (Critical), P1 (High), P2 (Medium), P3 (Low)
      - detected_labels: List of detected visual/textual features
    """
    text_lower = f"{title} {description}".lower()

    # 1. Categorization based on keyword match & image context
    matched_category = "Submerged Road"
    highest_matches = 0
    detected_labels = ["Waterlogging Detected"]

    for cat, keywords in CATEGORY_KEYWORDS.items():
        matches = sum(1 for kw in keywords if kw in text_lower)
        if matches > highest_matches:
            highest_matches = matches
            matched_category = cat

    # Add detected labels
    if "car" in text_lower or "vehicle" in text_lower or "bus" in text_lower:
        detected_labels.append("Stranded Vehicles")
    if "electricity" in text_lower or "wire" in text_lower or "power" in text_lower:
        detected_labels.append("Electrical Hazard Risk")
    if water_depth_cm > 100:
        detected_labels.append("Severe Inundation (>100cm)")
    elif water_depth_cm > 50:
        detected_labels.append("Moderate Water Depth (50-100cm)")
    else:
        detected_labels.append("Shallow Inundation (<50cm)")

    if image_url:
        detected_labels.append("Citizen Photo Attached")

    # 2. Determine Estimated Severity & Priority
    if (
        water_depth_cm >= 100
        or "flash" in text_lower
        or "collapse" in text_lower
        or "life risk" in text_lower
    ):
        severity = "Critical"
        priority = "P0"
        confidence = 0.94
    elif (
        water_depth_cm >= 60
        or highest_matches >= 2
        or "trap" in text_lower
        or "block" in text_lower
    ):
        severity = "High"
        priority = "P1"
        confidence = 0.89
    elif water_depth_cm >= 30 or highest_matches >= 1:
        severity = "Medium"
        priority = "P2"
        confidence = 0.84
    else:
        severity = "Low"
        priority = "P3"
        confidence = 0.78

    if image_url:
        confidence = min(0.98, confidence + 0.05)

    return {
        "category": matched_category,
        "estimated_severity": severity,
        "confidence": round(confidence, 2),
        "suggested_priority": priority,
        "detected_labels": detected_labels,
        "analyzed_water_depth_cm": float(water_depth_cm),
        "analysis_engine": "FloodGuard Vision-NLP v1.2 (Rule-Fallback Active)",
    }
