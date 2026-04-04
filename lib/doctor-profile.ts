/**
 * Display label for a doctor profile when `specialization` may not exist on `profiles`
 * (schema only guarantees full_name, bio, role, etc.).
 */
export function doctorSpecialtyFromProfile(row: {
  specialization?: string | null;
  bio?: string | null;
}): string {
  const s = row.specialization?.trim();
  if (s) return s;
  const b = row.bio?.trim();
  if (b) return b.length > 60 ? `${b.slice(0, 57)}…` : b;
  return "Physician";
}
