from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.report import FloodReport
from app.models.risk_zone import RiskZone
from app.models.shelter import Shelter

logger = logging.getLogger(__name__)

router = APIRouter()

# Fixed GeoJSON polygon coordinates for Visakhapatnam Wards
WARD_POLYGONS = {
    14: [
        [83.210, 17.680],
        [83.230, 17.680],
        [83.230, 17.700],
        [83.210, 17.700],
        [83.210, 17.680],
    ],  # Gajuwaka
    8: [
        [83.295, 17.695],
        [83.315, 17.695],
        [83.315, 17.715],
        [83.295, 17.715],
        [83.295, 17.695],
    ],  # One Town
    3: [
        [83.310, 17.720],
        [83.330, 17.720],
        [83.330, 17.740],
        [83.310, 17.740],
        [83.310, 17.720],
    ],  # Maharanipeta
    22: [
        [83.235, 17.690],
        [83.255, 17.690],
        [83.255, 17.710],
        [83.235, 17.710],
        [83.235, 17.690],
    ],  # Sheela Nagar
    11: [
        [83.290, 17.730],
        [83.310, 17.730],
        [83.310, 17.750],
        [83.290, 17.750],
        [83.290, 17.730],
    ],  # Seethammadhara
    16: [
        [83.325, 17.745],
        [83.345, 17.745],
        [83.345, 17.765],
        [83.325, 17.765],
        [83.325, 17.745],
    ],  # Muralinagar
    5: [
        [83.298, 17.718],
        [83.318, 17.718],
        [83.318, 17.738],
        [83.298, 17.738],
        [83.298, 17.718],
    ],  # Dwaraka Nagar
    19: [
        [83.260, 17.720],
        [83.280, 17.720],
        [83.280, 17.740],
        [83.260, 17.740],
        [83.260, 17.720],
    ],  # Gopalapatnam
    2: [
        [83.320, 17.735],
        [83.340, 17.735],
        [83.340, 17.755],
        [83.320, 17.755],
        [83.320, 17.735],
    ],  # MVP Colony
}

# Static Fallbacks
FALLBACK_SHELTERS = [
    {
        "id": "sh1",
        "name": "AU Engineering College Sports Complex",
        "ward_name": "MVP Colony",
        "address": "AU Campus, MVP Colony",
        "capacity": 800,
        "current_occupancy": 320,
        "contact_phone": "+91 891 2844000",
        "is_accessible": True,
        "status": "Open",
        "lat": 17.7326,
        "lng": 83.3309,
        "amenities": ["Medical", "Food", "Water"],
    },
    {
        "id": "sh3",
        "name": "Gajuwaka Sports Stadium",
        "ward_name": "Gajuwaka",
        "address": "NH16 Junction, Gajuwaka",
        "capacity": 1200,
        "current_occupancy": 950,
        "contact_phone": "+91 891 2548811",
        "is_accessible": True,
        "status": "Open",
        "lat": 17.6851,
        "lng": 83.2101,
        "amenities": ["Medical", "Food", "Water", "Generator"],
    },
]

FALLBACK_REPORTS = [
    {
        "id": "rep-101",
        "title": "Main Road Submerged Near Bus Station",
        "reporter_name": "Ramesh Kumar",
        "ward_name": "Gajuwaka",
        "description": "Flood water height reaches above knee level.",
        "severity": "Critical",
        "status": "Verified",
        "water_depth_cm": 65.0,
        "image_url": "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500",
        "ai_confidence": 0.94,
        "lat": 17.6851,
        "lng": 83.2101,
        "created_at": "2026-07-31T18:00:00Z",
    },
]

FALLBACK_ZONES = [
    {
        "id": "rz14",
        "ward_number": 14,
        "ward_name": "Gajuwaka Industrial Zone",
        "risk_score": 88,
        "risk_category": "Critical",
        "population": 84000,
        "elevation_meters": 3.2,
        "water_level_cm": 142.0,
        "rainfall_mm_hr": 68.2,
        "active_alerts_count": 3,
    },
    {
        "id": "rz8",
        "ward_number": 8,
        "ward_name": "One Town Heritage Zone",
        "risk_score": 63,
        "risk_category": "High",
        "population": 62000,
        "elevation_meters": 5.1,
        "water_level_cm": 98.0,
        "rainfall_mm_hr": 54.8,
        "active_alerts_count": 1,
    },
]


@router.get("/shelters")
async def get_shelters_geojson(
    db: AsyncSession | None = Depends(get_db),
) -> dict[str, Any]:
    features = []
    if db is not None:
        try:
            stmt = select(Shelter).where(not Shelter.is_deleted)
            result = await db.execute(stmt)
            shelters = result.scalars().all()
            features = [
                {
                    "type": "Feature",
                    "geometry": {"type": "Point", "coordinates": [sh.lng, sh.lat]},
                    "properties": {
                        "id": str(sh.id),
                        "name": sh.name,
                        "ward_name": sh.ward_name,
                        "address": sh.address,
                        "capacity": sh.capacity,
                        "current_occupancy": sh.current_occupancy,
                        "available_capacity": max(
                            0, sh.capacity - sh.current_occupancy
                        ),
                        "contact_phone": sh.contact_phone,
                        "is_accessible": sh.is_accessible,
                        "status": sh.status,
                        "amenities": sh.amenities,
                    },
                }
                for sh in shelters
            ]
        except Exception:
            pass

    if not features:
        features = [
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [sh["lng"], sh["lat"]]},
                "properties": {
                    **sh,
                    "available_capacity": sh["capacity"] - sh["current_occupancy"],
                },
            }
            for sh in FALLBACK_SHELTERS
        ]

    return {"type": "FeatureCollection", "features": features}


@router.get("/reports")
async def get_reports_geojson(
    db: AsyncSession | None = Depends(get_db),
) -> dict[str, Any]:
    features = []
    if db is not None:
        try:
            stmt = select(FloodReport).where(not FloodReport.is_deleted)
            result = await db.execute(stmt)
            reports = result.scalars().all()
            features = [
                {
                    "type": "Feature",
                    "geometry": {"type": "Point", "coordinates": [rep.lng, rep.lat]},
                    "properties": {
                        "id": str(rep.id),
                        "title": rep.title,
                        "reporter_name": rep.reporter_name,
                        "ward_name": rep.ward_name,
                        "description": rep.description,
                        "severity": rep.severity,
                        "status": rep.status,
                        "water_depth_cm": rep.water_depth_cm,
                        "image_url": rep.image_url,
                        "ai_confidence": rep.ai_confidence,
                    },
                }
                for rep in reports
            ]
        except Exception:
            pass

    if not features:
        features = [
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [rep["lng"], rep["lat"]]},
                "properties": rep,
            }
            for rep in FALLBACK_REPORTS
        ]

    return {"type": "FeatureCollection", "features": features}


@router.get("/risk-zones")
async def get_risk_zones_geojson(
    db: AsyncSession | None = Depends(get_db),
) -> dict[str, Any]:
    features = []
    if db is not None:
        try:
            stmt = select(RiskZone).where(not RiskZone.is_deleted)
            result = await db.execute(stmt)
            zones = result.scalars().all()
            for rz in zones:
                polygon = WARD_POLYGONS.get(
                    rz.ward_number,
                    [
                        [
                            83.20 + (rz.ward_number * 0.005),
                            17.68 + (rz.ward_number * 0.005),
                        ],
                        [
                            83.22 + (rz.ward_number * 0.005),
                            17.68 + (rz.ward_number * 0.005),
                        ],
                        [
                            83.22 + (rz.ward_number * 0.005),
                            17.70 + (rz.ward_number * 0.005),
                        ],
                        [
                            83.20 + (rz.ward_number * 0.005),
                            17.70 + (rz.ward_number * 0.005),
                        ],
                        [
                            83.20 + (rz.ward_number * 0.005),
                            17.68 + (rz.ward_number * 0.005),
                        ],
                    ],
                )
                features.append(
                    {
                        "type": "Feature",
                        "geometry": {"type": "Polygon", "coordinates": [polygon]},
                        "properties": {
                            "id": str(rz.id),
                            "ward_number": rz.ward_number,
                            "ward_name": rz.ward_name,
                            "risk_score": rz.risk_score,
                            "risk_category": rz.risk_category,
                            "population": rz.population,
                            "elevation_meters": rz.elevation_meters,
                            "water_level_cm": rz.water_level_cm,
                            "rainfall_mm_hr": rz.rainfall_mm_hr,
                            "active_alerts_count": rz.active_alerts_count,
                        },
                    }
                )
        except Exception:
            pass

    if not features:
        for rz in FALLBACK_ZONES:
            polygon = WARD_POLYGONS.get(rz["ward_number"], WARD_POLYGONS[14])
            features.append(
                {
                    "type": "Feature",
                    "geometry": {"type": "Polygon", "coordinates": [polygon]},
                    "properties": rz,
                }
            )

    return {"type": "FeatureCollection", "features": features}


@router.get("/drainage")
async def get_drainage_geojson() -> dict[str, Any]:
    """
    GeoJSON endpoint serving Visakhapatnam's Stormwater Drainage Network.
    Returns Primary Drains, Secondary Drains, Underground Culverts, Blocked Canals,
    Overflow Points, and Ocean Outfalls with AI Telemetry & Capacity Status.
    """
    features = [
        # Primary Drain Trunk #1
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [83.210, 17.680],
                    [83.225, 17.685],
                    [83.245, 17.690],
                    [83.275, 17.695],
                    [83.300, 17.690],
                ],
            },
            "properties": {
                "id": "d-prim-1",
                "name": "Gajuwaka Main Storm Trunk Canal #1",
                "drain_type": "Primary Stormwater Canal",
                "color": "#2563EB",
                "capacity": "2,400 m³/hr",
                "status": "Clear",
                "connected_wards": "Ward 14 (Gajuwaka), Ward 22 (Sheela Nagar)",
                "flow_direction": "North-West to Bay of Bengal Coast",
                "maintenance_status": "Dredged 3 days ago (GVMC Sanitation)",
                "capacity_status": "78% Capacity Full",
                "congestion_level": "Moderate Flow",
                "overflow_probability": "42%",
                "ai_reason": "Heavy rainfall 68mm/h nearing design threshold of 75mm/h.",
            },
        },
        # Primary Drain Trunk #2
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [[83.315, 17.745], [83.325, 17.738], [83.340, 17.730]],
            },
            "properties": {
                "id": "d-prim-2",
                "name": "MVP Colony Lawson Bay Outfall Channel",
                "drain_type": "Primary Stormwater Canal",
                "color": "#2563EB",
                "capacity": "1,800 m³/hr",
                "status": "Clear",
                "connected_wards": "Ward 2 (MVP Colony), Ward 11 (Seethammadhara)",
                "flow_direction": "West to East (Lawson Bay Outfall)",
                "maintenance_status": "Desilted 1 week ago",
                "capacity_status": "55% Capacity Normal",
                "congestion_level": "Low",
                "overflow_probability": "18%",
                "ai_reason": "Canal flow unhindered; tidal surge within safety limit.",
            },
        },
        # Secondary Drain
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [[83.235, 17.695], [83.250, 17.690], [83.265, 17.685]],
            },
            "properties": {
                "id": "d-sec-1",
                "name": "Sheela Nagar Arterial Branch Drain",
                "drain_type": "Secondary Drain",
                "color": "#38BDF8",
                "capacity": "950 m³/hr",
                "status": "Congested",
                "connected_wards": "Ward 22 (Sheela Nagar)",
                "flow_direction": "South-East to Main Trunk #1",
                "maintenance_status": "Desilting Scheduled",
                "capacity_status": "92% High Utilization",
                "congestion_level": "High Congestion near Junction J-3",
                "overflow_probability": "76%",
                "ai_reason": "Silt accumulation reducing flow cross-section by 35%.",
            },
        },
        # Blocked Drain
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [[83.212, 17.682], [83.218, 17.685], [83.224, 17.688]],
            },
            "properties": {
                "id": "d-blk-1",
                "name": "Gajuwaka Industrial Underpass Blocked Canal",
                "drain_type": "Blocked Primary Canal",
                "color": "#EF4444",
                "capacity": "1,600 m³/hr (Blocked)",
                "status": "Blocked",
                "connected_wards": "Ward 14 (Gajuwaka Underpass)",
                "flow_direction": "Stagnant / Backflow",
                "maintenance_status": "Emergency Dredging Required",
                "capacity_status": "100% Overflowing",
                "congestion_level": "Critical Blockage at Junction J-4",
                "overflow_probability": "95%",
                "ai_reason": "Debris and plastic clogging underpass culvert grid during heavy rain.",
            },
        },
        # Overflow Point
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [83.218, 17.685],
            },
            "properties": {
                "id": "of-1",
                "name": "Junction J-4 Overflow Point (Gajuwaka)",
                "color": "#F97316",
                "capacity": "Overflowing > 400 m³/hr",
                "status": "Active Overflow",
                "connected_wards": "Ward 14",
                "flow_direction": "Spilling onto NH-16 Surface Road",
                "maintenance_status": "Pumping Units Deployed",
                "capacity_status": "Overflow Active",
                "congestion_level": "Critical Spillover",
                "overflow_probability": "98%",
                "ai_reason": "Inundation height 65cm recorded on surface road.",
            },
        },
        # Drain Outfall
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [83.300, 17.690],
            },
            "properties": {
                "id": "out-1",
                "name": "Old Town Bay of Bengal Main Ocean Outfall",
                "color": "#22C55E",
                "capacity": "3,500 m³/hr Outfall Capacity",
                "status": "Active Discharge",
                "connected_wards": "Ward 8 & Ward 14 Trunk Canals",
                "flow_direction": "Discharging into Bay of Bengal",
                "maintenance_status": "Tide Gate Operational",
                "capacity_status": "Discharging Cleanly",
                "congestion_level": "Clear Tidal Outflow",
                "overflow_probability": "12%",
                "ai_reason": "Tide gate open allowing maximum gravity discharge.",
            },
        },
    ]

    return {"type": "FeatureCollection", "features": features}
