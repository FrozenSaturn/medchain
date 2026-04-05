-- =============================================================================
-- MedChain: wipe demo data and re-seed profiles + appointments
-- Run in Supabase → SQL Editor after replacing the three UUIDs below.
--
-- WHY THIS EXISTS
-- The app uses Supabase Auth: every API row is keyed by auth.uid().
-- profiles.id MUST equal the User UID from Authentication → Users.
-- Fixed UUIDs in supabase_seed.sql (e.g. 22222222-...) do NOT match your
-- logged-in user, so the doctor queue, patient appointments, and RLS never line up.
--
-- SETUP (do this once)
-- 1. Supabase Dashboard → Authentication → Users
-- 2. Create THREE users (email + password), e.g. patient@..., doctor@..., admin@...
-- 3. Open each user → copy "User UID" (UUID)
-- 4. Paste those UUIDs into v_admin, v_doctor, v_patient below (match roles!)
-- 5. Run this entire script
-- 6. In the app: sign in as each account and open Account Settings; connect the
--    wallet that matches the address below so NFT/records features see the right wallet.
--
-- WALLETS (one profile per address; must match what you connect in the app)
--   Patient: 0xE5317C21F8c0317c2526daaA2365bCDd39447262
--   Doctor:  0xFFA39530704610587Ef9a1a0e15E9C641504c3D4  (Dr. Emily Chen)
--   Admin:   0x2F3755831ce31382b9c79dab5318cd5E1bedB5B3
-- =============================================================================

DO $$
DECLARE
  -- ▼▼▼ REPLACE with real User UIDs from Authentication → Users ▼▼▼
  v_admin   uuid := '11111111-1111-1111-1111-111111111111'::uuid;
  v_doctor  uuid := '22222222-2222-2222-2222-222222222222'::uuid;
  v_patient uuid := '0630d89e-3030-4acd-84dd-8126bc988323'::uuid;
  -- ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
BEGIN
  IF v_admin = '11111111-1111-1111-1111-111111111111'::uuid
     OR v_doctor = '22222222-2222-2222-2222-222222222222'::uuid
     OR v_patient = '33333333-3333-3333-3333-333333333333'::uuid
  THEN
    RAISE EXCEPTION 'Edit v_admin, v_doctor, v_patient in this script with your real Auth User UIDs before running.';
  END IF;

  TRUNCATE TABLE public.medical_records_nfts RESTART IDENTITY;
  TRUNCATE TABLE public.appointments RESTART IDENTITY;
  TRUNCATE TABLE public.patient_uploaded_records RESTART IDENTITY;
  TRUNCATE TABLE public.profiles RESTART IDENTITY;

  INSERT INTO public.profiles (id, full_name, "walletAddress", bio, role, avatar_url) VALUES
    (v_admin, 'Admin Supervisor', '0x2F3755831ce31382b9c79dab5318cd5E1bedB5B3',
     'Hospital Administrator', 'admin',
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'),
    (v_doctor, 'Dr. Adhisree Paul', '0xFFA39530704610587Ef9a1a0e15E9C641504c3D4',
     'Senior Cardiologist with 10 years of experience.', 'doctor',
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Doctor'),
    (v_patient, 'Arya Bhattacharjee', '0xE5317C21F8c0317c2526daaA2365bCDd39447262',
     'Regular patient, history of mild hypertension.', 'patient',
     'https://api.dicebear.com/7.x/avataaars/svg?seed=Patient');

  INSERT INTO public.appointments (
    id, patient_id, doctor_id, appointment_date, reason, symptoms, status, time,
    patientAge, lastVisit, consultation_fee, payment_status, payment_amount, payment_tx_hash
  ) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', v_patient, v_doctor, '2026-04-10',
     'Regular checkup', 'Mild chest discomfort', 'booked', '10:00 AM',
     45, '2023-12-15', 100, 'not_requested', 0, NULL),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', v_patient, v_doctor, '2026-04-12',
     'Follow-up consultation', 'Palpitations, anxiety', 'awaiting_diagnosis', '11:00 AM',
     45, '2026-04-10', 150, 'pending', 150, NULL),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', v_patient, v_doctor, '2026-04-15',
     'Cardiology Consult', 'Mild shortness of breath upon exertion', 'completed', '02:00 PM',
     45, '2026-04-12', 200, 'paid', 200, '0xdemo1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b');

  INSERT INTO public.medical_records_nfts (
    id, appointment_id, patient_wallet_address, doctor_wallet_address, diagnosis, treatment, token_uri
  ) VALUES
    ('11111111-2222-3333-4444-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
     '0xE5317C21F8c0317c2526daaA2365bCDd39447262',
     '0xFFA39530704610587Ef9a1a0e15E9C641504c3D4',
     'Stable angina pectoris confirmed via ECG.',
     'Prescribed 0.4mg nitroglycerin tablets sublingually PRN. Recommended mild exercise and low-sodium diet.',
     'ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG');
END $$;
