-- Role verification (admin panel) — run in Supabase SQL Editor if these columns are missing.
-- Fixes: Role Verification query on profiles.verified / specialization / consultation_fee.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS specialization TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS consultation_fee DECIMAL;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS doctor_verification_pending BOOLEAN NOT NULL DEFAULT false;

-- Existing doctors from seed stay verified; no pending noise.
UPDATE public.profiles
SET verified = true, doctor_verification_pending = false
WHERE role = 'doctor' AND (verified IS DISTINCT FROM true OR doctor_verification_pending = true);

COMMENT ON COLUMN public.profiles.verified IS 'doctor: true after admin approved (on-chain + DB)';
COMMENT ON COLUMN public.profiles.doctor_verification_pending IS 'patient submitted doctor application; admin reviews';
