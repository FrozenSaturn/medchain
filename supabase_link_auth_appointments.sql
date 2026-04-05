-- =============================================================================
-- Link seed/demo appointments to YOUR Supabase Auth users
-- Run in SQL Editor after setting v_doctor and v_patient below.
--
-- Symptom: Doctor queue + profile counts are empty, but rows exist in Table Editor.
-- Cause:   Seed uses doctor_id 22222222… / patient_id 33333333…; your login uses
--          different User UIDs from Authentication → Users.
--
-- Copy each "User UID" from: Authentication → Users → (user) → User UID
-- =============================================================================

DO $$
DECLARE
  v_doctor uuid := '22222222-2222-2222-2222-222222222222'::uuid;  -- REPLACE with doctor Auth UID
  v_patient uuid := '33333333-3333-3333-3333-333333333333'::uuid; -- REPLACE with patient Auth UID
BEGIN
  IF v_doctor = '22222222-2222-2222-2222-222222222222'::uuid
     OR v_patient = '33333333-3333-3333-3333-333333333333'::uuid
  THEN
    RAISE EXCEPTION 'Set v_doctor and v_patient to your real Auth User UIDs (not the seed placeholders).';
  END IF;

  INSERT INTO public.profiles (id, full_name, "walletAddress", role, bio)
  VALUES (
    v_doctor,
    'Dr. Emily Chen',
    '0xFFA39530704610587Ef9a1a0e15E9C641504c3D4',
    'doctor',
    'Senior Cardiologist with 10 years of experience.'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    "walletAddress" = EXCLUDED."walletAddress",
    role = EXCLUDED.role,
    bio = EXCLUDED.bio;

  INSERT INTO public.profiles (id, full_name, "walletAddress", role, bio)
  VALUES (
    v_patient,
    'John Doe',
    '0xE5317C21F8c0317c2526daaA2365bCDd39447262',
    'patient',
    'Regular patient, history of mild hypertension.'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    "walletAddress" = EXCLUDED."walletAddress",
    role = EXCLUDED.role,
    bio = EXCLUDED.bio;

  UPDATE public.appointments
  SET doctor_id = v_doctor
  WHERE doctor_id = '22222222-2222-2222-2222-222222222222'::uuid;

  UPDATE public.appointments
  SET patient_id = v_patient
  WHERE patient_id = '33333333-3333-3333-3333-333333333333'::uuid;

  DELETE FROM public.profiles WHERE id = '22222222-2222-2222-2222-222222222222'::uuid;
  DELETE FROM public.profiles WHERE id = '33333333-3333-3333-3333-333333333333'::uuid;
END $$;
