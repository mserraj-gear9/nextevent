-- Generate unique ticket_code on insert if not provided
CREATE OR REPLACE FUNCTION set_ticket_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_code IS NULL OR NEW.ticket_code = '' THEN
    NEW.ticket_code := 'T-' || upper(substr(md5(gen_random_uuid()::text), 1, 12));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tickets_set_code
  BEFORE INSERT ON tickets
  FOR EACH ROW EXECUTE PROCEDURE set_ticket_code();
