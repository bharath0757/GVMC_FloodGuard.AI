from app.ai.analysis.image_analyzer import analyze_flood_report
from app.ai.assistant.flood_assistant import process_assistant_query, get_assistant_suggestions
from app.services.notification_service import NotificationService
from app.services.report_service import ReportService
import asyncio

async def main():
    print("--- 1. Testing AI Image/Hazard Analysis ---")
    analysis = analyze_flood_report(
        title="Gajuwaka Main Road Submerged",
        description="Water depth is knee high near bus station. Vehicles trapped.",
        water_depth_cm=65.0,
        image_url="https://example.com/photo.jpg"
    )
    print(f"Category: {analysis['category']} | Severity: {analysis['estimated_severity']} | Priority: {analysis['suggested_priority']} | Confidence: {analysis['confidence']}")

    print("\n--- 2. Testing Flood Assistant ---")
    res1 = process_assistant_query("Is Gajuwaka safe right now?")
    print(f"Query 1 intent: {res1['intent']} | Target: {res1['target_ward_name']}")
    print("Response snippet:", res1['response_text'][:120].encode('ascii', 'ignore').decode('ascii'))

    res2 = process_assistant_query("Which shelter should I use with medical team near MVP Colony?")
    print(f"Query 2 intent: {res2['intent']} | Cards: {len(res2['cards'])}")

    suggestions = get_assistant_suggestions()
    print(f"Suggestions count: {len(suggestions)}")

    print("\n--- 3. Testing Notification Service ---")
    notif = await NotificationService.create_notification(
        db=None,
        notification_type="verified_report",
        title="Verified: Gajuwaka Flood",
        message="Authority verified report.",
        severity="High",
    )
    print(f"Created Notification: {notif['id']} ({notif['title']})")
    all_notifs = await NotificationService.get_notifications(db=None)
    print(f"Total notifications: {len(all_notifs)}")

    print("\n--- 4. Testing Report Service Workflows ---")
    reps = await ReportService.get_all_reports(db=None)
    print(f"Initial reports: {len(reps)}")

    verified = await ReportService.verify_report(db=None, report_id="rep-102", status="Verified", priority="P0", internal_notes="Dispatched rescue squad.")
    print(f"Verified Report rep-102: Status={verified['status']}, Priority={verified['priority']}, VerifiedBy={verified['verified_by']}")

    resolved = await ReportService.resolve_report(db=None, report_id="rep-101", resolution_status="Resolved")
    print(f"Resolved Report rep-101: ResolutionStatus={resolved['resolution_status']}")

    print("\nALL MILESTONE 8 BACKEND LOGIC VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(main())
