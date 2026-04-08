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
      <div className="h-[464px] rounded-[28px] bg-[#eaf2ea]" />
    ),
  },
);

type PreviewReportsMapLoaderProps = {
  reports: ReportListItem[];
};

export function PreviewReportsMapLoader({
  reports,
}: PreviewReportsMapLoaderProps) {
  return <PreviewReportsMap reports={reports} />;
}
