"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import { useMap } from "react-leaflet";
import { getReportMarkerIcon } from "@/components/map/report-map-theme";
import { DEFAULT_MAP_CENTER } from "@/lib/constants";
import type { ReportListItem } from "@/types";

function getStatusText(status: ReportListItem["status"]) {
  switch (status) {
    case "resolved":
      return "Решено";
    case "in_progress":
      return "В работе";
    case "accepted":
      return "Принято";
    case "rejected":
      return "Отклонено";
    default:
      return "Новая";
  }
}

function getStatusTheme(status: ReportListItem["status"]) {
  switch (status) {
    case "new":
      return {
        background: "#e0f2fe",
        color: "#0369a1",
      };
    case "accepted":
      return {
        background: "#fef3c7",
        color: "#b45309",
      };
    case "in_progress":
      return {
        background: "#ede9fe",
        color: "#6d28d9",
      };
    case "resolved":
      return {
        background: "#ebf5e9",
        color: "#2f8d3f",
      };
    case "rejected":
      return {
        background: "#ffe4e6",
        color: "#be123c",
      };
    default:
      return {
        background: "#e5e7eb",
        color: "#475569",
      };
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildPreviewReportHref(
  reportId: string,
  basePath: string,
  previewModeEnabled: boolean,
) {
  const params = new URLSearchParams();

  if (previewModeEnabled) {
    params.set("mode", "guest");
  }

  params.set("report", reportId);

  return `${basePath}?${params.toString()}`;
}

function buildGuestAuthTrigger(label: string) {
  return `
    <button
      type="button"
      class="preview-report-popup__link preview-report-popup__link--primary"
      onclick="window.dispatchEvent(new CustomEvent('greenstep:guest-auth-required')); return false;"
    >
      ${label}
    </button>
  `;
}

function buildReportPopupMarkup({
  report,
  currentUserId,
  basePath,
  previewModeEnabled,
}: {
  report: ReportListItem;
  currentUserId: string | null;
  basePath: string;
  previewModeEnabled: boolean;
}) {
  const title = escapeHtml(report.address || report.category);
  const category = escapeHtml(report.category);
  const status = escapeHtml(getStatusText(report.status));
  const statusTheme = getStatusTheme(report.status);
  const description = escapeHtml(report.description);
  const shortDescription =
    description.length > 110 ? `${description.slice(0, 107)}...` : description;
  const detailsHref = currentUserId
    ? `/reports/${report.id}`
    : buildPreviewReportHref(report.id, basePath, previewModeEnabled);
  const isOwnReport = Boolean(currentUserId && report.user_id === currentUserId);
  const isGuest = !currentUserId;
  const actions = isOwnReport
    ? `<a class="preview-report-popup__link preview-report-popup__link--primary" href="${detailsHref}">Перейти</a>`
    : isGuest
      ? buildGuestAuthTrigger("Открыть заявку")
      : `
      <div class="preview-report-popup__actions">
        <a class="preview-report-popup__link preview-report-popup__link--ghost" href="${detailsHref}">Перейти</a>
        <a class="preview-report-popup__link preview-report-popup__link--primary" href="${detailsHref}">Поддержать</a>
      </div>
    `;

  return `
    <div class="preview-report-popup">
      <p class="preview-report-popup__eyebrow">${category}</p>
      <h3 class="preview-report-popup__title">${title}</h3>
      <div class="preview-report-popup__meta">
        <span class="preview-report-popup__status" style="background:${statusTheme.background};color:${statusTheme.color};">${status}</span>
        <span class="preview-report-popup__support">Поддержка: ${report.support_count}</span>
      </div>
      <p class="preview-report-popup__body">${shortDescription}</p>
      ${actions}
    </div>
  `;
}

type ClusteredReportMarkersProps = {
  basePath: string;
  currentUserId: string | null;
  previewModeEnabled: boolean;
  reports: ReportListItem[];
};

export function ClusteredReportMarkers({
  basePath,
  currentUserId,
  previewModeEnabled,
  reports,
}: ClusteredReportMarkersProps) {
  const map = useMap();

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      disableClusteringAtZoom: 18,
      maxClusterRadius: 40,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: (cluster) =>
        L.divIcon({
          className: "preview-marker-cluster",
          html: `<span>${cluster.getChildCount()}</span>`,
          iconSize: [42, 42],
        }),
    } as L.MarkerClusterGroupOptions & { chunkedLoading: boolean });

    reports.forEach((report) => {
      const marker = L.marker(
        [
          Number(report.latitude ?? DEFAULT_MAP_CENTER.lat),
          Number(report.longitude ?? DEFAULT_MAP_CENTER.lng),
        ],
        { icon: getReportMarkerIcon(report.category) },
      );

      marker.bindPopup(
        buildReportPopupMarkup({
          report,
          currentUserId,
          basePath,
          previewModeEnabled,
        }),
        {
          className: "preview-report-popup-shell",
          closeButton: false,
          maxWidth: 280,
          minWidth: 240,
          offset: [0, -10],
        },
      );

      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
      clusterGroup.clearLayers();
    };
  }, [basePath, currentUserId, map, previewModeEnabled, reports]);

  return null;
}
