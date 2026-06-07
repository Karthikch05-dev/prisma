# Smart Heart Rate Monitoring System - TODO

## Setup & Scaffold
- [ ] Create `smart-heart-monitor/` project directory structure
- [ ] Initialize backend (Node.js + Express) with Prisma (PostgreSQL)
- [ ] Initialize frontend (React + Vite)
- [ ] Add shared types (optional) / align API base URLs

## Backend Implementation
- [ ] Implement Prisma schema: Users, Patients, HeartRateReadings, Alerts, Notifications (+ optional caregiver-patient mapping)
- [ ] Configure PostgreSQL connection via `.env`
- [ ] Generate & run Prisma migrations
- [ ] Implement JWT authentication + role-based access control middleware
- [ ] Implement REST APIs for:
  - [ ] Patient CRUD + threshold limits
  - [ ] Readings ingestion endpoints (simulated + IoT-ready)
  - [ ] Alerts CRUD/workflow (ack/resolved)
  - [ ] Notifications listing/logging
  - [ ] Analytics endpoints (trend, daily/weekly/monthly)
  - [ ] Export endpoints (CSV, PDF)
- [ ] Implement WebSocket realtime server + subscriptions
- [ ] Implement heart-rate ingestion + abnormal detection + alert/notification emit

## Frontend Implementation
- [ ] Implement auth UI (role-based login/register)
- [ ] Implement sidebar layout + routing
- [ ] Implement caregiver dashboard:
  - [ ] live BPM cards (realtime)
  - [ ] active alerts panel
  - [ ] patient search/filter/pagination
- [ ] Implement alerts dashboard:
  - [ ] filter by severity/status
  - [ ] acknowledge/resolve
- [ ] Implement analytics page with charts (trend + summaries)
- [ ] Implement notifications center UI
- [ ] Implement settings (dark mode + notification enable/disable + thresholds)

## Bonus Features
- [ ] Implement risk prediction endpoint (rule-based MVP)
- [ ] Add SMS/email provider stubs (optional env configs)

## Testing & Demo
- [ ] Seed sample data (users + patients)
- [ ] Run simulation to generate readings every second
- [ ] Validate alerts trigger for BPM>120 and BPM<60
- [ ] Validate alerts acknowledgement/resolution updates UI realtime
- [ ] Validate analytics charts from stored readings
- [ ] Validate CSV/PDF export downloads

