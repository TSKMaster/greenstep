import Link from "next/link";
import { redirect } from "next/navigation";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReportListItem } from "@/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

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
    .select("id, category, created_at, status")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить общий список заявок.");
  }

  const reports = (data ?? []) as Pick<
    ReportListItem,
    "id" | "category" | "created_at" | "status"
  >[];

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
              Здесь отображаются все обращения жителей района. Нажми на заявку,
              чтобы открыть подробную карточку.
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
              <Link
                key={report.id}
                href={`/reports/${report.id}`}
                className="rounded-3xl border border-border bg-white p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-primary-dark">
                      {report.category}
                    </h2>
                    <p className="mt-2 text-sm text-foreground/70">
                      Создано: {formatDate(report.created_at)}
                    </p>
                  </div>
                  <ReportStatusBadge status={report.status} />
                </div>
              </Link>
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
