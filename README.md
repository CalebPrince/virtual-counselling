# Haven — virtual counselling platform (pitch demo)

**Live demo:** https://haven-counselling-two.vercel.app/

A working demo of a telehealth-style counselling platform: clients can browse and book
licensed counsellors, request an on-demand match ("Talk Now"), and join a live video
session room. Counsellors manage their availability and see their session queue from a
dashboard. This is the web demo referenced in the *Mobile Counselling App* proposal — it
proves out the booking/matching flow that the proposed iOS + Android app is built on top of.
Built as a pitch/demo product, not a production HIPAA-compliant system.

- **Frontend:** React 19 + TypeScript + Vite, plain CSS (no UI framework), `react-router-dom`
- **Backend:** FastAPI + SQLAlchemy + SQLite
- **Mobile:** React Native + Expo Router, ported section-for-section from the web landing page

For local setup and deployment instructions, see [`frontend/README.md`](frontend/README.md),
[`backend/README.md`](backend/README.md) and [`mobile/README.md`](mobile/README.md). This
document covers what's actually built.

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

### Mobile app landing page ([`mobile/app/(public)/landing.tsx`](mobile/app/(public)/landing.tsx))
Same design, copy and images as the web landing page above, rebuilt with native
components (hero, trust bar, how-it-works, virtual-vs-in-person comparison, match
orbit, benefit cards, counsellor showcase, safety section, testimonial, FAQ, final
CTA), plus a matching header with a slide-in nav drawer. See "Run the mobile app"
below to preview it.

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

## Run the mobile app

```bash
cd mobile
npm install
npm run web
```

Opens at **http://localhost:8081** (falls back to the next free port if that one's
taken) — no simulator or physical device needed, runs the same Expo Router app in
a browser tab via `react-native-web`. It lands on the public splash screen; the
landing page itself is at **http://localhost:8081/landing**. For a native-device
preview instead, see [`mobile/README.md`](mobile/README.md) (`npm start`, then
scan the QR code with Expo Go or press `i`/`a` for a simulator/emulator).

## Not yet built (in this demo)

- No real authentication (no passwords, no sessions/tokens)
- No real video/audio transport — the session room is a UI shell with local camera preview only
- Chat panel in the session room is not wired to any backend
- "Record session" is a UI-only toggle, nothing is actually recorded or stored
- No payments/billing

## How this maps to the mobile app proposal

This repo is the web proof-of-concept behind the *Mobile Counselling App* proposal. Status of
each proposed feature against what exists here today:

| Proposal feature | Status in this demo |
| --- | --- |
| Talk Now (instant support) | ✅ Built — matching flow + pre-match check-in |
| Scheduled bookings | ✅ Built |
| Counsellor availability & queue management | ✅ Built |
| Landing page | ✅ Built |
| Admin dashboard | ⚠️ Partial — counsellor dashboard exists; no separate admin/login area |
| 24/7 toll-free line (Twilio) | ❌ Not built — phone routing not implemented |
| In-person appointments | ❌ Not built — only call-type sessions exist |
| QR code access | ⚠️ Partial — decorative sample QR code on the landing page; not wired to a real app-store link |
| Native iOS/Android app | ⚠️ Partial — `mobile/` is a React Native/Expo app with the landing page and all 26 Figma screens built, running on offline demo data (see `mobile/README.md`); not published to either app store |
| Real video/audio (Daily.co or equivalent) | ❌ Not built — session room is a UI shell |
| Encryption, RBAC, secure password storage | ❌ Not built — no auth layer at all yet |

In short: the booking/matching *logic and UX* referenced in the proposal is proven out here;
the native app shell, telephony, real video transport, admin area, and security layer described
in the proposal are the scope of the next build.
