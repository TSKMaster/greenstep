import { redirect } from "next/navigation";
import { AppShellChrome } from "@/components/layout/app-shell-chrome";
import { ReportsMapLoader } from "@/components/map/reports-map-loader";
import { getCurrentUserWithProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReportListItem } from "@/types";

export default async function MapPage() {
  const { profile, user } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const email = user.email ?? profile?.email ?? "";
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("reports")
    .select(
      "id, address, category, created_at, description, is_anonymous, latitude, longitude, status, support_count, user_id",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить карту обращений.");
  }

  const reports = (data ?? []) as ReportListItem[];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#edf3ee] px-3 py-3 pb-28 sm:px-4 sm:py-4 sm:pb-32 lg:px-6 lg:py-5 lg:pb-2">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.36]"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(237,243,238,0.44),rgba(237,243,238,0.62))]" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <AppShellChrome
          email={email}
          isAdmin={Boolean(profile?.is_admin)}
          rating={profile?.rating ?? 0}
          title="Карта обращений"
        />

        <section className="mt-3 mx-auto w-full rounded-[28px] border border-border bg-surface p-4 shadow-sm lg:rounded-[32px] lg:border-[#d4e4d2] lg:bg-white lg:shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
          <ReportsMapLoader
            currentUserId={user.id}
            reports={reports}
            showCreateCta
          />
        </section>
      </div>
    </main>
  );
}
