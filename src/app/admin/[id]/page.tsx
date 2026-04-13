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
    <main className="relative min-h-screen overflow-hidden bg-[#edf3ee] px-3 py-3 pb-10 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.36]"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(237,243,238,0.44),rgba(237,243,238,0.62))]" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <div className="flex min-h-[calc(100vh-32px)] items-center justify-center sm:min-h-[calc(100vh-40px)] lg:min-h-[calc(100vh-48px)]">
          <section className="w-full max-w-4xl overflow-hidden rounded-[28px] border border-[#d4e4d2] bg-white shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-2xl border border-border px-4 py-3 font-semibold text-primary-dark transition hover:bg-surface-muted"
                >
                  Назад к списку заявок
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-2xl border border-border px-4 py-3 font-semibold text-primary-dark transition hover:bg-surface-muted"
                >
                  Вернуться на главную
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
