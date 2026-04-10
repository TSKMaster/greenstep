"use client";

import dynamic from "next/dynamic";
import type { ReportListItem } from "@/types";

const ReportsMap = dynamic(
  () =>
    import("@/components/map/reports-map").then((module) => module.ReportsMap),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-[28px] bg-surface-muted p-6 text-sm text-foreground/80">
        Карта загружается...
      </div>
    ),
  },
);

type ReportsMapLoaderProps = {
  currentUserId: string | null;
  reports: ReportListItem[];
  showCreateCta?: boolean;
};

export function ReportsMapLoader({
  currentUserId,
  reports,
  showCreateCta = false,
}: ReportsMapLoaderProps) {
  return (
    <ReportsMap
      currentUserId={currentUserId}
      reports={reports}
      showCreateCta={showCreateCta}
    />
  );
}
