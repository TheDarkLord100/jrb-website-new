import { supabase } from "@/lib/supabase/client";

const STUDENT_EMAIL_PATTERN = /^jrb[a-z0-9]+@(iitd\.ac\.in|bird\.iitd\.ac\.in)$/i;

export function isValidStudentEmailFormat(email: string): boolean {
  return STUDENT_EMAIL_PATTERN.test(email.trim());
}

export type AuthResult = { ok: true } | { ok: false; error: string };

export async function requestStudentOtp(email: string): Promise<AuthResult> {
  if (!supabase) return { ok: false, error: "Login is not configured right now." };

  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: { shouldCreateUser: true },
  });

  console.log("error", error);

  if (error) {
    // For a first-time login, this surfaces the Postgres hook's rejection
    // message directly (e.g. "This email is not registered as a current
    // JRB student."). Returning students already have an auth.users row
    // from a prior login, so the hook doesn't run for them at all -- they
    // just get a fresh code.
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function verifyStudentOtp(email: string, token: string): Promise<AuthResult> {
  if (!supabase) return { ok: false, error: "Login is not configured right now." };

  const { error } = await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: token.trim(),
    type: "email",
  });

  if (error) {
    return { ok: false, error: "Incorrect or expired code. Please try again." };
  }

  return { ok: true };
}