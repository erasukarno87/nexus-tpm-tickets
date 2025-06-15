
-- Enable Row Level Security on line_areas only (technicians sudah ada policy-nya)
ALTER TABLE public.line_areas ENABLE ROW LEVEL SECURITY;

-- Create policies for line_areas table (allow all operations for now since this is master data)
CREATE POLICY "Allow all operations on line_areas" 
ON public.line_areas 
FOR ALL 
USING (true) 
WITH CHECK (true);
