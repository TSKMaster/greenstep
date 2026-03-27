"use client";

import { useEffect } from "react";
import { icon } from "leaflet";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { getReportStatusLabel } from "@/components/reports/report-status-badge";
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

type ReportsMapProps = {
  reports: ReportListItem[];
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

export function ReportsMap({ reports }: ReportsMapProps) {
  return (
    <div className="h-[560px] overflow-hidden rounded-[28px] border border-border">
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

        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[
              Number(report.latitude ?? DEFAULT_MAP_CENTER.lat),
              Number(report.longitude ?? DEFAULT_MAP_CENTER.lng),
            ]}
            icon={markerIcon}
          >
            <Popup>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">{report.category}</p>
                <p>{report.description}</p>
                <p>Статус: {getReportStatusLabel(report.status)}</p>
                <p>Поддержка: {report.support_count}</p>
                <Link href={`/reports/${report.id}`} className="text-primary">
                  Открыть заявку
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
