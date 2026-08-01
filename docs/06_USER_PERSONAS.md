# FloodGuard AI: User Personas

This document outlines the core user personas for the FloodGuard AI platform, designed for Indian smart cities (initially Visakhapatnam/GVMC). Understanding these personas is critical for ensuring the platform addresses the diverse needs, technical proficiencies, and accessibility requirements of our user base.

---

## 1. Ramesh - The Vulnerable Citizen

*   **Photo Placeholder:** A middle-aged man in simple work clothes, looking concerned while checking a basic smartphone.
*   **Name/Age:** Ramesh, 35
*   **Occupation:** Daily Wage Worker (Construction)
*   **Location:** Low-lying, flood-prone area in Visakhapatnam (e.g., Gnanapuram)
*   **Tech Proficiency:** Low to Basic. Uses WhatsApp and YouTube, but struggles with complex apps. Primary language is Telugu.

### Profile
*   **Goals:** Ensure the safety of his family during heavy rains. Find safe, accessible shelters quickly. Avoid losing daily wages by knowing safe routes to work or knowing if work is canceled due to floods.
*   **Frustrations:** Official alerts are often in English or complex language. Doesn't know the safest routes when sudden flooding occurs. Often receives information too late.
*   **Scenarios:**
    *   Heavy rain starts at night. Ramesh needs a loud, immediate voice alert in Telugu warning him of rising water levels.
    *   His street is flooded. He needs simple, voice-guided directions to the nearest safe shelter.
*   **Feature Mapping:** Multilingual Voice Assistant, Early Warnings (SMS/Voice), Simple Evacuation Routing (Safe/Unsafe paths).
*   **Accessibility Needs:** Voice-first interface in Telugu, large icons, high-contrast text, minimal typing required.

---

## 2. Priya - The Proactive Citizen / Volunteer

*   **Photo Placeholder:** A young woman taking a photo of a waterlogged street with her smartphone.
*   **Name/Age:** Priya, 22
*   **Occupation:** College Student (Engineering)
*   **Location:** MVP Colony, Visakhapatnam
*   **Tech Proficiency:** High. Very active on social media, uses complex apps easily.

### Profile
*   **Goals:** Stay updated on city-wide flood situations. Help her community by reporting issues. Assist neighbors and authorities during crises.
*   **Frustrations:** Lack of centralized, real-time information. Seeing fake news or outdated flood images on social media. Inability to directly help authorities with actionable data.
*   **Scenarios:**
    *   Priya notices a blocked drain causing water pooling. She uses the app to take a photo, which AI automatically analyzes for severity and tags the location.
    *   She uses the real-time map to check if the route to her college is clear before leaving home.
*   **Feature Mapping:** Crowd Reporting with Image AI, Real-time Flood Maps, Street-level Prediction.
*   **Accessibility Needs:** Standard modern UI/UX, responsive design, easy social sharing features.

---

## 3. Dr. Suresh - The Strategic Commander

*   **Photo Placeholder:** A senior official in an operations center, looking at a large dashboard with multiple screens.
*   **Name/Age:** Dr. Suresh, 48
*   **Occupation:** District Disaster Management Officer
*   **Location:** District Collectorate, Visakhapatnam
*   **Tech Proficiency:** Moderate to High. Comfortable with enterprise software and dashboards.

### Profile
*   **Goals:** Anticipate flood events before they escalate. Allocate resources (boats, pumps, food) efficiently based on risk. Minimize casualties and property damage.
*   **Frustrations:** Information is siloed across different departments. Field reports are delayed or inaccurate. Lack of predictive tools makes response reactive rather than proactive.
*   **Scenarios:**
    *   A cyclone is forecasted. Dr. Suresh uses the 3D Digital Twin to simulate the potential flood impact and preemptively orders evacuations in high-risk zones.
    *   During an event, he monitors the Gov Dashboard to see real-time water levels and citizen distress reports to deploy rescue teams.
*   **Feature Mapping:** Gov Dashboard, 3D Digital Twin, AI Flood Risk Scoring, Resource Management, Historical Analytics.
*   **Accessibility Needs:** Data-dense but clear visualizations, exportable reports, multi-screen support, high reliability.

---

## 4. Lakshmi - The Local Leader

*   **Photo Placeholder:** A confident woman interacting with citizens while holding a tablet.
*   **Name/Age:** Lakshmi, 40
*   **Occupation:** GVMC Ward Councilor
*   **Location:** specific GVMC Ward
*   **Tech Proficiency:** Moderate. Uses tablets and basic data apps.

### Profile
*   **Goals:** Keep her ward constituents safe. Manage local shelters effectively. Ensure citizen complaints regarding flooding/drains are addressed promptly.
*   **Frustrations:** Overwhelmed by citizen calls during a flood. Hard to prioritize which streets need immediate municipal action. Lack of data to justify budget requests for drainage improvements.
*   **Scenarios:**
    *   Citizens are reporting waterlogging. Lakshmi uses the dashboard to see an aggregated view of reports in her ward, helping her direct municipal workers to the most critical blockages.
    *   She monitors shelter capacity in her ward to ensure they aren't overcrowded and request more supplies if needed.
*   **Feature Mapping:** Gov Dashboard (Ward-level view), Crowd Reporting (verification), Shelter Recommendations & Management.
*   **Accessibility Needs:** Mobile-friendly dashboard, clear summaries, alerts for critical issues in her specific ward.

---

## 5. Arun - The Platform Guardian

*   **Photo Placeholder:** A young IT professional working on multiple monitors with code and system graphs.
*   **Name/Age:** Arun, 30
*   **Occupation:** System Administrator (IT Department)
*   **Location:** GVMC IT Center
*   **Tech Proficiency:** Expert.

### Profile
*   **Goals:** Ensure the FloodGuard platform maintains 99.9% uptime, especially during disasters. Manage user access and security securely. Monitor API integrations (weather, sensors).
*   **Frustrations:** System crashes during peak load (during a flood). Unauthorized access attempts. Dealing with broken data pipelines from external sensors.
*   **Scenarios:**
    *   During a major storm, traffic to the citizen app spikes. Arun monitors system health and auto-scaling to ensure the platform remains responsive.
    *   He provisions a new role for temporary relief workers to access specific parts of the dashboard.
*   **Feature Mapping:** System Admin Dashboard, Role-based Auth, Infrastructure Monitoring, Audit Logs.
*   **Accessibility Needs:** Command-line interfaces, detailed error logs, customizable alert thresholds.

---

## 6. Meera - The Frontline Responder

*   **Photo Placeholder:** A firefighter or NDRF responder in gear, checking a rugged tablet in a vehicle.
*   **Name/Age:** Meera, 38
*   **Occupation:** Emergency Responder (Fire & Rescue / NDRF)
*   **Location:** Mobile / Field Operations
*   **Tech Proficiency:** Moderate. Needs rugged, simple interfaces that work under stress.

### Profile
*   **Goals:** Reach stranded citizens as quickly and safely as possible. Know the exact depth of water on rescue routes.
*   **Frustrations:** Given GPS coordinates but the route is impassable due to deep water. Wasting time navigating blocked roads. Lack of real-time situational awareness on the ground.
*   **Scenarios:**
    *   Meera receives a distress call. The app provides the fastest route to the location that avoids severe waterlogging, factoring in real-time flood depth data.
    *   She uses the app to mark a street as "impassable by vehicle" to instantly update the central system and other responders.
*   **Feature Mapping:** Evacuation Routing (Responder Mode), Real-time Flood Maps, SOS / Distress Tracking.
*   **Accessibility Needs:** High-contrast offline mode, large touch targets (usable with gloves), clear auditory navigation cues.

---

## 7. Venkat - The Dependent Elderly

*   **Photo Placeholder:** An elderly man sitting comfortably, using a basic smartphone with voice commands.
*   **Name/Age:** Venkat, 70
*   **Occupation:** Retired
*   **Location:** Seethammadhara, Visakhapatnam
*   **Tech Proficiency:** Very Low. Relies heavily on voice or assistance from others.

### Profile
*   **Goals:** Receive clear, early warnings. Know if his immediate area is safe. Get help if he cannot evacuate on his own.
*   **Frustrations:** Cannot read small text on screens. Confused by complex app navigation. Physical limitations make rapid evacuation impossible without help.
*   **Scenarios:**
    *   Venkat uses the voice assistant, asking, "Is it going to flood near my house today?" in Telugu, and gets a clear, reassuring answer.
    *   If a flood is imminent, his profile triggers a specific alert to emergency services indicating a citizen requiring physical evacuation assistance.
*   **Feature Mapping:** Multilingual Voice Assistant, SOS/Emergency Assistance Request.
*   **Accessibility Needs:** Voice-only interaction capability, extreme simplicity, large text, screen reader compatibility.
