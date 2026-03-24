import Link from "next/link";
import { redirect } from "next/navigation";
import { ReportCard } from "@/components/reports/report-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReportListItem } from "@/types";

export default async function ReportsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data, error } = await supabase
    .from("reports")
    .select(
      "id, address, category, created_at, description, is_anonymous, photo_url, status, support_count",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить общий список заявок.");
  }

  const reports = (data ?? []) as ReportListItem[];

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-[28px] border border-border bg-surface p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              GreenStep
            </p>
            <h1 className="mt-3 text-3xl font-bold text-primary-dark">
              Все заявки
            </h1>
            <p className="mt-3 text-sm leading-6 text-foreground/80">
              Здесь отображаются все обращения жителей района.
            </p>
          </div>

          <Link
            href="/reports/new"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 font-semibold !text-white transition hover:bg-primary-dark"
          >
            Новая заявка
          </Link>
        </div>

        {reports.length > 0 ? (
          <div className="mt-8 grid gap-4">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl bg-surface-muted p-6 text-sm leading-6 text-foreground/80">
            Пока нет ни одной заявки.
          </div>
        )}

        <Link
          href="/"
          className="mt-8 inline-flex text-sm font-medium text-primary"
        >
          Вернуться на главную
        </Link>
      </section>
    </main>
  );
}
