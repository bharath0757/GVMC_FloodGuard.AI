import urllib.request, json

data = urllib.request.urlopen('http://127.0.0.1:8000/api/v1/ai/dashboard-summary').read().decode()
d = json.loads(data)
print(f"ALERT: {d['overall_alert_level']} | Critical: {d['critical_wards']} | Model: {d['model_status']}")
print(f"Avg risk: {d['average_risk_score']} | Wards: {d['total_wards_monitored']}")
top = d['top_risk_ward']
print(f"Top risk ward: {top['ward_name']} = {top['risk_score']}")

# Test predict-risk
import urllib.parse
req_data = json.dumps({"ward_number": 14, "rainfall_mm_hr": 68.2, "water_level_cm": 142.0}).encode()
req = urllib.request.Request('http://127.0.0.1:8000/api/v1/ai/predict-risk', data=req_data, headers={'Content-Type': 'application/json'})
result = json.loads(urllib.request.urlopen(req).read().decode())
print(f"predict-risk: {result['risk_score']} ({result['risk_category']}) model={result['model_used']}")

# Test high-risk-zones
data2 = urllib.request.urlopen('http://127.0.0.1:8000/api/v1/ai/high-risk-zones').read().decode()
d2 = json.loads(data2)
print(f"high-risk-zones: {d2['high_risk_count']} zones")
print("ALL AI ENDPOINTS VERIFIED OK")
