import type { SupabaseClient } from "@supabase/supabase-js";

function normWallet(w: string | null | undefined): string | null {
  if (w == null || typeof w !== "string") return null;
  const t = w.trim();
  return t ? t.toLowerCase() : null;
}

type ProfileRow = {
  id: string;
  role: string | null;
  walletAddress?: string | null;
};

/**
 * Appointments use `doctor_id` → `profiles.id`. After seeding or partial migration,
 * that id may differ from the signed-in Auth user id while the wallet matches.
 * Returns every doctor profile id that should see the same queue/payments as this user.
 */
export async function doctorAppointmentDoctorIdScope(
  supabase: SupabaseClient,
  userId: string
): Promise<{ ids: string[]; error?: string; notDoctor?: boolean }> {
  const { data: me, error } = await supabase
    .from("profiles")
    .select('id, role, "walletAddress"')
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return { ids: [], error: error.message };
  }

  const row = me as ProfileRow | null;
  if (!row) {
    return { ids: [], error: "no_profile" };
  }
  if (row.role !== "doctor") {
    return { ids: [], notDoctor: true, error: "not_doctor" };
  }

  const idSet = new Set<string>([row.id]);
  const myWallet = normWallet(row.walletAddress);

  if (myWallet) {
    const { data: doctors, error: listErr } = await supabase
      .from("profiles")
      .select('id, "walletAddress"')
      .eq("role", "doctor");

    if (!listErr && doctors) {
      for (const d of doctors as ProfileRow[]) {
        const w = normWallet(d.walletAddress);
        if (w && w === myWallet) {
          idSet.add(d.id);
        }
      }
    }
  }

  return { ids: [...idSet] };
}

export async function appointmentAssignedToDoctorScope(
  supabase: SupabaseClient,
  userId: string,
  appointmentDoctorId: string | null
): Promise<boolean> {
  if (!appointmentDoctorId) return false;
  const { ids, notDoctor } = await doctorAppointmentDoctorIdScope(
    supabase,
    userId
  );
  if (notDoctor || ids.length === 0) return false;
  return ids.includes(appointmentDoctorId);
}
