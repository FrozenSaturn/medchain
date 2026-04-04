-- Schema creation for Medchain database
-- Run this script in the Supabase SQL Editor

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  "walletAddress" TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT CHECK (role IN ('patient', 'doctor', 'admin'))
);

-- Note: In a production Supabase setup, 'profiles' id usually references auth.users(id). 
-- If you are using Supabase authentication, you may want to add a foreign key constraint:
-- ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Create Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  appointment_date TEXT,
  reason TEXT,
  symptoms TEXT,
  status TEXT CHECK (status IN ('booked', 'completed', 'awaiting_diagnosis', 'cancelled')),
  time TEXT,
  patientAge INTEGER,
  lastVisit TEXT,
  consultation_fee DECIMAL DEFAULT 0,
  payment_status TEXT DEFAULT 'not_requested' CHECK (payment_status IN ('not_requested', 'pending', 'paid')),
  payment_amount DECIMAL DEFAULT 0,
  payment_tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure payment columns exist on appointments (no-op if table was just created with them above)
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'not_requested';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS payment_amount DECIMAL DEFAULT 0;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS payment_tx_hash TEXT;

-- 3. Create Medical Records NFTs Table
CREATE TABLE IF NOT EXISTS public.medical_records_nfts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_wallet_address TEXT,
  doctor_wallet_address TEXT,
  diagnosis TEXT,
  treatment TEXT,
  token_uri TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Patient-uploaded PDFs (extracted text + AI summary for Records tab and RAG chatbot)
CREATE TABLE IF NOT EXISTS public.patient_uploaded_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_size_bytes INTEGER,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  extracted_text TEXT,
  ai_summary TEXT,
  processing_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (processing_status IN ('pending', 'processing', 'ready', 'error')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS patient_uploaded_records_patient_id_idx
  ON public.patient_uploaded_records(patient_id);

ALTER TABLE public.patient_uploaded_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS patient_uploaded_records_select_own ON public.patient_uploaded_records;
DROP POLICY IF EXISTS patient_uploaded_records_insert_own ON public.patient_uploaded_records;
DROP POLICY IF EXISTS patient_uploaded_records_update_own ON public.patient_uploaded_records;

CREATE POLICY patient_uploaded_records_select_own
  ON public.patient_uploaded_records FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY patient_uploaded_records_insert_own
  ON public.patient_uploaded_records FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY patient_uploaded_records_update_own
  ON public.patient_uploaded_records FOR UPDATE
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

-- Seed Data using the exact wallet addresses provided

-- Insert Profiles (Using fixed UUIDs so relations work seamlessly)
INSERT INTO public.profiles (id, full_name, "walletAddress", bio, role, avatar_url) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin Supervisor', '0x2F3755831ce31382b9c79dab5318cd5E1bedB5B3', 'Hospital Administrator', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'),
('22222222-2222-2222-2222-222222222222', 'Dr. Emily Chen', '0xFFA39530704610587Ef9a1a0e15E9C641504c3D4', 'Senior Cardiologist with 10 years of experience.', 'doctor', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Doctor'),
('33333333-3333-3333-3333-333333333333', 'John Doe', '0xE5317C21F8c0317c2526daaA2365bCDd39447262', 'Regular patient, history of mild hypertension.', 'patient', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Patient')
ON CONFLICT (id) DO UPDATE SET 
  "walletAddress" = EXCLUDED."walletAddress", 
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name;

-- Insert Appointments for the Patient ('33333333-3333-3333-3333-333333333333')
INSERT INTO public.appointments (id, patient_id, doctor_id, appointment_date, reason, symptoms, status, time, patientAge, lastVisit, consultation_fee, payment_status, payment_amount, payment_tx_hash) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', '2026-04-10', 'Regular checkup', 'Mild chest discomfort', 'booked', '10:00 AM', 45, '2023-12-15', 100, 'not_requested', 0, NULL),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', '2026-04-12', 'Follow-up consultation', 'Palpitations, anxiety', 'awaiting_diagnosis', '11:00 AM', 45, '2026-04-10', 150, 'pending', 150, NULL),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', '2026-04-15', 'Cardiology Consult', 'Mild shortness of breath upon exertion', 'completed', '02:00 PM', 45, '2026-04-12', 200, 'paid', 200, '0xdemo1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b')
ON CONFLICT (id) DO NOTHING;

-- Insert Medical Records NFTs (Simulating completed treatments by the Doctor for the Patient)
INSERT INTO public.medical_records_nfts (id, appointment_id, patient_wallet_address, doctor_wallet_address, diagnosis, treatment, token_uri) VALUES
('11111111-2222-3333-4444-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '0xE5317C21F8c0317c2526daaA2365bCDd39447262', '0xFFA39530704610587Ef9a1a0e15E9C641504c3D4', 'Stable angina pectoris confirmed via ECG.', 'Prescribed 0.4mg nitroglycerin tablets sublingually PRN. Recommended mild exercise and low-sodium diet.', 'ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG')
ON CONFLICT (id) DO NOTHING;

-- Align demo payment state for seed appointment rows (idempotent if INSERT ran)
UPDATE public.appointments SET payment_status = 'not_requested', payment_amount = 0, payment_tx_hash = NULL WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
UPDATE public.appointments SET payment_status = 'pending', payment_amount = 150, payment_tx_hash = NULL WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
UPDATE public.appointments SET payment_status = 'paid', payment_amount = 200, payment_tx_hash = '0xdemo1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
