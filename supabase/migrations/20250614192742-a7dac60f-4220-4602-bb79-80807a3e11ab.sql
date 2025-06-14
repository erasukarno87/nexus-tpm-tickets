
-- Remove description column from departments table as it's not needed
ALTER TABLE public.departments DROP COLUMN IF EXISTS description;
