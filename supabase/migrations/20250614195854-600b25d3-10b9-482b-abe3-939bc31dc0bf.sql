
-- Remove columns from technicians table
ALTER TABLE public.technicians 
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS department_id,
DROP COLUMN IF EXISTS specialty;
