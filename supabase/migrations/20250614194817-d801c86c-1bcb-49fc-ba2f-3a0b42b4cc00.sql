
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
('PPIC & WAREHOUSE', true),
('PRODUKSI SECTION 1', true),
('PRODUKSI SECTION 2', true),
('PRODUKSI SMT', true),
('PURCHASE', true),
('QMR', true),
('QUALITY', true),
('R&D', true),
('SYSTEM', true);

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
('Warehouse Incoming', (SELECT id FROM departments WHERE name = 'PPIC & WAREHOUSE'), true),
('Preparation', (SELECT id FROM departments WHERE name = 'PPIC & WAREHOUSE'), true),
('Warehouse Finish Good', (SELECT id FROM departments WHERE name = 'PPIC & WAREHOUSE'), true),

-- PRODUKSI SECTION 1
('Antifog Spray A', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 1'), true),
('CCU 1', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 1'), true),
('CCU 2', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 1'), true),
('CCU 3', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 1'), true),
('Coating CCU', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 1'), true),
('R2-01', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 1'), true),
('R2-L2', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 1'), true),
('PQC Section 1', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 1'), true),
('Office Produksi 1', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 1'), true),
('USB 1', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 1'), true),
('USB 2', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 1'), true),

-- PRODUKSI SECTION 2
('AJI', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),
('Antifog Mekanikal', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),
('Antifog Spray B', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),
('DPP', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),
('FGM', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),
('Flashrelay', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),
('K2F 1', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),
('K2F 2', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),
('PQC Section 2', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),
('Office Produksi 2', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),
('R2-01', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),
('R2-02', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),
('R2-03', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),
('SPM', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),
('Rework Mekanikal', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),
('Selenoid A', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),
('Selenoid B', (SELECT id FROM departments WHERE name = 'PRODUKSI SECTION 2'), true),

-- PRODUKSI SMT
('Sub SMT', (SELECT id FROM departments WHERE name = 'PRODUKSI SMT'), true),
('Office SMT', (SELECT id FROM departments WHERE name = 'PRODUKSI SMT'), true),
('SMT', (SELECT id FROM departments WHERE name = 'PRODUKSI SMT'), true),

-- PURCHASE
('Purchase', (SELECT id FROM departments WHERE name = 'PURCHASE'), true),

-- QMR
('QMR', (SELECT id FROM departments WHERE name = 'QMR'), true),

-- QUALITY
('IQC', (SELECT id FROM departments WHERE name = 'QUALITY'), true),
('QAQC', (SELECT id FROM departments WHERE name = 'QUALITY'), true),
('OQC/IBI', (SELECT id FROM departments WHERE name = 'QUALITY'), true),

-- R&D
('R&D', (SELECT id FROM departments WHERE name = 'R&D'), true),

-- SYSTEM
('System', (SELECT id FROM departments WHERE name = 'SYSTEM'), true);
