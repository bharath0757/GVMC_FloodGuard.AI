# Non-Functional Requirements

This document specifies the non-functional requirements (NFRs) for the FloodGuard AI platform, defining system attributes such as performance, scalability, reliability, security, usability, maintainability, and compliance.

## 1. Performance

| Req ID       | Attribute              | Description & Measurable Target                                                                                                         |
| :----------- | :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-PERF-001 | API Latency            | API response times must meet: p50 < 100ms, p95 < 500ms, p99 < 1s under normal load.                                                     |
| NFR-PERF-002 | Map Rendering          | Map tile loading and initial rendering must complete in < 2s on broadband connections.                                                  |
| NFR-PERF-003 | AI Inference (Scoring) | AI Flood Risk Scoring calculation latency must be < 3s per execution.                                                                   |
| NFR-PERF-004 | AI Inference (Vision)  | Image analysis (YOLOv11+BLIP-2) for crowd reporting must complete in < 5s per image.                                                    |
| NFR-PERF-005 | AI Inference (Voice)   | Voice processing (Whisper STT/Intent) turnaround time must be < 2s.                                                                     |
| NFR-PERF-006 | Core Web Vitals        | Web platform must achieve: Largest Contentful Paint (LCP) < 2.5s, First Input Delay (FID) < 100ms, Cumulative Layout Shift (CLS) < 0.1. |
| NFR-PERF-007 | Real-time Messaging    | WebSocket message delivery for live alerts and map updates must be < 200ms.                                                             |

## 2. Scalability

| Req ID       | Attribute            | Description & Measurable Target                                                                                            |
| :----------- | :------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| NFR-SCAL-001 | Concurrent Users     | System must support 100K+ concurrent active users during peak flood events without degradation beyond p99 latency targets. |
| NFR-SCAL-002 | Database Throughput  | Database architecture must handle 10M+ active records and sustain 1000+ writes/sec during peak events.                     |
| NFR-SCAL-003 | Media Processing     | The file upload and AI processing pipeline must handle 10K+ images/hour during active flooding scenarios.                  |
| NFR-SCAL-004 | Horizontal Expansion | System architecture must support multi-city expansion (10+ cities) without requiring core architectural redesign.          |
| NFR-SCAL-005 | Auto-scaling         | Cloud infrastructure must automatically scale compute resources based on traffic load within 2 minutes of spike detection. |

## 3. Availability & Reliability

| Req ID       | Attribute               | Description & Measurable Target                                                                                                                          |
| :----------- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-AVAL-001 | Uptime SLA              | General system uptime must be 99.9%. During designated flood seasons, uptime must be maintained at 99.95%.                                               |
| NFR-AVAL-002 | Disaster Recovery (RTO) | Recovery Time Objective (RTO) must be < 15 minutes following a critical system failure.                                                                  |
| NFR-AVAL-003 | Disaster Recovery (RPO) | Recovery Point Objective (RPO) must be < 5 minutes (maximum acceptable data loss).                                                                       |
| NFR-AVAL-004 | Graceful Degradation    | Core information (maps, static routes) must remain available even if AI processing services fail or degrade.                                             |
| NFR-AVAL-005 | Offline Capabilities    | The mobile citizen application must possess offline-first capabilities, allowing access to cached evacuation routes and offline reporting functionality. |

## 4. Security

| Req ID      | Attribute                | Description & Measurable Target                                                                                              |
| :---------- | :----------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| NFR-SEC-001 | Vulnerability Management | Platform must comply with OWASP Top 10 guidelines; zero critical or high vulnerabilities in production.                      |
| NFR-SEC-002 | Data Encryption          | All data must be encrypted at rest using AES-256 and in transit using TLS 1.3 or higher.                                     |
| NFR-SEC-003 | Data Privacy             | System must implement robust PII protection, data anonymization for analytics, and explicit consent management for citizens. |
| NFR-SEC-004 | Network Security         | Infrastructure must include rate limiting and active DDoS protection (e.g., via WAF or CDN).                                 |
| NFR-SEC-005 | Auditability             | An immutable audit trail must be maintained for all actions performed by Government Officers and Administrators.             |

## 5. Usability

| Req ID      | Attribute            | Description & Measurable Target                                                                                            |
| :---------- | :------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| NFR-USE-001 | Accessibility        | All user interfaces (web and mobile) must comply with WCAG 2.1 AA standards.                                               |
| NFR-USE-002 | Network Resilience   | The citizen application must remain functional and load critical text/alerts on low-bandwidth connections (2G/3G speeds).  |
| NFR-USE-003 | Responsive Design    | The platform must utilize a mobile-first responsive design, ensuring full functionality on screens as small as 320px wide. |
| NFR-USE-004 | Multilingual Support | All citizen-facing interfaces and voice services must fully support English, Telugu, and Hindi at minimum.                 |

## 6. Maintainability

| Req ID      | Attribute         | Description & Measurable Target                                                                                                               |
| :---------- | :---------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-MNT-001 | Test Coverage     | Automated test suite (unit + integration) must maintain > 80% code coverage across backend and frontend repositories.                         |
| NFR-MNT-002 | API Documentation | All backend APIs must be self-documenting (e.g., Swagger/OpenAPI) and updated automatically within the CI/CD pipeline.                        |
| NFR-MNT-003 | Modularity        | The architecture must be modular, allowing independent deployment of core services (e.g., AI inference vs. Core API) without system downtime. |

## 7. Compliance

| Req ID      | Attribute        | Description & Measurable Target                                                                                                  |
| :---------- | :--------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| NFR-CMP-001 | Legal Compliance | The platform must ensure full compliance with the India IT Act regarding data handling and digital services.                     |
| NFR-CMP-002 | Domain Standards | The system's reporting and alert frameworks must align with National Disaster Management Authority (NDMA) guidelines.            |
| NFR-CMP-003 | Data Residency   | All primary databases and backups must reside within Indian geographical borders to meet government data residency requirements. |
