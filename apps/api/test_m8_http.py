import urllib.request
import urllib.parse
import json

BASE_URL = "http://127.0.0.1:8000/api/v1"

def get(path):
    req = urllib.request.Request(f"{BASE_URL}{path}")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def post(path, body):
    data = json.dumps(body).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}{path}", data=data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def patch(path, body):
    data = json.dumps(body).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}{path}", data=data, headers={'Content-Type': 'application/json'}, method='PATCH')
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

print("--- 1. Testing GET /notifications ---")
n_res = get("/notifications")
print("Total notifications:", n_res["total_notifications"])

print("\n--- 2. Testing GET /assistant/suggestions ---")
s_res = get("/assistant/suggestions")
print("Suggestions count:", s_res["total_suggestions"])

print("\n--- 3. Testing POST /assistant/query ---")
a_res = post("/assistant/query", {"query": "Is Gajuwaka safe right now?"})
print("Assistant intent:", a_res["intent"])

print("\n--- 4. Testing POST /reports/create ---")
rep_req = {
    "ward_name": "Gajuwaka",
    "title": "Severe Waterlogging Near Underpass",
    "description": "Flood water depth exceeds 50cm. Vehicles stranded.",
    "severity": "High",
    "water_depth_cm": 55.0,
    "lat": 17.6851,
    "lng": 83.2101,
    "image_url": "https://example.com/flood.jpg"
}
r_res = post("/reports/create", rep_req)
print("Created Report ID:", r_res["id"], "| AI Category:", r_res["ai_analysis"]["category"], "| Priority:", r_res["priority"])

print("\n--- 5. Testing GET /reports/my ---")
my_res = get("/reports/my")
print("My reports count:", len(my_res))

print("\n--- 6. Testing PATCH /reports/{id}/verify ---")
v_res = patch(f"/reports/{r_res['id']}/verify", {"status": "Verified", "priority": "P0", "internal_notes": "NDRF Squad #1 dispatched."})
print("Verified Report status:", v_res["status"], "| VerifiedBy:", v_res["verified_by"])

print("\n--- 7. Testing PATCH /reports/{id}/resolve ---")
res_res = patch(f"/reports/{r_res['id']}/resolve", {"resolution_status": "Resolved", "internal_notes": "Drain cleared."})
print("Resolution status:", res_res["resolution_status"])

print("\nALL MILESTONE 8 HTTP ENDPOINTS TESTED OK!")
