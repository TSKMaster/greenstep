import Link from "next/link";
import { redirect } from "next/navigation";
import { ReportsMapLoader } from "@/components/map/reports-map-loader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReportListItem } from "@/types";

export default async function MapPage() {
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
    throw new Error("Не удалось загрузить карту заявок.");
  }

  const reports = (data ?? []) as ReportListItem[];

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto w-full max-w-5xl rounded-[28px] border border-border bg-surface p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              GreenStep
            </p>
            <h1 className="mt-3 text-3xl font-bold text-primary-dark">
              Карта заявок
            </h1>
            <p className="mt-3 text-sm leading-6 text-foreground/80">
              На карте отображаются все обращения, созданные в системе.
            </p>
          </div>

          <Link
            href="/reports/new"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark"
          >
            Новая заявка
          </Link>
        </div>

        <div className="mt-8">
          <ReportsMapLoader reports={reports} />
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
