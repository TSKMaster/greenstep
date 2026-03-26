import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminReportForm } from "@/components/admin/admin-report-form";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { getCurrentUserWithProfile } from "@/lib/auth";
import type { ReportListItem, RequestStatus } from "@/types";

const STATUS_OPTIONS: { label: string; value: RequestStatus }[] = [
  { label: "Новая", value: "new" },
  { label: "Принята", value: "accepted" },
  { label: "В работе", value: "in_progress" },
  { label: "Решена", value: "resolved" },
  { label: "Отклонена", value: "rejected" },
];

type AdminReportPageProps = {
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

export default async function AdminReportPage({
  params,
}: AdminReportPageProps) {
  const { id } = await params;
  const { profile, supabase, user } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/auth/sign-in");
  }

  if (!profile?.is_admin) {
    redirect("/");
  }

  const { data, error } = await supabase
    .from("reports")
    .select(
      "id, address, admin_comment, category, created_at, description, is_anonymous, latitude, longitude, photo_url, status, support_count",
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const report = data as ReportListItem;

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto w-full max-w-4xl rounded-[28px] border border-border bg-surface p-8 shadow-sm">
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

        <AdminReportForm
          adminComment={report.admin_comment ?? ""}
          reportId={report.id}
          status={report.status}
          statusOptions={STATUS_OPTIONS}
        />

        <Link
          href="/admin"
          className="mt-4 inline-flex items-center justify-center rounded-2xl border border-border px-4 py-3 font-semibold text-primary-dark transition hover:bg-surface-muted"
        >
          Назад к списку заявок
        </Link>

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
