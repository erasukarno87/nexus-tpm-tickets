
-- Add departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add technicians table
CREATE TABLE public.technicians (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  department_id UUID REFERENCES public.departments(id),
  specialty TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add locations table
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  department_id UUID REFERENCES public.departments(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add machines table
CREATE TABLE public.machines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  machine_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  location_id UUID REFERENCES public.locations(id),
  department_id UUID REFERENCES public.departments(id),
  model TEXT,
  manufacturer TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Modify tickets table to add rejection fields and remove completed status
ALTER TABLE public.tickets 
DROP CONSTRAINT IF EXISTS tickets_status_check;

ALTER TABLE public.tickets 
ADD COLUMN rejection_reason TEXT,
ADD CONSTRAINT tickets_status_check CHECK (status IN ('open', 'in_progress', 'pending_parts', 'closed', 'ditolak'));

-- Update existing completed tickets to closed
UPDATE public.tickets SET status = 'closed' WHERE status = 'completed';

-- Enable RLS for new tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for master data tables
CREATE POLICY "Allow all operations on departments" 
  ON public.departments FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on technicians" 
  ON public.technicians FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on locations" 
  ON public.locations FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on machines" 
  ON public.machines FOR ALL USING (true) WITH CHECK (true);

-- Insert default master data
INSERT INTO public.departments (name, description) VALUES 
('Produksi', 'Departemen Produksi'),
('Maintenance', 'Departemen Pemeliharaan'),
('Quality Control', 'Departemen Kontrol Kualitas'),
('Engineering', 'Departemen Teknik'),
('Operations', 'Departemen Operasional');

INSERT INTO public.technicians (name, email, department_id, specialty) VALUES 
('Ahmad Teknisi', 'ahmad@company.com', (SELECT id FROM departments WHERE name = 'Maintenance'), 'Mekanik'),
('Budi Elektrik', 'budi@company.com', (SELECT id FROM departments WHERE name = 'Maintenance'), 'Elektrik'),
('Citra Instrumen', 'citra@company.com', (SELECT id FROM departments WHERE name = 'Engineering'), 'Instrumentasi');

INSERT INTO public.locations (name, description, department_id) VALUES 
('Lantai Produksi 1', 'Area produksi lantai 1', (SELECT id FROM departments WHERE name = 'Produksi')),
('Lantai Produksi 2', 'Area produksi lantai 2', (SELECT id FROM departments WHERE name = 'Produksi')),
('Workshop Maintenance', 'Area workshop maintenance', (SELECT id FROM departments WHERE name = 'Maintenance')),
('QC Lab', 'Laboratorium Quality Control', (SELECT id FROM departments WHERE name = 'Quality Control'));

INSERT INTO public.machines (machine_code, name, location_id, department_id, model, manufacturer) VALUES 
('MC-001', 'Mesin Cutting A1', (SELECT id FROM locations WHERE name = 'Lantai Produksi 1'), (SELECT id FROM departments WHERE name = 'Produksi'), 'CUT-2023', 'MachineCorpA'),
('MC-002', 'Mesin Press B2', (SELECT id FROM locations WHERE name = 'Lantai Produksi 2'), (SELECT id FROM departments WHERE name = 'Produksi'), 'PRESS-2022', 'MachineCorpB'),
('MC-003', 'Conveyor C1', (SELECT id FROM locations WHERE name = 'Lantai Produksi 1'), (SELECT id FROM departments WHERE name = 'Produksi'), 'CONV-2021', 'ConveyorCorp');
