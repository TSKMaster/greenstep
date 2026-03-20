import type { ReportListItem } from "@/types";

export function calculateEcoIndex(reports: ReportListItem[]) {
  if (reports.length === 0) {
    return 100;
  }

  const resolvedCount = reports.filter(
    (report) => report.status === "resolved",
  ).length;
  const inProgressCount = reports.filter(
    (report) => report.status === "in_progress",
  ).length;
  const rejectedCount = reports.filter(
    (report) => report.status === "rejected",
  ).length;

  const score =
    60 +
    resolvedCount * 8 +
    inProgressCount * 3 -
    (reports.length - resolvedCount - rejectedCount) * 2;

  return Math.max(10, Math.min(100, score));
}

export function getEcoIndexLabel(value: number) {
  if (value >= 80) {
    return "отлично";
  }

  if (value >= 60) {
    return "хорошо";
  }

  if (value >= 40) {
    return "средне";
  }

  return "низко";
}
