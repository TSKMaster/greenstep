"use client";

import dynamic from "next/dynamic";

const ReportLocationPicker = dynamic(
  () =>
    import("@/components/reports/report-location-picker").then(
      (module) => module.ReportLocationPicker,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-[28px] bg-surface-muted p-6 text-sm text-foreground/80">
        Карта выбора точки загружается...
      </div>
    ),
  },
);

type ReportLocationPickerLoaderProps = {
  latitude: number;
  longitude: number;
  onChange: (nextLatitude: number, nextLongitude: number) => void;
};

export function ReportLocationPickerLoader({
  latitude,
  longitude,
  onChange,
}: ReportLocationPickerLoaderProps) {
  return (
    <ReportLocationPicker
      latitude={latitude}
      longitude={longitude}
      onChange={onChange}
    />
  );
}
