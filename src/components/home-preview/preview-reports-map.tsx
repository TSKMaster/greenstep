"use client";

import { useEffect } from "react";
import L, { icon } from "leaflet";
import "leaflet.markercluster";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { DEFAULT_MAP_CENTER } from "@/lib/constants";
import type { ReportListItem } from "@/types";

const markerIcon = icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
  iconSize: [25, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildPopupMarkup(report: ReportListItem, currentUserId: string | null) {
  const title = escapeHtml(report.address || report.category);
  const category = escapeHtml(report.category);
  const status = escapeHtml(getStatusText(report.status));
  const description = escapeHtml(report.description);
  const shortDescription =
    description.length > 110 ? `${description.slice(0, 107)}...` : description;
  const detailsHref = `/reports/${report.id}`;
  const isOwnReport = Boolean(currentUserId && report.user_id === currentUserId);
  const actions = isOwnReport
    ? `<a class="preview-report-popup__link preview-report-popup__link--primary" href="${detailsHref}">Перейти</a>`
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
        <span class="preview-report-popup__status">${status}</span>
        <span class="preview-report-popup__support">Поддержка: ${report.support_count}</span>
      </div>
      <p class="preview-report-popup__body">${shortDescription}</p>
      ${actions}
    </div>
  `;
}

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

function ClusteredMarkers({ currentUserId, reports }: PreviewReportsMapProps) {
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
    });

    reports.forEach((report) => {
      const marker = L.marker(
        [
          Number(report.latitude ?? DEFAULT_MAP_CENTER.lat),
          Number(report.longitude ?? DEFAULT_MAP_CENTER.lng),
        ],
        { icon: markerIcon },
      );

      marker.bindPopup(buildPopupMarkup(report, currentUserId), {
        className: "preview-report-popup-shell",
        closeButton: false,
        maxWidth: 280,
        minWidth: 240,
        offset: [0, -24],
      });

      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
      clusterGroup.clearLayers();
    };
  }, [currentUserId, map, reports]);

  return null;
}

type PreviewReportsMapProps = {
  currentUserId: string | null;
  reports: ReportListItem[];
};

export function PreviewReportsMap({
  currentUserId,
  reports,
}: PreviewReportsMapProps) {
  return (
    <div className="h-[464px] overflow-hidden rounded-[28px] border border-[#d4e4d2]">
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
        <ClusteredMarkers currentUserId={currentUserId} reports={reports} />
      </MapContainer>
    </div>
  );
}
