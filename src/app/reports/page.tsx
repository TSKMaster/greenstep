import Link from "next/link";
import { redirect } from "next/navigation";
import { FilePlus } from "lucide-react";
import { AppShellChrome } from "@/components/layout/app-shell-chrome";
import { ReportsListPanel } from "@/components/reports/reports-list-panel";
import { getCurrentUserWithProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReportListItem } from "@/types";

export default async function ReportsPage() {
  const { profile, user } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const email = user.email ?? profile?.email ?? "";
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("reports")
    .select("id, category, created_at, status, user_id")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить общий список заявок.");
  }

  const reports = (data ?? []) as Pick<
    ReportListItem,
    "id" | "category" | "created_at" | "status" | "user_id"
  >[];
  const totalReports = reports.length;
  const newReports = reports.filter((report) => report.status === "new").length;
  const myReports = reports.filter((report) => report.user_id === user.id).length;
  const myResolvedReports = reports.filter(
    (report) => report.user_id === user.id && report.status === "resolved",
  ).length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#edf3ee] px-3 py-3 pb-28 sm:px-4 sm:py-4 sm:pb-32 lg:px-6 lg:py-5 lg:pb-6">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.36]"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(237,243,238,0.44),rgba(237,243,238,0.62))]" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <AppShellChrome
          displayName={profile?.full_name ?? user.user_metadata?.full_name ?? null}
          email={email}
          isAdmin={Boolean(profile?.is_admin)}
          rating={profile?.rating ?? 0}
          title="Все заявки"
        />

        <section className="mt-3 mx-auto w-full rounded-[28px] border border-border bg-surface p-6 shadow-sm lg:rounded-[32px] lg:border-[#d4e4d2] lg:bg-white lg:p-8 lg:shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Всего заявок", totalReports],
              ["Новых", newReports],
              ["Моих", myReports],
              ["Решено моих", myResolvedReports],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[22px] border border-[#d4e4d2] bg-[#f3f7f1] px-4 py-4 shadow-[0_10px_20px_rgba(59,94,57,0.06)]"
              >
                <p className="text-[12px] uppercase tracking-[0.12em] text-[#6c8770]">
                  {label}
                </p>
                <p className="mt-3 text-[32px] font-semibold leading-none tracking-[-0.04em] text-[#12351d]">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/reports/new"
              className="hidden items-center justify-center gap-2 rounded-2xl bg-[#2f8734] px-5 py-3 font-semibold !text-white transition hover:bg-[#286f2c] lg:inline-flex"
            >
              <FilePlus size={18} strokeWidth={2.2} />
              Новая заявка
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#12351d] lg:hidden">
                Все заявки
              </h1>
            </div>
          </div>

          <ReportsListPanel reports={reports} />
        </section>
      </div>

      <Link
        href="/reports/new"
        aria-label="Новая заявка"
        className="fixed bottom-[92px] right-4 z-[1300] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#2f8734] !text-white shadow-[0_18px_32px_rgba(47,135,52,0.3)] transition hover:bg-[#286f2c] lg:hidden"
        style={{ color: "#ffffff" }}
      >
        <FilePlus size={22} strokeWidth={2.3} className="text-white" />
      </Link>
    </main>
  );
}
