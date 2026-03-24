import Link from "next/link";
import { redirect } from "next/navigation";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function MyReportsPage() {
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
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить список ваших заявок.");
  }

  const reports = data ?? [];

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-[28px] border border-border bg-surface p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              GreenStep
            </p>
            <h1 className="mt-3 text-3xl font-bold text-primary-dark">
              Мои заявки
            </h1>
            <p className="mt-3 text-sm leading-6 text-foreground/80">
              Здесь собраны только твои обращения. Нажми на заявку, чтобы
              открыть подробную карточку.
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
                className="rounded-3xl border border-border bg-white p-5 transition hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-primary-dark">
                      {report.category}
                    </h2>
                    <p className="mt-2 text-sm text-foreground/70">
                      Создано:{" "}
                      {new Date(report.created_at).toLocaleString("ru-RU")}
                    </p>
                  </div>

                  <ReportStatusBadge status={report.status} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl bg-surface-muted p-6 text-sm leading-6 text-foreground/80">
            У тебя пока нет заявок. Создай первую, и она появится в этом
            списке.
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
