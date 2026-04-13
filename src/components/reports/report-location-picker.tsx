"use client";

import { useEffect } from "react";
import { icon } from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { DEFAULT_MAP_CENTER } from "@/lib/constants";

const markerIcon = icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
  iconSize: [25, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type ReportLocationPickerProps = {
  latitude: number | null;
  longitude: number | null;
  onChange: (nextLatitude: number, nextLongitude: number) => void;
};

function MapClickHandler({
  onChange,
}: Pick<ReportLocationPickerProps, "onChange">) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function ResizeMapOnMount() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const invalidate = () => {
      map.invalidateSize();
    };
    const timer = window.setTimeout(invalidate, 0);
    const resizeObserver = new ResizeObserver(() => {
      invalidate();
    });

    resizeObserver.observe(container);

    return () => {
      window.clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [map]);

  return null;
}

export function ReportLocationPicker({
  latitude,
  longitude,
  onChange,
}: ReportLocationPickerProps) {
  const hasMarker =
    Number.isFinite(latitude) && Number.isFinite(longitude);
  const center: [number, number] = [
    hasMarker ? (latitude as number) : DEFAULT_MAP_CENTER.lat,
    hasMarker ? (longitude as number) : DEFAULT_MAP_CENTER.lng,
  ];

  return (
    <div className="overflow-hidden rounded-[28px] border border-border bg-white lg:h-full">
      <MapContainer
        center={center}
        zoom={16}
        scrollWheelZoom
        className="h-72 w-full lg:h-full"
      >
        <ResizeMapOnMount />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onChange={onChange} />
        {hasMarker ? <Marker position={center} icon={markerIcon} /> : null}
      </MapContainer>
    </div>
  );
}
