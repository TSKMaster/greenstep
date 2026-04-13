import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminReportsPanel } from "@/components/admin/admin-reports-panel";
import { getCurrentUserWithProfile } from "@/lib/auth";
import type { ReportListItem } from "@/types";

export default async function AdminPage() {
  const { profile, supabase, user } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/auth/sign-in");
  }

  if (!profile?.is_admin) {
    redirect("/");
  }

  const { data, error } = await supabase
    .from("reports")
    .select("id, category, created_at, status")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить заявки для админки.");
  }

  const reports = (data ?? []) as Pick<
    ReportListItem,
    "id" | "category" | "created_at" | "status"
  >[];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#edf3ee] px-3 py-3 pb-10 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.36]"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(237,243,238,0.44),rgba(237,243,238,0.62))]" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <div className="flex min-h-[calc(100vh-32px)] items-center justify-center sm:min-h-[calc(100vh-40px)] lg:min-h-[calc(100vh-48px)]">
          <section className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#d4e4d2] bg-white shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
            <div className="flex items-center justify-between gap-4 border-b border-[#c9ddc7] bg-[#4f9663] px-5 py-3 shadow-[0_12px_24px_rgba(52,102,65,0.14)]">
              <div className="flex items-center gap-0">
                <div className="flex h-[44px] w-[44px] items-center justify-center overflow-hidden">
                  <Image
                    src="/GreenStepLogo.svg"
                    alt="GreenStep logo"
                    width={56}
                    height={56}
                    className="h-[3.1rem] w-auto object-contain"
                  />
                </div>
                <p className="-ml-1 text-[23px] font-semibold tracking-[-0.04em] text-[#f7fbf3]">
                  GreenStep
                </p>
              </div>
              <p className="text-right text-sm font-semibold uppercase tracking-[0.14em] text-[#f7fbf3]">
                Панель администратора
              </p>
            </div>

            <div className="p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold text-primary-dark">Работа с заявками</h1>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-2xl border border-border px-4 py-3 font-semibold text-primary-dark transition hover:bg-surface-muted"
                >
                  Вернуться на главную
                </Link>
              </div>
              <p className="mt-4 text-sm leading-6 text-foreground/80">
                Здесь показан список обращений. Нажми на нужную заявку, чтобы открыть
                ее и изменить статус или комментарий.
              </p>

              {reports.length > 0 ? (
                <AdminReportsPanel reports={reports} />
              ) : (
                <div className="mt-8 rounded-3xl bg-surface-muted p-6 text-sm leading-6 text-foreground/80">
                  Пока нет заявок для отображения.
                </div>
              )}

            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
