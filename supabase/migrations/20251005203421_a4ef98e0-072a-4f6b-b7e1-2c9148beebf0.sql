-- Update the check constraint to allow 'leave' as a valid status
ALTER TABLE public.attendance
DROP CONSTRAINT IF EXISTS attendance_status_check;

ALTER TABLE public.attendance
ADD CONSTRAINT attendance_status_check CHECK (status IN ('present', 'absent', 'leave'));