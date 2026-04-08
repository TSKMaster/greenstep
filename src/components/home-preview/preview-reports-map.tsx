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

function ClusteredMarkers({ reports }: PreviewReportsMapProps) {
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

      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
      clusterGroup.clearLayers();
    };
  }, [map, reports]);

  return null;
}

type PreviewReportsMapProps = {
  reports: ReportListItem[];
};

export function PreviewReportsMap({ reports }: PreviewReportsMapProps) {
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
        <ClusteredMarkers reports={reports} />
      </MapContainer>
    </div>
  );
}
