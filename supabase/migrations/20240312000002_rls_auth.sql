-- RLS and Auth
-- Enable RLS on all tenant-scoped tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_speakers ENABLE ROW LEVEL SECURITY;

-- Helpers (public schema for RLS)
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS app_role AS $$
  SELECT role FROM public.users WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Organizations: super_admin can manage; others can read own org
CREATE POLICY org_select ON organizations FOR SELECT
  USING (
    id = public.get_user_org_id() OR public.get_user_role() = 'super_admin'
  );
CREATE POLICY org_all_super ON organizations FOR ALL
  USING (public.get_user_role() = 'super_admin');

-- Users: same org can read; own row can update; super_admin all
CREATE POLICY users_select ON users FOR SELECT
  USING (organization_id = public.get_user_org_id() OR auth.uid() = id);
CREATE POLICY users_update_own ON users FOR UPDATE
  USING (id = auth.uid());
CREATE POLICY users_all_super ON users FOR ALL
  USING (public.get_user_role() = 'super_admin');

-- Events: org members can read; organizers + super can write
CREATE POLICY events_select ON events FOR SELECT
  USING (organization_id = public.get_user_org_id());
CREATE POLICY events_insert ON events FOR INSERT
  WITH CHECK (
    organization_id = public.get_user_org_id() AND
    (public.get_user_role() IN ('organizer', 'super_admin'))
  );
CREATE POLICY events_update ON events FOR UPDATE
  USING (
    organization_id = public.get_user_org_id() AND
    (public.get_user_role() IN ('organizer', 'super_admin'))
  );
CREATE POLICY events_delete ON events FOR DELETE
  USING (
    organization_id = public.get_user_org_id() AND
    (public.get_user_role() IN ('organizer', 'super_admin'))
  );

-- Rooms, sessions, speakers, exhibitors, partners, sponsors: same pattern as events
CREATE POLICY rooms_select ON rooms FOR SELECT USING (organization_id = public.get_user_org_id());
CREATE POLICY rooms_insert ON rooms FOR INSERT WITH CHECK (organization_id = public.get_user_org_id() AND public.get_user_role() IN ('organizer', 'super_admin'));
CREATE POLICY rooms_update ON rooms FOR UPDATE USING (organization_id = public.get_user_org_id() AND public.get_user_role() IN ('organizer', 'super_admin'));
CREATE POLICY rooms_delete ON rooms FOR DELETE USING (organization_id = public.get_user_org_id() AND public.get_user_role() IN ('organizer', 'super_admin'));

CREATE POLICY sessions_select ON sessions FOR SELECT USING (organization_id = public.get_user_org_id());
CREATE POLICY sessions_insert ON sessions FOR INSERT WITH CHECK (organization_id = public.get_user_org_id() AND public.get_user_role() IN ('organizer', 'super_admin'));
CREATE POLICY sessions_update ON sessions FOR UPDATE USING (organization_id = public.get_user_org_id() AND public.get_user_role() IN ('organizer', 'super_admin'));
CREATE POLICY sessions_delete ON sessions FOR DELETE USING (organization_id = public.get_user_org_id() AND public.get_user_role() IN ('organizer', 'super_admin'));

CREATE POLICY speakers_select ON speakers FOR SELECT USING (organization_id = public.get_user_org_id());
CREATE POLICY speakers_all ON speakers FOR ALL USING (organization_id = public.get_user_org_id() AND public.get_user_role() IN ('organizer', 'super_admin'));

CREATE POLICY exhibitors_select ON exhibitors FOR SELECT USING (organization_id = public.get_user_org_id());
CREATE POLICY exhibitors_all ON exhibitors FOR ALL USING (organization_id = public.get_user_org_id() AND public.get_user_role() IN ('organizer', 'super_admin'));

CREATE POLICY partners_select ON partners FOR SELECT USING (organization_id = public.get_user_org_id());
CREATE POLICY partners_all ON partners FOR ALL USING (organization_id = public.get_user_org_id() AND public.get_user_role() IN ('organizer', 'super_admin'));

CREATE POLICY sponsors_select ON sponsors FOR SELECT USING (organization_id = public.get_user_org_id());
CREATE POLICY sponsors_all ON sponsors FOR ALL USING (organization_id = public.get_user_org_id() AND public.get_user_role() IN ('organizer', 'super_admin'));

-- Session_speakers
CREATE POLICY session_speakers_select ON session_speakers FOR SELECT USING (true);
CREATE POLICY session_speakers_all ON session_speakers FOR ALL USING (public.get_user_role() IN ('organizer', 'super_admin'));

-- Tickets: org read; participants get own; organizer/scanner can insert (registration/check-in flow)
CREATE POLICY tickets_select ON tickets FOR SELECT
  USING (
    organization_id = public.get_user_org_id() AND
    (user_id = auth.uid() OR public.get_user_role() IN ('organizer', 'scanner', 'super_admin'))
  );
CREATE POLICY tickets_insert ON tickets FOR INSERT
  WITH CHECK (organization_id = public.get_user_org_id());
CREATE POLICY tickets_delete ON tickets FOR DELETE
  USING (organization_id = public.get_user_org_id() AND public.get_user_role() IN ('organizer', 'super_admin'));

-- Check-ins: org read; scanner/organizer/super can insert
CREATE POLICY checkins_select ON checkins FOR SELECT
  USING (organization_id = public.get_user_org_id());
CREATE POLICY checkins_insert ON checkins FOR INSERT
  WITH CHECK (
    organization_id = public.get_user_org_id() AND
    public.get_user_role() IN ('scanner', 'organizer', 'super_admin')
  );
CREATE POLICY checkins_update ON checkins FOR UPDATE
  USING (organization_id = public.get_user_org_id() AND public.get_user_role() IN ('scanner', 'organizer', 'super_admin'));

-- Connections: same org; users manage their own connections
CREATE POLICY connections_select ON connections FOR SELECT
  USING (organization_id = public.get_user_org_id() AND (from_user_id = auth.uid() OR to_user_id = auth.uid()));
CREATE POLICY connections_insert ON connections FOR INSERT
  WITH CHECK (organization_id = public.get_user_org_id() AND from_user_id = auth.uid());
CREATE POLICY connections_update ON connections FOR UPDATE
  USING (to_user_id = auth.uid() OR from_user_id = auth.uid());

-- Notifications: own only
CREATE POLICY notifications_select ON notifications FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY notifications_insert ON notifications FOR INSERT
  WITH CHECK (organization_id = public.get_user_org_id());
CREATE POLICY notifications_update ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Auth hook: create users row on signup (requires organization_id in raw_user_meta_data or default org)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  org_id UUID;
BEGIN
  org_id := (NEW.raw_user_meta_data->>'organization_id')::UUID;
  IF org_id IS NULL THEN
    SELECT id INTO org_id FROM organizations LIMIT 1;
  END IF;
  INSERT INTO public.users (id, organization_id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(org_id, (SELECT id FROM organizations LIMIT 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'participant')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users (run in Supabase Dashboard if not using Supabase Auth hooks)
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
