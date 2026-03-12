# Backend Logic Structure (Supabase)

## Overview

- **Database**: PostgreSQL via Supabase.
- **Auth**: Supabase Auth; `public.users` row created via trigger or Edge Function on signup.
- **API**: Direct Supabase client from mobile and backoffice (no separate API server).
- **Realtime**: Optional subscriptions on `checkins`, `notifications` for live dashboard.

## Multi-Tenant Isolation

- Every tenant-scoped table has `organization_id`.
- RLS policies use `auth.user_org_id()` and `auth.user_role()` so users only see data for their organization.
- Ensure `users.organization_id` is set on signup (meta or default org from seed).

## Auth → User Row

After a user signs up in Supabase Auth, create a `public.users` row:

1. **Option A – DB Trigger** (run in SQL editor if your project allows triggers on `auth.users`):
   ```sql
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
   ```
2. **Option B – Supabase Auth Hook**: Call a small Edge Function or external service that inserts into `public.users` with `organization_id` (e.g. from invite or default org).

## Ticket Creation

- Tickets are created when a participant “registers” for an event (e.g. from backoffice or mobile).
- Insert into `tickets`: `organization_id`, `event_id`, `user_id`, and optionally `ticket_code` (auto-set by trigger if omitted).
- QR code in the app displays `ticket_code`; scanner sends this code to validate and create a row in `checkins`.

## Check-in Flow

1. Scanner scans QR → reads `ticket_code`.
2. Look up `tickets` by `ticket_code`; get `ticket_id`, `event_id`.
3. Insert into `checkins` with `ticket_id`, `event_id`, `scanned_by` (current user), `organization_id`.
4. If network fails: store scan in local queue (e.g. AsyncStorage); when back online, resolve `ticket_code` and insert `checkins` (see mobile `offlineCheckIn.sync()`).

## Notifications

- Insert into `notifications` with `user_id`, `title`, `body`, `type`, optional `data`.
- Mobile can subscribe to `notifications` filtered by `user_id = auth.uid()` for real-time updates.

## Realtime Dashboard

- Backoffice can subscribe to:
  - `checkins` (e.g. for current event) for live count.
  - `tickets` for registration count.
- Use Supabase Realtime `channel().on('postgres_changes', ...)`.

## Roles Summary

| Role         | Can do |
|-------------|--------|
| participant | Own profile, tickets, agenda, networking, view events/sessions/speakers |
| organizer   | Same + create/edit events, sessions, speakers, exhibitors, view all org data |
| scanner     | Scan QR, create check-ins, view events/tickets for check-in |
| speaker     | Same as participant + linked to sessions |
| exhibitor   | Same as participant + exhibitor profile |
| super_admin | All + manage organizations |
