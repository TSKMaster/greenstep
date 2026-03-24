import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { supportReport } from "@/app/reports/actions";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReportListItem } from "@/types";

type ReportDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function ReportDetailsPage({
  params,
}: ReportDetailsPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const [{ data, error }, { data: supportRow }] = await Promise.all([
    supabase
      .from("reports")
      .select(
        "id, user_id, address, admin_comment, category, created_at, description, is_anonymous, latitude, longitude, photo_url, status, support_count",
      )
      .eq("id", id)
      .single(),
    supabase
      .from("report_supports")
      .select("report_id")
      .eq("report_id", id)
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  if (error || !data) {
    notFound();
  }

  const report = data as ReportListItem;
  const hasSupported = Boolean(supportRow);
  const isOwnReport = report.user_id === user.id;
  const supportAction = supportReport.bind(null, report.id);

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-[28px] border border-border bg-surface p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          GreenStep
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-dark">
              {report.category}
            </h1>
            <p className="mt-3 text-sm text-foreground/70">
              Создано: {formatDate(report.created_at)}
            </p>
          </div>
          <ReportStatusBadge status={report.status} />
        </div>

        {report.photo_url ? (
          <div className="relative mt-6 h-72 overflow-hidden rounded-3xl border border-border bg-slate-950 sm:h-96">
            <Image
              src={report.photo_url}
              alt="Фото заявки"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        ) : null}

        <div className="mt-6 rounded-3xl bg-surface-muted p-5 text-sm leading-7 text-foreground/80">
          <p>{report.description}</p>
        </div>

        <div className="mt-6 grid gap-4 rounded-3xl border border-border bg-white p-5 text-sm text-foreground/80 sm:grid-cols-2">
          <p>Адрес: {report.address || "Не указан"}</p>
          <p>Поддержка: {report.support_count}</p>
          <p>Анонимно: {report.is_anonymous ? "Да" : "Нет"}</p>
          <p>
            Координаты: {report.latitude}, {report.longitude}
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-white p-5">
          <p className="text-sm font-semibold text-primary-dark">
            Комментарий администратора
          </p>
          <p className="mt-3 text-sm leading-6 text-foreground/80">
            {report.admin_comment || "Комментарий пока не добавлен."}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {isOwnReport ? (
            <div className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-100 px-4 py-3 text-center font-semibold text-slate-700 sm:flex-1">
              Это твоя заявка
            </div>
          ) : hasSupported ? (
            <div className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-100 px-4 py-3 text-center font-semibold text-emerald-800 sm:flex-1">
              Ты уже поддержал это обращение
            </div>
          ) : (
            <form action={supportAction} className="sm:flex-1">
              <button
                type="submit"
                className="w-full rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark"
              >
                Поддержать обращение
              </button>
            </form>
          )}

          <Link
            href="/reports"
            className="inline-flex items-center justify-center rounded-2xl border border-border px-4 py-3 font-semibold text-primary-dark transition hover:bg-surface-muted sm:flex-1"
          >
            Назад к списку
          </Link>
        </div>
      </section>
    </main>
  );
}
