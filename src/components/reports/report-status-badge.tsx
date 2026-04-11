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
      return "border border-sky-200 bg-sky-50 text-sky-800";
    case "accepted":
      return "border border-amber-200 bg-amber-50 text-amber-800";
    case "in_progress":
      return "border border-violet-200 bg-violet-50 text-violet-800";
    case "resolved":
      return "border border-emerald-200 bg-emerald-50 text-emerald-800";
    case "rejected":
      return "border border-rose-200 bg-rose-50 text-rose-800";
    default:
      return "border border-slate-200 bg-slate-50 text-slate-700";
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
