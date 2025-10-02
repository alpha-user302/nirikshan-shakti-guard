-- Create enum for worker roles
CREATE TYPE public.worker_role AS ENUM ('operator', 'supervisor', 'technician', 'manager');

-- Create enum for violation severity
CREATE TYPE public.violation_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Create workers table
CREATE TABLE public.workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  employee_id TEXT UNIQUE NOT NULL,
  role worker_role NOT NULL DEFAULT 'operator',
  department TEXT,
  phone TEXT,
  email TEXT,
  base_salary DECIMAL(10, 2) DEFAULT 25000.00,
  total_holidays INTEGER DEFAULT 24,
  remaining_holidays INTEGER DEFAULT 24,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create violations table
CREATE TABLE public.violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
  worker_name TEXT NOT NULL,
  violation_type TEXT NOT NULL,
  missing_ppe TEXT NOT NULL,
  severity violation_severity NOT NULL DEFAULT 'medium',
  salary_deduction DECIMAL(10, 2) DEFAULT 500.00,
  holiday_deduction DECIMAL(4, 2) DEFAULT 0.5,
  location TEXT,
  camera_zone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'half-day')),
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(worker_id, date)
);

-- Create system_settings table
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workers
CREATE POLICY "Anyone can view workers"
  ON public.workers FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert workers"
  ON public.workers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update workers"
  ON public.workers FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policies for violations
CREATE POLICY "Anyone can view violations"
  ON public.violations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert violations"
  ON public.violations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update violations"
  ON public.violations FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policies for attendance
CREATE POLICY "Anyone can view attendance"
  ON public.attendance FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert attendance"
  ON public.attendance FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update attendance"
  ON public.attendance FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policies for system_settings
CREATE POLICY "Anyone can view settings"
  ON public.system_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage settings"
  ON public.system_settings FOR ALL
  TO authenticated
  USING (true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER set_workers_updated_at
  BEFORE UPDATE ON public.workers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default system settings
INSERT INTO public.system_settings (key, value) VALUES
  ('n8n_webhook_url', '{"url": "", "enabled": false}'::jsonb),
  ('violation_penalties', '{"helmet": 500, "vest": 300, "gloves": 200, "boots": 300, "chest_guard": 400}'::jsonb),
  ('holiday_deduction_rate', '{"per_violation": 0.5}'::jsonb);