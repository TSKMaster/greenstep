import { redirect } from "next/navigation";
import { updateReportAdminDetails } from "@/app/admin/actions";
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

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
    .select(
      "id, address, admin_comment, category, created_at, description, is_anonymous, latitude, longitude, status, support_count",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить заявки для админки.");
  }

  const reports = (data ?? []) as ReportListItem[];

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto w-full max-w-5xl rounded-[28px] border border-border bg-surface p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          GreenStep
        </p>
        <h1 className="mt-4 text-3xl font-bold text-primary-dark">Админка</h1>
        <p className="mt-4 text-sm leading-6 text-foreground/80">
          Здесь можно просматривать обращения, менять статусы и оставлять
          комментарии администратора.
        </p>

        <div className="mt-8 grid gap-5">
          {reports.map((report) => {
            const action = updateReportAdminDetails.bind(null, report.id);

            return (
              <article
                key={report.id}
                className="rounded-3xl border border-border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-primary-dark">
                      {report.category}
                    </h2>
                    <p className="mt-2 text-sm text-foreground/70">
                      Создано: {formatDate(report.created_at)}
                    </p>
                    <p className="mt-2 text-sm text-foreground/70">
                      Адрес: {report.address || "Не указан"}
                    </p>
                  </div>
                  <ReportStatusBadge status={report.status} />
                </div>

                <p className="mt-4 text-sm leading-6 text-foreground/80">
                  {report.description}
                </p>

                <div className="mt-4 grid gap-2 text-sm text-foreground/70 sm:grid-cols-3">
                  <p>Поддержка: {report.support_count}</p>
                  <p>Анонимно: {report.is_anonymous ? "Да" : "Нет"}</p>
                  <p>
                    Координаты: {report.latitude}, {report.longitude}
                  </p>
                </div>

                <form action={action} className="mt-5 grid gap-4">
                  <label className="flex flex-col gap-2 text-sm text-foreground/80">
                    Статус
                    <select
                      name="status"
                      defaultValue={report.status}
                      className="rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-2 text-sm text-foreground/80">
                    Комментарий администратора
                    <textarea
                      name="admin_comment"
                      rows={4}
                      defaultValue={report.admin_comment ?? ""}
                      placeholder="Напиши комментарий по заявке"
                      className="rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
                    />
                  </label>

                  <button
                    type="submit"
                    className="rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark"
                  >
                    Сохранить изменения
                  </button>
                </form>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
