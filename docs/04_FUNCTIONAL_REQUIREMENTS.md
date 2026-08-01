# Functional Requirements

This document outlines the functional requirements for the FloodGuard AI platform, an intelligent flood management and prediction system.

## 1. AI Flood Risk Scoring (ARS)

| Req ID | Description | Priority | Acceptance Criteria | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| FR-ARS-001 | Calculate real-time flood risk scores (1-10) for defined geographic zones. | P0 | Risk scores are generated and updated at least every 15 minutes. | Weather API, Sensor Data |
| FR-ARS-002 | Classify zones into risk categories (Low, Moderate, High, Severe). | P0 | Zones are accurately categorized based on the calculated risk score. | FR-ARS-001 |
| FR-ARS-003 | Correlate current conditions with historical flood data to adjust risk. | P1 | Risk scores reflect historical patterns for similar conditions. | Historical DB |
| FR-ARS-004 | Support manual override of risk scores by authorized government officials. | P1 | Authorized users can manually set risk scores with an audit log. | Auth Module |
| FR-ARS-005 | Display risk scores on a geographic map overlay. | P0 | Risk scores are visually represented on the platform's main map. | Mapbox GL JS |
| FR-ARS-006 | Generate localized risk score alerts for citizens in affected zones. | P1 | Users in zones changing to 'High' or 'Severe' receive immediate alerts. | Notification Sys |
| FR-ARS-007 | Expose risk score data via API for third-party integrations. | P2 | Well-documented REST API endpoint for retrieving current risk scores. | API Gateway |

## 2. Street-level Flood Prediction (SFP)

| Req ID | Description | Priority | Acceptance Criteria | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| FR-SFP-001 | Generate ward-level flood predictions using Temporal Fusion Transformers. | P0 | Predictions are generated for all monitored wards. | AI Engine |
| FR-SFP-002 | Provide short-term flood forecasts (1h, 6h, 24h, 72h). | P0 | Forecasts are available for all specified time horizons. | Weather API |
| FR-SFP-003 | Calculate and display confidence intervals for all predictions. | P1 | Predictions include a +/- variance margin or percentage confidence. | FR-SFP-001 |
| FR-SFP-004 | Define and trigger automated alert thresholds based on predicted water levels. | P0 | System triggers alerts when predictions exceed defined safety thresholds. | Notification Sys |
| FR-SFP-005 | Simulate 'what-if' scenarios based on predicted rainfall intensity. | P2 | Users can input hypothetical rainfall to see predicted flood outcomes. | AI Engine |
| FR-SFP-006 | Continuously validate predictions against actual reported flood levels. | P1 | System logs accuracy metrics for model refinement. | Crowd Reporting |

## 3. Evacuation Route Planning (ERP)

| Req ID | Description | Priority | Acceptance Criteria | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| FR-ERP-001 | Generate multi-modal evacuation routes (walking, driving). | P0 | Routes are generated avoiding known flooded areas. | Routing Engine |
| FR-ERP-002 | Dynamically reroute users in real-time based on new flood data. | P0 | Active routes are updated instantly if a path becomes flooded. | FR-ARS-001 |
| FR-ERP-003 | Provide accessibility-optimized routes for elderly or disabled users. | P1 | System offers routes avoiding stairs, steep inclines, or rough terrain. | User Profile |
| FR-ERP-004 | Implement capacity-aware routing to prevent bottlenecking. | P2 | Routing distributes users across multiple paths to avoid congestion. | GIS Data |
| FR-ERP-005 | Display evacuation routes clearly on the mobile and web application. | P0 | Routes are visually distinct and easy to follow on the map interface. | Map UI |
| FR-ERP-006 | Allow offline access to pre-calculated evacuation routes. | P1 | Users can view saved routes without an active internet connection. | Offline Storage |
| FR-ERP-007 | Provide turn-by-turn navigation for active evacuation routes. | P2 | App provides visual and audio navigation instructions. | Routing Engine |

## 4. Shelter Recommendation (SRE)

| Req ID | Description | Priority | Acceptance Criteria | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| FR-SRE-001 | Match users with the nearest available emergency shelters. | P0 | System recommends closest safe shelters based on user location. | GIS Data |
| FR-SRE-002 | Track and display real-time shelter capacity and occupancy. | P0 | Shelter capacity is updated accurately and visible to users. | Gov Dashboard |
| FR-SRE-003 | Filter shelters based on special needs (medical, pet-friendly). | P1 | Users can find shelters accommodating specific requirements. | Shelter DB |
| FR-SRE-004 | Allow shelter managers to update status (Open, Full, Closed). | P0 | Authorized personnel can change shelter status via the app. | Auth Module |
| FR-SRE-005 | Reserve spots at specific shelters for vulnerable individuals. | P2 | System supports priority allocation for predefined user groups. | User Profile |
| FR-SRE-006 | Provide directions from user location to the recommended shelter. | P0 | Integrates seamlessly with Evacuation Route Planning. | FR-ERP-001 |

## 5. Crowd Reporting (CRP)

| Req ID | Description | Priority | Acceptance Criteria | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| FR-CRP-001 | Allow citizens to upload photos of localized flooding or damage. | P0 | Users can successfully upload images via mobile or web app. | Cloud Storage |
| FR-CRP-002 | Automatically capture geolocation and timestamp of submitted reports. | P0 | Reports contain accurate GPS coordinates and time data. | Device API |
| FR-CRP-003 | Analyze uploaded images using YOLOv11 and BLIP-2 for flood severity. | P1 | AI successfully identifies water levels, blocked drains, or hazards. | AI Engine |
| FR-CRP-004 | Implement a verification workflow to filter spam or fake reports. | P1 | Reports are verified via AI confidence score or manual review before public display. | Admin UI |
| FR-CRP-005 | Classify report severity automatically based on AI analysis. | P1 | Reports are tagged with severity (Low, Medium, High). | FR-CRP-003 |
| FR-CRP-006 | Display verified crowd reports on the public flood map. | P0 | Approved reports appear as clickable icons on the map interface. | Map UI |
| FR-CRP-007 | Allow users to upvote or confirm existing reports in their area. | P2 | Users can validate reports, increasing their reliability score. | Auth Module |

## 6. Voice Assistant (VAS)

| Req ID | Description | Priority | Acceptance Criteria | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| FR-VAS-001 | Process speech-to-text queries in Telugu, Hindi, and English using Whisper. | P0 | System accurately transcribes spoken queries in supported languages. | AI Engine |
| FR-VAS-002 | Recognize intents related to flood information, shelters, and routes. | P0 | System identifies user intent (e.g., "Where is the nearest shelter?"). | NLP Module |
| FR-VAS-003 | Provide spoken responses answering flood-related queries. | P0 | System vocalizes answers using text-to-speech in the requested language. | TTS Engine |
| FR-VAS-004 | Broadcast critical voice alerts automatically during severe events. | P1 | App can play audio warnings automatically if user permissions allow. | Notification Sys |
| FR-VAS-005 | Allow users to submit crowd reports completely via voice command. | P2 | User can describe a flood situation and the system logs it as a report. | FR-CRP-001 |
| FR-VAS-006 | Support fallback to text interface if voice processing fails. | P1 | System prompts for text input if audio is unclear or processing errors occur. | UI Framework |

## 7. Government Dashboard (GDB)

| Req ID | Description | Priority | Acceptance Criteria | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| FR-GDB-001 | Provide a real-time command center map showing all active alerts and reports. | P0 | Map aggregates risk scores, predictions, and crowd reports in one view. | All Modules |
| FR-GDB-002 | Enable resource allocation and tracking (boats, rescue teams, pumps). | P1 | Officials can assign resources to specific locations and track status. | DB Schema |
| FR-GDB-003 | Facilitate deployment tracking of emergency response personnel. | P1 | Live location of responder teams is visible on the dashboard. | GPS Tracking |
| FR-GDB-004 | Generate situational reports for executive summaries. | P1 | System can export current status reports in PDF/CSV format. | Reporting Engine |
| FR-GDB-005 | Allow officials to broadcast mass emergency notifications (SMS/Push). | P0 | Officials can send targeted alerts to specific wards or the entire city. | Notification Sys |
| FR-GDB-006 | Monitor system health and AI model performance metrics. | P2 | Dashboard shows API latency, active users, and model accuracy stats. | Monitoring Tool |

## 8. Digital Twin (DTW)

| Req ID | Description | Priority | Acceptance Criteria | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| FR-DTW-001 | Render a 3D city model using CesiumJS or Three.js. | P1 | System displays an interactive 3D representation of the city infrastructure. | GIS Data |
| FR-DTW-002 | Overlay flood simulations onto the 3D model. | P1 | Water levels are visually simulated reacting to the city topography. | FR-SFP-001 |
| FR-DTW-003 | Enable time-series playback of predicted flood events. | P2 | Users can use a timeline slider to watch predicted flooding progress over time. | FR-SFP-002 |
| FR-DTW-004 | Support scenario modeling (e.g., "What if the dam opens?"). | P2 | System can simulate specific extreme events on the 3D model. | AI Engine |
| FR-DTW-005 | Visualize critical infrastructure vulnerability in 3D (hospitals, power stations). | P1 | Key assets are highlighted when flood levels threaten them in the simulation. | GIS Data |

## 9. Historical Analytics (HAN)

| Req ID | Description | Priority | Acceptance Criteria | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| FR-HAN-001 | Perform trend analysis on past flood events and rainfall data. | P1 | System displays graphs showing long-term flooding trends. | Historical DB |
| FR-HAN-002 | Identify and visualize seasonal flooding patterns. | P1 | Analytics module highlights recurring seasonal risks. | FR-HAN-001 |
| FR-HAN-003 | Generate ward-wise statistics on flood frequency and severity. | P1 | Users can view historical risk profiles for specific city wards. | GIS Data |
| FR-HAN-004 | Export analytical reports in CSV, PDF, and Excel formats. | P1 | Reports are generated correctly and download successfully. | Reporting Engine |
| FR-HAN-005 | Compare current event severity against historical benchmarks. | P2 | System automatically flags if a current event is "worst in X years". | FR-ARS-001 |

## 10. Weather Monitoring (WMN)

| Req ID | Description | Priority | Acceptance Criteria | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| FR-WMN-001 | Integrate via API with IMD and OpenWeatherMap for real-time data. | P0 | System successfully pulls rainfall, temperature, and wind data continuously. | External APIs |
| FR-WMN-002 | Generate and display rainfall heatmaps across the city area. | P1 | Map shows color-coded precipitation intensity. | Map UI |
| FR-WMN-003 | Process and distribute severe weather alerts from meteorological agencies. | P0 | External severe warnings are ingested and pushed to relevant users. | Notification Sys |
| FR-WMN-004 | Track and visualize storm trajectories and expected impact times. | P2 | System shows projected path of severe weather systems. | Weather API |

## 11. Authentication & Authorization (AAU)

| Req ID | Description | Priority | Acceptance Criteria | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| FR-AAU-001 | Support user registration and secure login via email/password. | P0 | Users can create accounts and log in securely. | Auth Service |
| FR-AAU-002 | Implement OAuth integration (Google, Mobile Number/OTP). | P1 | Users can log in using social accounts or phone numbers. | OAuth Providers |
| FR-AAU-003 | Enforce role-based access control (Citizen, Gov Officer, Admin). | P0 | Users only have access to features permitted by their role. | DB Schema |
| FR-AAU-004 | Manage secure user sessions with automatic timeouts for sensitive roles. | P0 | Admin/Gov sessions timeout after inactivity; tokens are managed securely. | Auth Service |
| FR-AAU-005 | Allow users to manage profile data and notification preferences. | P1 | Users can update contact info, language, and alert settings. | User DB |

## Cross-Cutting Requirements (CCR)

| Req ID | Description | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| FR-CCR-001 | Support multi-channel notifications (Push, SMS, Email). | P0 | Alerts can be delivered via all three channels based on preference. |
| FR-CCR-002 | Comply with WCAG 2.1 AA accessibility standards. | P1 | Platform passes automated and manual accessibility audits. |
| FR-CCR-003 | Provide full Internationalization (i18n) support (English, Telugu, Hindi). | P0 | All UI text and static content is available in the supported languages. |
| FR-CCR-004 | Maintain comprehensive audit logging for all critical system actions. | P0 | Actions by Gov Officers and Admins are logged with user ID and timestamp. |
| FR-CCR-005 | Allow data export capabilities for all tabular data views. | P1 | Standard grids and lists can be exported to CSV format. |
