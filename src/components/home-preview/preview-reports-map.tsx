"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { ClusteredReportMarkers } from "@/components/map/clustered-report-markers";
import {
  REPORT_CATEGORY_ORDER,
  ReportMapLegend,
  getReportCategoryCounts,
} from "@/components/map/report-map-theme";
import { DEFAULT_MAP_CENTER } from "@/lib/constants";
import type { ReportCategory, ReportListItem } from "@/types";

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

type PreviewReportsMapProps = {
  basePath: string;
  currentUserId: string | null;
  expandHref: string;
  expandLabel: string;
  previewModeEnabled: boolean;
  reports: ReportListItem[];
};

export function PreviewReportsMap({
  basePath,
  currentUserId,
  expandHref,
  expandLabel,
  previewModeEnabled,
  reports,
}: PreviewReportsMapProps) {
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
    <div className="flex flex-col gap-3">
      <div className="relative h-[420px] overflow-hidden rounded-[28px] border border-[#d4e4d2]">
        <div className="absolute right-4 top-4 z-[500] hidden w-[180px] lg:block">
          <ReportMapLegend
            className="pointer-events-auto w-full lg:max-w-none"
            counts={categoryCounts}
            onToggleCategory={handleToggleCategory}
            selectedCategories={selectedCategories}
          />
        </div>
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
            basePath={basePath}
            currentUserId={currentUserId}
            previewModeEnabled={previewModeEnabled}
            reports={filteredReports}
          />
        </MapContainer>
        <Link
          href={expandHref}
          className="absolute right-5 bottom-5 z-[700] rounded-full border border-[#d4e4d2] bg-white/96 px-4 py-2 text-sm font-semibold text-[#28452e] shadow-sm transition hover:bg-[#f6faf5]"
        >
          {expandLabel}
        </Link>
      </div>
      <div className="lg:hidden">
        <ReportMapLegend
          counts={categoryCounts}
          onToggleCategory={handleToggleCategory}
          selectedCategories={selectedCategories}
        />
      </div>
    </div>
  );
}
