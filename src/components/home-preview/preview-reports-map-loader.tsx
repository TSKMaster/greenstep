"use client";

import dynamic from "next/dynamic";
import type { ReportListItem } from "@/types";

const PreviewReportsMap = dynamic(
  () =>
    import("@/components/home-preview/preview-reports-map").then(
      (module) => module.PreviewReportsMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] rounded-[28px] bg-[#eaf2ea]" />
    ),
  },
);

type PreviewReportsMapLoaderProps = {
  currentUserId: string | null;
  reports: ReportListItem[];
};

export function PreviewReportsMapLoader({
  currentUserId,
  reports,
}: PreviewReportsMapLoaderProps) {
  return <PreviewReportsMap currentUserId={currentUserId} reports={reports} />;
}
