import type { RequestStatus } from "@/types";

const STATUS_LABELS: Record<RequestStatus, string> = {
  new: "Новая",
  accepted: "Принята",
  in_progress: "В работе",
  resolved: "Решена",
  rejected: "Отклонена",
};

const STATUS_CLASSES: Record<RequestStatus, string> = {
  new: "bg-sky-100 text-sky-700",
  accepted: "bg-amber-100 text-amber-700",
  in_progress: "bg-violet-100 text-violet-700",
  resolved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

type ReportStatusBadgeProps = {
  status: RequestStatus;
};

export function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
