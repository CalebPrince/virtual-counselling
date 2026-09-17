# Haven — virtual counselling platform (pitch demo)

A working demo of a telehealth-style counselling platform: clients can browse and book
licensed counsellors, request an on-demand match ("Talk Now"), and join a live video
session room. Counsellors manage their availability and see their session queue from a
dashboard. Built as a pitch/demo product, not a production HIPAA-compliant system.

- **Frontend:** React 19 + TypeScript + Vite, plain CSS (no UI framework), `react-router-dom`
- **Backend:** FastAPI + SQLAlchemy + SQLite

For local setup and deployment instructions, see [`frontend/README.md`](frontend/README.md) and
[`backend/README.md`](backend/README.md). This document covers what's actually built.

## What's built

### Marketing landing page ([`Landing.tsx`](frontend/src/pages/Landing.tsx))
Public-facing page at `/` with:
- Hero section with primary CTA
- "How Haven works" — 3-step explainer
- Haven vs. the usual route (comparison section)
- "Meet the team" — live counsellor roster pulled from the API, grouped by specialty
- Testimonial/quote section ("From the preview")
- FAQ section
- Role-selection panel ("Who's joining?") at the bottom — lets a visitor continue as a
  client or a counsellor, which sets their identity and routes them into the app

### Identity ([`IdentityContext.tsx`](frontend/src/context/IdentityContext.tsx))
Lightweight client-side "auth" — no passwords. Picking a seeded client or counsellor on the
landing page stores that user (id, role, etc.) in `localStorage` and drives route access via
`RequireRole` in [`App.tsx`](frontend/src/App.tsx). Good enough for a pitch demo, not real auth.

### Client home ([`ClientHome.tsx`](frontend/src/pages/ClientHome.tsx)) — `/client`
- **Talk Now**: on-demand instant matching. Opens a pre-match [intake quiz](frontend/src/components/IntakeQuiz.tsx)
  (topic + how-you're-feeling, both skippable), then requests an instant session and polls
  until a counsellor is matched, showing a "Finding you a counsellor…" overlay in the meantime.
- **Browse counsellors**: grid of counsellor cards, filterable by specialty, each showing
  live availability status.
- **Book a session**: [`BookingModal.tsx`](frontend/src/components/BookingModal.tsx) lets a
  client schedule a session with a specific counsellor for a future time.
- **Your sessions**: list of the client's scheduled/instant sessions with status.

### Counsellor dashboard ([`CounsellorDashboard.tsx`](frontend/src/pages/CounsellorDashboard.tsx)) — `/counsellor`
- Availability toggle: **Available / In session / Offline**, persisted via the API — this is
  what makes a counsellor eligible for Talk Now matching.
- Session queue: live list of the counsellor's sessions, auto-refreshing every 5s, with a
  nudge showing how many clients are waiting for a match when the counsellor is available.

### Session room ([`SessionRoom.tsx`](frontend/src/pages/SessionRoom.tsx)) — `/session/:id`
A video-call UI shell (not a real peer-to-peer connection — no WebRTC signaling yet):
- Local camera preview via `getUserMedia` (falls back to a photo/avatar tile if denied)
- Mute / camera-toggle / end-call controls
- Elapsed-time timer, live indicator
- Participants panel and a chat panel (chat is UI-only — not wired to a backend yet)
- "Record this session" flow with a consent-style confirmation prompt (local state only,
  no actual recording is captured)

### Backend API ([`backend/app/main.py`](backend/app/main.py))
FastAPI service backing all of the above:
- `POST/GET /api/users`, `GET /api/clients`, `GET /api/counsellors` (filterable by
  `available` / `specialty`)
- `PATCH /api/counsellors/{id}/status` — availability toggle
- `POST /api/sessions/scheduled` — book a future session
- `POST /api/sessions/instant` — Talk Now request; matches an available counsellor
  (optionally filtered by specialty) or leaves the session `pending`
- `GET /api/sessions/{id}`, `GET /api/clients/{id}/sessions`, `GET /api/counsellors/{id}/sessions`
- Auto-seeds 5 counsellors (across the 5 specialties) and 2 clients on first run
  ([`seed.py`](backend/app/seed.py)) against a local SQLite DB

## Not yet built

- No real authentication (no passwords, no sessions/tokens)
- No real video/audio transport — the session room is a UI shell with local camera preview only
- Chat panel in the session room is not wired to any backend
- "Record session" is a UI-only toggle, nothing is actually recorded or stored
- No payments/billing
