"""
FloodGuard AI - A* Evacuation Route Planning Engine
Finds safest evacuation paths avoiding flooded / high-risk road segments.
Graph represents Visakhapatnam GVMC ward road network.
"""
from __future__ import annotations

import math
import heapq
from typing import Dict, Any, List, Tuple, Optional


# ---------------------------------------------------------------------------
# Visakhapatnam Ward Road Graph
# Node = Ward ID | Edge = (neighbor_ward, distance_km, road_type)
# ---------------------------------------------------------------------------
WARD_GRAPH: Dict[str, List[Tuple[str, float, str]]] = {
    "w14": [("w22", 2.1, "arterial"), ("w8", 3.4, "arterial"), ("w1", 1.8, "local")],
    "w22": [("w14", 2.1, "arterial"), ("w19", 1.5, "local"), ("w5", 2.8, "arterial")],
    "w19": [("w22", 1.5, "local"), ("w11", 3.2, "arterial"), ("w8", 2.7, "arterial")],
    "w8":  [("w14", 3.4, "arterial"), ("w19", 2.7, "arterial"), ("w3", 2.0, "highway")],
    "w3":  [("w8", 2.0, "highway"), ("w11", 1.8, "arterial"), ("w16", 3.1, "arterial")],
    "w11": [("w3", 1.8, "arterial"), ("w19", 3.2, "arterial"), ("w5", 2.2, "local"), ("w2", 2.9, "highway")],
    "w5":  [("w22", 2.8, "arterial"), ("w11", 2.2, "local"), ("w2", 1.9, "arterial")],
    "w2":  [("w5", 1.9, "arterial"), ("w11", 2.9, "highway"), ("w16", 2.0, "highway")],
    "w16": [("w3", 3.1, "arterial"), ("w2", 2.0, "highway")],
    "w1":  [("w14", 1.8, "local"), ("w22", 2.5, "local")],
}

# Shelter target nodes (safe zones)
SAFE_ZONES = {"w2", "w16", "w11", "w5"}

# Ward lat/lng centers for heuristic
WARD_COORDS: Dict[str, Tuple[float, float]] = {
    "w14": (17.685, 83.210), "w22": (17.690, 83.235), "w19": (17.720, 83.260),
    "w8":  (17.695, 83.295), "w3":  (17.720, 83.310), "w11": (17.730, 83.290),
    "w5":  (17.718, 83.298), "w2":  (17.735, 83.320), "w16": (17.745, 83.325),
    "w1":  (17.680, 83.200),
}


def _heuristic(a: str, b: str) -> float:
    """Euclidean distance heuristic (in km) between two ward nodes."""
    if a not in WARD_COORDS or b not in WARD_COORDS:
        return 0.0
    lat1, lng1 = WARD_COORDS[a]
    lat2, lng2 = WARD_COORDS[b]
    return math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2) * 111.0  # approx km


def _road_cost_multiplier(road_type: str, flooded_roads: List[str], high_risk_zones: List[str], neighbor: str) -> float:
    """Return travel cost multiplier. Flooded/blocked roads get very high cost."""
    if neighbor in high_risk_zones:
        return 5.0  # Strongly avoid high-risk zones
    if road_type == "local" and neighbor in flooded_roads:
        return 50.0  # Impassable local road
    if road_type == "arterial" and neighbor in flooded_roads:
        return 8.0  # Difficult arterial
    return 1.0  # Normal road


def astar_evacuation_route(
    start_ward: str,
    target_ward: Optional[str],
    high_risk_wards: List[str],
    flooded_wards: List[str],
) -> Optional[Dict[str, Any]]:
    """
    A* algorithm finding safest evacuation path from start_ward to a safe zone.
    Returns path with distance, estimated time, and road segment details.
    """
    graph = WARD_GRAPH
    if start_ward not in graph:
        start_ward = "w14"  # Default to Gajuwaka

    goal = target_ward if target_ward else _nearest_safe_zone(start_ward, high_risk_wards, flooded_wards)

    if start_ward == goal:
        return _build_route_response([start_ward], 0.0, goal, "already_safe")

    # A* priority queue: (f_score, g_score, current_node, path)
    open_set: List[Tuple[float, float, str, List[str]]] = []
    heapq.heappush(open_set, (0.0, 0.0, start_ward, [start_ward]))
    visited: Dict[str, float] = {}

    while open_set:
        f, g, current, path = heapq.heappop(open_set)

        if current == goal:
            return _build_route_response(path, g, goal, "optimal")

        if current in visited and visited[current] <= g:
            continue
        visited[current] = g

        for neighbor, dist_km, road_type in graph.get(current, []):
            multiplier = _road_cost_multiplier(road_type, flooded_wards, high_risk_wards, neighbor)
            new_g = g + dist_km * multiplier
            h = _heuristic(neighbor, goal)
            new_f = new_g + h
            if neighbor not in visited:
                heapq.heappush(open_set, (new_f, new_g, neighbor, path + [neighbor]))

    # No path found — return best effort
    return _build_route_response([start_ward], 0.0, goal, "no_safe_path")


def _nearest_safe_zone(start: str, high_risk: List[str], flooded: List[str]) -> str:
    safe_options = SAFE_ZONES - set(high_risk) - set(flooded)
    if not safe_options:
        return "w16"  # Muralinagar (highest elevation)
    if not safe_options:
        return "w2"
    # Pick closest
    best = min(safe_options, key=lambda z: _heuristic(start, z))
    return best


def _build_route_response(
    path: List[str],
    total_dist_km: float,
    goal: str,
    status: str,
) -> Dict[str, Any]:
    # Actual distance (not cost-weighted)
    actual_dist = 0.0
    segments = []
    for i in range(len(path) - 1):
        src, dst = path[i], path[i + 1]
        for neighbor, dist_km, road_type in WARD_GRAPH.get(src, []):
            if neighbor == dst:
                actual_dist += dist_km
                segments.append({
                    "from_ward": src,
                    "to_ward": dst,
                    "distance_km": dist_km,
                    "road_type": road_type,
                })
                break

    estimated_time_min = round((actual_dist / 17.0) * 60, 0)  # 17 km/h evacuation speed

    return {
        "path": path,
        "segments": segments,
        "destination_ward": goal,
        "total_distance_km": round(actual_dist, 2),
        "estimated_time_min": int(estimated_time_min),
        "route_status": status,
        "total_nodes": len(path),
        "waypoints": [
            {
                "ward_id": w,
                "lat": WARD_COORDS.get(w, (17.686, 83.218))[0],
                "lng": WARD_COORDS.get(w, (17.686, 83.218))[1],
            }
            for w in path
        ],
    }


def compute_safe_routes(
    start_ward: str,
    high_risk_wards: List[str],
    flooded_wards: List[str],
) -> Dict[str, Any]:
    """
    Compute primary + alternative evacuation routes avoiding floods.
    """
    # Primary route
    primary = astar_evacuation_route(start_ward, None, high_risk_wards, flooded_wards)

    # Alternative: exclude primary destination to force different path
    alt_excluded = high_risk_wards + ([primary["destination_ward"]] if primary else [])
    alt_safe = SAFE_ZONES - set(alt_excluded) - set(flooded_wards)
    alt_goal = next(iter(alt_safe), "w16") if alt_safe else "w16"
    alternative = astar_evacuation_route(start_ward, alt_goal, high_risk_wards, flooded_wards)

    return {
        "start_ward": start_ward,
        "primary_route": primary,
        "alternative_route": alternative,
        "high_risk_wards_avoided": high_risk_wards,
        "flooded_wards_avoided": flooded_wards,
        "routing_algorithm": "A*-FloodAware-v1",
        "graph_nodes": len(WARD_GRAPH),
    }
