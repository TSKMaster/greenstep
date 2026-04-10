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
  basePath: string;
  currentUserId: string | null;
  expandHref: string;
  expandLabel: string;
  previewModeEnabled: boolean;
  reports: ReportListItem[];
};

export function PreviewReportsMapLoader({
  basePath,
  currentUserId,
  expandHref,
  expandLabel,
  previewModeEnabled,
  reports,
}: PreviewReportsMapLoaderProps) {
  return (
    <PreviewReportsMap
      basePath={basePath}
      currentUserId={currentUserId}
      expandHref={expandHref}
      expandLabel={expandLabel}
      previewModeEnabled={previewModeEnabled}
      reports={reports}
    />
  );
}
