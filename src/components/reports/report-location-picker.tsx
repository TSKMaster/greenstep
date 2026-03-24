"use client";

import { icon } from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
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
  latitude: number;
  longitude: number;
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

export function ReportLocationPicker({
  latitude,
  longitude,
  onChange,
}: ReportLocationPickerProps) {
  const center = [
    Number.isFinite(latitude) ? latitude : DEFAULT_MAP_CENTER.lat,
    Number.isFinite(longitude) ? longitude : DEFAULT_MAP_CENTER.lng,
  ] as const;

  return (
    <div className="overflow-hidden rounded-[28px] border border-border bg-white">
      <MapContainer
        center={center}
        zoom={16}
        scrollWheelZoom
        className="h-72 w-full"
        whenReady={(event) => {
          window.setTimeout(() => {
            event.target.invalidateSize();
          }, 0);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onChange={onChange} />
        <Marker position={center} icon={markerIcon} />
      </MapContainer>
    </div>
  );
}
