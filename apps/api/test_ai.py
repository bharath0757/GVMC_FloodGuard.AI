from app.ai.prediction.risk_predictor import predict_flood_risk
from app.ai.recommendation.shelter_recommender import recommend_shelters
from app.ai.routing.evacuation_router import compute_safe_routes
from app.ai.services.ai_service import get_dashboard_summary

print("ALL AI MODULES IMPORTED OK")

result = predict_flood_risk(68.2, 142.0, 14)
print(f"Risk score ward 14: {result['risk_score']} ({result['risk_category']}) confidence={result['confidence']}")
print(f"Model: {result['model_used']}")
print(f"Top factor: {result['explanations'][0]['feature']}")

shelter = recommend_shelters(17.685, 83.210, result['risk_score'])
print(f"Best shelter: {shelter['primary_shelter']['name']}")

route = compute_safe_routes("w14", ["w14", "w22"], [])
print(f"Primary route: {route['primary_route']['path']}")

dash = get_dashboard_summary()
print(f"Dashboard: {dash['overall_alert_level']} | Critical wards: {dash['critical_wards']}")
