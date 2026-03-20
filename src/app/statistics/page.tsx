import Link from "next/link";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/statistics/stat-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { calculateEcoIndex } from "@/lib/statistics";
import type { ReportListItem } from "@/types";

export default async function StatisticsPage() {
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
      "id, address, category, created_at, description, is_anonymous, latitude, longitude, status, support_count",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить статистику.");
  }

  const reports = (data ?? []) as ReportListItem[];
  const totalReports = reports.length;
  const newReports = reports.filter((report) => report.status === "new").length;
  const inProgressReports = reports.filter(
    (report) => report.status === "in_progress",
  ).length;
  const resolvedReports = reports.filter(
    (report) => report.status === "resolved",
  ).length;
  const totalSupport = reports.reduce(
    (sum, report) => sum + report.support_count,
    0,
  );
  const ecoIndex = calculateEcoIndex(reports);

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto w-full max-w-5xl rounded-[28px] border border-border bg-surface p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              GreenStep
            </p>
            <h1 className="mt-3 text-3xl font-bold text-primary-dark">
              Статистика
            </h1>
            <p className="mt-3 text-sm leading-6 text-foreground/80">
              Здесь собраны базовые показатели по обращениям жителей района.
            </p>
          </div>

          <div className="rounded-3xl bg-surface-muted px-6 py-4 text-center">
            <p className="text-sm font-medium text-foreground/70">Эко-индекс</p>
            <p className="mt-2 text-4xl font-bold text-primary-dark">
              {ecoIndex}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Всего заявок" value={totalReports} accent="green" />
          <StatCard label="Новые" value={newReports} accent="blue" />
          <StatCard
            label="В работе"
            value={inProgressReports}
            accent="orange"
          />
          <StatCard label="Решённые" value={resolvedReports} accent="green" />
          <StatCard
            label="Всего поддержек"
            value={totalSupport}
            accent="blue"
          />
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-primary-dark">
            Краткий вывод
          </h2>
          <p className="mt-3 text-sm leading-6 text-foreground/80">
            Сейчас в системе {totalReports} заявок. Из них решено{" "}
            {resolvedReports}, в работе {inProgressReports}, новых {newReports}.
            Жители уже поддержали обращения {totalSupport} раз.
          </p>
        </div>

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
