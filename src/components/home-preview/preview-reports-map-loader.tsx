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
  onExpandClick?: (() => void) | null;
  previewModeEnabled: boolean;
  reports: ReportListItem[];
};

export function PreviewReportsMapLoader({
  basePath,
  currentUserId,
  expandHref,
  expandLabel,
  onExpandClick,
  previewModeEnabled,
  reports,
}: PreviewReportsMapLoaderProps) {
  return (
    <PreviewReportsMap
      basePath={basePath}
      currentUserId={currentUserId}
      expandHref={expandHref}
      expandLabel={expandLabel}
      onExpandClick={onExpandClick}
      previewModeEnabled={previewModeEnabled}
      reports={reports}
    />
  );
}
