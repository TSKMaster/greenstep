import Link from "next/link";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import type { ReportListItem } from "@/types";

type ReportCardProps = {
  report: ReportListItem;
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

export function ReportCard({ report }: ReportCardProps) {
  return (
    <article className="rounded-3xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-primary-dark">
            {report.category}
          </h2>
          <p className="mt-1 text-xs text-foreground/60">
            Создано: {formatDate(report.created_at)}
          </p>
        </div>
        <ReportStatusBadge status={report.status} />
      </div>

      <p className="mt-4 text-sm leading-6 text-foreground/80">
        {report.description}
      </p>

      <div className="mt-4 space-y-2 text-sm text-foreground/70">
        <p>Адрес: {report.address || "Не указан"}</p>
        <p>Поддержка: {report.support_count}</p>
        <p>Анонимно: {report.is_anonymous ? "Да" : "Нет"}</p>
      </div>

      <Link
        href={`/reports/${report.id}`}
        className="mt-5 inline-flex text-sm font-semibold text-primary"
      >
        Открыть карточку заявки
      </Link>
    </article>
  );
}
