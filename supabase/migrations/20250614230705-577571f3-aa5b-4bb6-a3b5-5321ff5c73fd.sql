
-- Fix the ticket number generation function to handle concurrent submissions
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  today_date TEXT;
  sequence_num INTEGER;
  ticket_num TEXT;
  max_attempts INTEGER := 10;
  attempt INTEGER := 0;
BEGIN
  -- Get today's date in YYYYMMDD format
  today_date := to_char(CURRENT_DATE, 'YYYYMMDD');
  
  LOOP
    -- Get the next sequence number for today with a lock to prevent race conditions
    SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 'TPM-\d{8}-(\d{4})') AS INTEGER)), 0) + 1 + attempt
    INTO sequence_num
    FROM public.tickets
    WHERE ticket_number LIKE 'TPM-' || today_date || '-%'
    FOR UPDATE;
    
    -- Format the ticket number
    ticket_num := 'TPM-' || today_date || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    -- Check if this ticket number already exists
    IF NOT EXISTS (SELECT 1 FROM public.tickets WHERE ticket_number = ticket_num) THEN
      RETURN ticket_num;
    END IF;
    
    -- Increment attempt counter
    attempt := attempt + 1;
    
    -- Safety check to prevent infinite loop
    IF attempt >= max_attempts THEN
      -- Use random suffix as fallback
      ticket_num := 'TPM-' || today_date || '-' || LPAD((EXTRACT(epoch FROM now())::INTEGER % 10000)::TEXT, 4, '0');
      RETURN ticket_num;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
