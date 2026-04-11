"use client";

import { divIcon } from "leaflet";
import type { DivIcon } from "leaflet";
import type { ReportCategory, ReportListItem } from "@/types";

type CategoryTheme = {
  color: string;
  label: string;
};

export const REPORT_CATEGORY_THEMES: Record<ReportCategory, CategoryTheme> = {
  "Переполненные контейнеры": {
    color: "#D97706",
    label: "Переполненные контейнеры",
  },
  "Стихийная свалка": {
    color: "#DC2626",
    label: "Стихийная свалка",
  },
  "Нет контейнеров": {
    color: "#2563EB",
    label: "Нет контейнеров",
  },
  "Загрязнение территории": {
    color: "#059669",
    label: "Загрязнение территории",
  },
  "Повреждение инфраструктуры": {
    color: "#7C3AED",
    label: "Повреждение инфраструктуры",
  },
};

export const REPORT_CATEGORY_ORDER = Object.keys(
  REPORT_CATEGORY_THEMES,
) as ReportCategory[];

const markerIconCache = new Map<ReportCategory, DivIcon>();

export function getReportCategoryTheme(category: ReportCategory) {
  return REPORT_CATEGORY_THEMES[category];
}

export function getReportMarkerIcon(category: ReportCategory) {
  const cachedIcon = markerIconCache.get(category);
  if (cachedIcon) {
    return cachedIcon;
  }

  const { color } = getReportCategoryTheme(category);
  const iconInstance = divIcon({
    className: "report-map-marker-shell",
    html: `
      <div style="position:relative;width:28px;height:38px;">
        <div style="position:absolute;left:50%;top:2px;width:24px;height:24px;background:${color};border:3px solid #ffffff;border-radius:999px;transform:translateX(-50%);box-shadow:0 6px 16px rgba(15,23,42,0.28);"></div>
        <div style="position:absolute;left:50%;top:20px;width:14px;height:14px;background:${color};transform:translateX(-50%) rotate(45deg);border-radius:2px;box-shadow:0 6px 16px rgba(15,23,42,0.2);"></div>
        <div style="position:absolute;left:50%;top:10px;width:6px;height:6px;background:#ffffff;border-radius:999px;transform:translateX(-50%);"></div>
      </div>
    `,
    iconAnchor: [14, 36],
    iconSize: [28, 38],
    popupAnchor: [0, -34],
  });

  markerIconCache.set(category, iconInstance);
  return iconInstance;
}

export function getReportCategoryCounts(reports: ReportListItem[]) {
  return REPORT_CATEGORY_ORDER.reduce(
    (acc, category) => {
      acc[category] = reports.filter((report) => report.category === category).length;
      return acc;
    },
    {} as Record<ReportCategory, number>,
  );
}

type ReportMapLegendProps = {
  className?: string;
  counts?: Record<ReportCategory, number>;
  selectedCategories?: ReportCategory[];
  onToggleCategory?: (category: ReportCategory) => void;
};

export function ReportMapLegend({
  className = "",
  counts,
  selectedCategories,
  onToggleCategory,
}: ReportMapLegendProps) {
  const selectedSet = new Set(selectedCategories ?? REPORT_CATEGORY_ORDER);
  const isInteractive = Boolean(onToggleCategory);

  return (
    <div
      className={`w-full max-w-none rounded-[20px] border border-[#d4e4d2] bg-white/28 px-3 py-2.5 shadow-[0_14px_24px_rgba(59,94,57,0.14)] backdrop-blur lg:max-w-[180px] ${className}`.trim()}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6c8770]">
        Легенда карты
      </p>
      <div className="mt-2.5 grid grid-cols-2 gap-x-2 gap-y-1.5 lg:grid-cols-1">
        {REPORT_CATEGORY_ORDER.map((category) => {
          const theme = REPORT_CATEGORY_THEMES[category];
          const isActive = selectedSet.has(category);
          const count = counts?.[category] ?? 0;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onToggleCategory?.(category)}
              className={`grid w-full grid-cols-[10px_minmax(0,1fr)_auto] items-start gap-x-2 rounded-[12px] px-1.5 py-1.5 text-left transition ${
                isInteractive ? "cursor-pointer hover:bg-white/35" : "cursor-default"
              } ${
                isActive ? "text-[#24442d]" : "text-[#708676] opacity-55"
              }`}
              aria-pressed={isActive}
            >
              <span
                className="mt-[3px] h-2.5 w-2.5 shrink-0 self-start rounded-full border border-white shadow-sm"
                style={{ backgroundColor: theme.color }}
              />
              <span className="min-w-0 text-[12px] leading-[1.25]">
                {theme.label.split(" ").map((word) => (
                  <span key={`${category}-${word}`} className="block">
                    {word}
                  </span>
                ))}
              </span>
              <span
                className={`mt-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none ${
                  isActive ? "bg-white/75 text-[#1f4129]" : "bg-white/45 text-[#6f8474]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
