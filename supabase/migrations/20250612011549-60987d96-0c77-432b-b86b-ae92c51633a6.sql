
-- Create enum types for tickets
CREATE TYPE ticket_category AS ENUM ('corrective_action', 'repair', 'procurement', 'support');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'pending_parts', 'completed', 'closed');

-- Create tickets table
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number VARCHAR UNIQUE NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  category ticket_category NOT NULL,
  priority ticket_priority NOT NULL DEFAULT 'medium',
  status ticket_status NOT NULL DEFAULT 'open',
  machine_id VARCHAR,
  location VARCHAR NOT NULL,
  requester_name VARCHAR NOT NULL,
  requester_department VARCHAR NOT NULL,
  requester_contact VARCHAR NOT NULL,
  assigned_to VARCHAR,
  before_photos JSONB DEFAULT '[]'::jsonb,
  after_photos JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create ticket_logs table for audit trail
CREATE TABLE public.ticket_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  action VARCHAR NOT NULL,
  description TEXT NOT NULL,
  created_by VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  today_date TEXT;
  sequence_num INTEGER;
  ticket_num TEXT;
BEGIN
  -- Get today's date in YYYYMMDD format
  today_date := to_char(CURRENT_DATE, 'YYYYMMDD');
  
  -- Get the next sequence number for today
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 'TPM-\d{8}-(\d{4})') AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.tickets
  WHERE ticket_number LIKE 'TPM-' || today_date || '-%';
  
  -- Format the ticket number
  ticket_num := 'TPM-' || today_date || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN ticket_num;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate ticket numbers
CREATE OR REPLACE FUNCTION set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_ticket_number
  BEFORE INSERT ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION set_ticket_number();

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for public access (no authentication required for now)
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_logs ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access for the ticketing system
CREATE POLICY "Allow public read access to tickets" ON public.tickets
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to tickets" ON public.tickets
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to tickets" ON public.tickets
  FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to ticket_logs" ON public.ticket_logs
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to ticket_logs" ON public.ticket_logs
  FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_priority ON public.tickets(priority);
CREATE INDEX idx_tickets_category ON public.tickets(category);
CREATE INDEX idx_tickets_created_at ON public.tickets(created_at);
CREATE INDEX idx_tickets_ticket_number ON public.tickets(ticket_number);
CREATE INDEX idx_ticket_logs_ticket_id ON public.ticket_logs(ticket_id);
CREATE INDEX idx_ticket_logs_created_at ON public.ticket_logs(created_at);
