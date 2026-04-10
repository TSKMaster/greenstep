import type { RequestStatus } from "@/types";

const STATUS_LABELS: Record<RequestStatus, string> = {
  new: "Новая",
  accepted: "Принята",
  in_progress: "В работе",
  resolved: "Решена",
  rejected: "Отклонена",
};

export function getReportStatusLabel(status: RequestStatus) {
  return STATUS_LABELS[status];
}

export function getReportStatusClassName(status: RequestStatus) {
  switch (status) {
    case "new":
      return "bg-sky-600 text-white";
    case "accepted":
      return "bg-amber-500 text-white";
    case "in_progress":
      return "bg-violet-600 text-white";
    case "resolved":
      return "bg-emerald-600 text-white";
    case "rejected":
      return "bg-rose-600 text-white";
    default:
      return "bg-slate-600 text-white";
  }
}

type ReportStatusBadgeProps = {
  status: RequestStatus;
};

export function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getReportStatusClassName(status)}`}
    >
      {getReportStatusLabel(status)}
    </span>
  );
}
