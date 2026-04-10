"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FilePlus } from "lucide-react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { ClusteredReportMarkers } from "@/components/map/clustered-report-markers";
import {
  REPORT_CATEGORY_ORDER,
  ReportMapLegend,
  getReportCategoryCounts,
} from "@/components/map/report-map-theme";
import { DEFAULT_MAP_CENTER } from "@/lib/constants";
import type { ReportCategory, ReportListItem } from "@/types";

type ReportsMapProps = {
  currentUserId: string | null;
  reports: ReportListItem[];
  showCreateCta?: boolean;
};

function ResizeMapOnMount() {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [map]);

  return null;
}

export function ReportsMap({
  currentUserId,
  reports,
  showCreateCta = false,
}: ReportsMapProps) {
  const [selectedCategories, setSelectedCategories] =
    useState<ReportCategory[]>(REPORT_CATEGORY_ORDER);

  const categoryCounts = useMemo(() => getReportCategoryCounts(reports), [reports]);
  const filteredReports = useMemo(
    () =>
      reports.filter((report) => selectedCategories.includes(report.category)),
    [reports, selectedCategories],
  );

  function handleToggleCategory(category: ReportCategory) {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  }

  return (
    <div className="relative h-[720px] overflow-hidden rounded-[28px] border border-border">
      <div className="absolute right-4 top-4 z-[500] flex w-[240px] flex-col items-center gap-3">
        <ReportMapLegend
          className="pointer-events-auto w-full"
          counts={categoryCounts}
          onToggleCategory={handleToggleCategory}
          selectedCategories={selectedCategories}
        />
        {showCreateCta ? (
          <Link
            href="/reports/new"
            aria-label="Новое обращение"
            className="pointer-events-auto hidden items-center justify-center gap-2 rounded-full bg-[#2f8734] px-5 py-3 text-sm font-semibold !text-white shadow-[0_14px_24px_rgba(47,135,52,0.24)] transition hover:bg-[#286f2c] lg:inline-flex"
            style={{ color: "#ffffff" }}
          >
            <FilePlus size={18} strokeWidth={2.2} className="text-white" />
            Новое обращение
          </Link>
        ) : null}
      </div>
      {showCreateCta ? (
        <Link
          href="/reports/new"
          aria-label="Новое обращение"
          className="fixed bottom-[92px] right-4 z-[1300] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#2f8734] !text-white shadow-[0_18px_32px_rgba(47,135,52,0.3)] transition hover:bg-[#286f2c] lg:hidden"
          style={{ color: "#ffffff" }}
        >
          <FilePlus size={22} strokeWidth={2.3} className="text-white" />
        </Link>
      ) : null}
      <MapContainer
        center={[DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng]}
        zoom={15}
        scrollWheelZoom
        className="h-full w-full"
      >
        <ResizeMapOnMount />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClusteredReportMarkers
          basePath="/"
          currentUserId={currentUserId}
          previewModeEnabled={false}
          reports={filteredReports}
        />
      </MapContainer>
    </div>
  );
}
