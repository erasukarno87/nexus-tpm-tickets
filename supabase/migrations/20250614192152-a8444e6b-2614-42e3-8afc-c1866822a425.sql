
-- Delete line_areas first to avoid foreign key constraint violation
DELETE FROM public.line_areas;

-- Then delete departments
DELETE FROM public.departments;

-- Insert departments based on the relationship mapping you provided
INSERT INTO public.departments (name, is_active) VALUES 
('ACCOUNTING/FINANCE', true),
('ENGINEERING', true),
('FACTORY INNOVATION & TPM', true),
('HRD&GA', true),
('IT', true),
('MAINTENANCE', true),
('MARKETING', true),
('PPIC & WAREHOUSE', true);

-- Insert line_areas with proper department relationships
INSERT INTO public.line_areas (name, department_id, is_active) VALUES 
-- ACCOUNTING/FINANCE
('Accounting', (SELECT id FROM departments WHERE name = 'ACCOUNTING/FINANCE'), true),
('Finance', (SELECT id FROM departments WHERE name = 'ACCOUNTING/FINANCE'), true),

-- ENGINEERING
('Engineering', (SELECT id FROM departments WHERE name = 'ENGINEERING'), true),

-- FACTORY INNOVATION & TPM
('Factory Innovation', (SELECT id FROM departments WHERE name = 'FACTORY INNOVATION & TPM'), true),
('TPM', (SELECT id FROM departments WHERE name = 'FACTORY INNOVATION & TPM'), true),

-- HRD&GA
('Driver', (SELECT id FROM departments WHERE name = 'HRD&GA'), true),
('GA', (SELECT id FROM departments WHERE name = 'HRD&GA'), true),
('HRD', (SELECT id FROM departments WHERE name = 'HRD&GA'), true),

-- IT
('IT', (SELECT id FROM departments WHERE name = 'IT'), true),

-- MAINTENANCE
('Maintenance Produksi', (SELECT id FROM departments WHERE name = 'MAINTENANCE'), true),
('Maintenance SMT', (SELECT id FROM departments WHERE name = 'MAINTENANCE'), true),

-- MARKETING
('Marketing', (SELECT id FROM departments WHERE name = 'MARKETING'), true),

-- PPIC & WAREHOUSE
('Delivery', (SELECT id FROM departments WHERE name = 'PPIC & WAREHOUSE'), true),
('Office PPIC', (SELECT id FROM departments WHERE name = 'PPIC & WAREHOUSE'), true),
('Office Incoming', (SELECT id FROM departments WHERE name = 'PPIC & WAREHOUSE'), true),
('Warehouse Incoming', (SELECT id FROM departments WHERE name = 'PPIC & WAREHOUSE'), true);
