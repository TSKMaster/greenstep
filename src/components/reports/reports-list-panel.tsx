"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FilePlus } from "lucide-react";
import {
  ReportStatusBadge,
  getReportStatusClassName,
  getReportStatusLabel,
} from "@/components/reports/report-status-badge";
import type { ReportListItem, RequestStatus } from "@/types";

type ReportsListPanelProps = {
  reports: Pick<ReportListItem, "id" | "category" | "created_at" | "status">[];
};

const STATUS_ORDER: RequestStatus[] = [
  "new",
  "accepted",
  "in_progress",
  "resolved",
  "rejected",
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

export function ReportsListPanel({ reports }: ReportsListPanelProps) {
  const [selectedStatuses, setSelectedStatuses] =
    useState<RequestStatus[]>(STATUS_ORDER);

  const statusCounts = useMemo(
    () =>
      STATUS_ORDER.reduce(
        (acc, status) => {
          acc[status] = reports.filter((report) => report.status === status).length;
          return acc;
        },
        {} as Record<RequestStatus, number>,
      ),
    [reports],
  );

  const filteredReports = useMemo(
    () => reports.filter((report) => selectedStatuses.includes(report.status)),
    [reports, selectedStatuses],
  );

  function toggleStatus(status: RequestStatus) {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter((item) => item !== status)
        : [...current, status],
    );
  }

  return (
    <>
      <div className="mt-5 flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-wrap justify-center gap-2.5 lg:justify-start">
          {STATUS_ORDER.map((status) => {
            const isActive = selectedStatuses.includes(status);

            return (
              <button
                key={status}
                type="button"
                onClick={() => toggleStatus(status)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${
                  isActive
                    ? `shadow-sm ${getReportStatusClassName(status)}`
                    : "border-[#d4e4d2] bg-white text-[#587160] opacity-85 hover:border-[#9fcca7] hover:bg-[#f6faf5] hover:text-[#23442d]"
                }`}
              >
                <span>{getReportStatusLabel(status)}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isActive
                      ? "bg-white/80 text-[#28452e]"
                      : "bg-[#f3f7f1] text-[#35533c]"
                  }`}
                >
                  {statusCounts[status]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex lg:justify-end">
          <Link
            href="/reports/new"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2f8734] px-5 py-2 font-semibold !text-white transition hover:bg-[#286f2c]"
          >
            <FilePlus size={18} strokeWidth={2.2} />
            Новая заявка
          </Link>
        </div>
      </div>

      {filteredReports.length > 0 ? (
        <div className="mt-5 grid gap-4">
          {filteredReports.map((report) => (
            <Link
              key={report.id}
              href={`/reports/${report.id}`}
              className="rounded-3xl border border-[#d4e4d2] bg-white p-5 shadow-sm transition hover:border-[#9fcca7] hover:shadow-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#12351d]">
                    {report.category}
                  </h2>
                  <p className="mt-2 text-sm text-[#587160]">
                    Создано: {formatDate(report.created_at)}
                  </p>
                </div>
                <ReportStatusBadge status={report.status} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-3xl bg-[#f3f7f1] p-6 text-sm leading-6 text-[#587160]">
          По выбранным статусам заявок пока нет.
        </div>
      )}
    </>
  );
}
