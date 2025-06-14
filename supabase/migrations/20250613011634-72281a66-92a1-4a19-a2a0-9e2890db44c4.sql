
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
  line_area TEXT,
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
  line_area TEXT,
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

-- Insert your actual department data
INSERT INTO public.departments (name, description) VALUES 
('DEPARTEMEN', 'Departemen Umum'),
('ACCOUNTING/FINANCE', 'Departemen Akuntansi dan Keuangan'),
('ENGINEERING', 'Departemen Teknik'),
('FACTORY INNOVATION & TPM', 'Departemen Inovasi Pabrik dan TPM'),
('HRD&GA', 'Departemen SDM dan General Affairs'),
('IT', 'Departemen Teknologi Informasi'),
('MAINTENANCE', 'Departemen Pemeliharaan'),
('MARKETING', 'Departemen Pemasaran'),
('PPIC & WAREHOUSE', 'Departemen PPIC dan Gudang'),
('PRODUKSI SECTION 2', 'Departemen Produksi Seksi 2'),
('PRODUKSI SECTION 1', 'Departemen Produksi Seksi 1'),
('PRODUKSI SMT', 'Departemen Produksi SMT'),
('PURCHASE', 'Departemen Pembelian'),
('QMR', 'Departemen QMR'),
('QUALITY', 'Departemen Kontrol Kualitas'),
('R&D', 'Departemen Riset dan Pengembangan'),
('SYSTEM', 'Departemen Sistem');

-- Insert sample technicians with relevant departments
INSERT INTO public.technicians (name, email, department_id, specialty) VALUES 
('Ahmad Teknisi', 'ahmad@company.com', (SELECT id FROM departments WHERE name = 'MAINTENANCE'), 'Mekanik'),
('Budi Elektrik', 'budi@company.com', (SELECT id FROM departments WHERE name = 'MAINTENANCE'), 'Elektrik'),
('Citra Instrumen', 'citra@company.com', (SELECT id FROM departments WHERE name = 'ENGINEERING'), 'Instrumentasi'),
('Doni IT Support', 'doni@company.com', (SELECT id FROM departments WHERE name = 'IT'), 'IT Support'),
('Eka Quality', 'eka@company.com', (SELECT id FROM departments WHERE name = 'QUALITY'), 'Quality Control');

-- Insert sample locations with relevant departments and line/area
INSERT INTO public.locations (name, description, department_id, line_area) VALUES 
('Lantai Produksi 1', 'Area produksi lantai 1', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 1'), 'Line A'),
('Lantai Produksi 2', 'Area produksi lantai 2', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), 'Line B'),
('SMT Production Area', 'Area produksi SMT', (SELECT id FROM departments WHERE name = 'PRODUKSI SMT'), 'SMT Line 1'),
('Workshop Maintenance', 'Area workshop maintenance', (SELECT id FROM departments WHERE name = 'MAINTENANCE'), 'Workshop Area'),
('QC Lab', 'Laboratorium Quality Control', (SELECT id FROM departments WHERE name = 'QUALITY'), 'Lab Area'),
('Warehouse', 'Area gudang', (SELECT id FROM departments WHERE name = 'PPIC & WAREHOUSE'), 'Warehouse Zone A'),
('Engineering Office', 'Kantor engineering', (SELECT id FROM departments WHERE name = 'ENGINEERING'), 'Office Area');

-- Insert sample machines with relevant data
INSERT INTO public.machines (machine_code, name, location_id, department_id, line_area, model, manufacturer) VALUES 
('MC-001', 'Mesin Cutting A1', (SELECT id FROM locations WHERE name = 'Lantai Produksi 1'), (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 1'), 'Line A', 'CUT-2023', 'MachineCorpA'),
('MC-002', 'Mesin Press B2', (SELECT id FROM locations WHERE name = 'Lantai Produksi 2'), (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), 'Line B', 'PRESS-2022', 'MachineCorpB'),
('MC-003', 'SMT Pick & Place', (SELECT id FROM locations WHERE name = 'SMT Production Area'), (SELECT id FROM departments WHERE name = 'PRODUKSI SMT'), 'SMT Line 1', 'SMT-PP-2023', 'SMTCorp'),
('MC-004', 'Conveyor C1', (SELECT id FROM locations WHERE name = 'Lantai Produksi 1'), (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 1'), 'Line A', 'CONV-2021', 'ConveyorCorp'),
('MC-005', 'Quality Testing Machine', (SELECT id FROM locations WHERE name = 'QC Lab'), (SELECT id FROM departments WHERE name = 'QUALITY'), 'Lab Area', 'QT-2022', 'QualityCorp');
