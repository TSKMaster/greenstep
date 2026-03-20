import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export async function getCurrentUserWithProfile() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { profile: null, supabase, user: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, is_admin, rating")
    .eq("id", user.id)
    .maybeSingle();

  return {
    profile: (profile as Profile | null) ?? null,
    supabase,
    user,
  };
}
