# NextEvent – Multi-Tenant Event Management Platform

Hackathon MVP for event management with multi-tenant isolation, QR ticketing, and offline check-in.

## Architecture

```
NextEvent/
├── mobile/                 # React Native (Expo) – participant & scanner app
├── backoffice/            # Next.js + Tailwind – admin dashboard
├── supabase/              # PostgreSQL schema, Auth, RLS, Realtime
│   └── migrations/
└── README.md
```

- **Mobile-first**: Primary experience is the Expo app (participants + staff scanner).
- **Multi-tenant**: All data scoped by `organization_id`; RLS enforces isolation.
- **Decoupled**: Mobile and backoffice talk to Supabase (REST + Realtime); no shared code.
- **MVP-ready**: Minimal complexity for a working demo.

## Stack

| Layer        | Tech                    |
|-------------|-------------------------|
| Mobile App  | React Native, Expo      |
| Admin       | Next.js 14, TailwindCSS |
| Backend     | Supabase (PostgreSQL, Auth, Realtime) |
| QR          | react-native-qrcode-svg, expo-camera (scan) |

## User Roles

1. **Participant** – Browse events, agenda, ticket (QR), profile, networking.
2. **Organizer** – Create/edit events and sessions (via backoffice).
3. **Scanner** – Scan QR codes, check-in attendees (offline-capable).
4. **Speaker** – Linked to sessions; visible in agenda.
5. **Exhibitor** – Exhibitor profile per organization/event.
6. **Super Admin** – Full access; manage organizations (backoffice).

## Quick Start

### Prerequisites

- Node 18+
- Expo CLI (`npm i -g expo-cli`)
- Supabase project (or local Supabase CLI)

### 1. Supabase

```bash
cd supabase
# Apply migrations via Supabase Dashboard SQL editor or: supabase db push
```

Set env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and service key for backoffice if needed).

### 2. Mobile App

```bash
cd mobile
npm install
npx expo start


### 3. Backoffice

```bash
cd backoffice
npm install
npm run dev
```

## Design System

- **Primary**: `#059467` (Emerald)
- **Secondary**: Blue `#2563EB`, Purple `#7C3AED`, Amber `#D97706`, Red `#DC2626`
- **Light**: BG `#F4F5F8`, Surface `#FFFFFF`
- **Dark**: BG `#050709`, Surface `#08090E`
- **Font**: Instrument Sans

## Features (MVP)

- Event & session management (backoffice)
- Agenda & speakers (mobile)
- Tickets with unique QR codes (mobile)
- Check-in by QR scan (mobile, with offline queue + sync)
- Speakers, exhibitors, sponsors, partners (CRUD in backoffice, display in app)
- Networking (participants list, connection requests)
- User profile (name, bio, interests, company, role)
- In-app notifications (event updates, session reminders)
- Real-time dashboard (participants, check-ins, sessions, activity)

## License

MIT – Hackathon MVP.
