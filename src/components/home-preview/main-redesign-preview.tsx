"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  BarChart3,
  Bell,
  BookOpenText,
  CheckCircle2,
  FileText,
  House,
  Leaf,
  ListTodo,
  Map,
  Trophy,
  Users,
} from "lucide-react";
import { PreviewReportsMapLoader } from "@/components/home-preview/preview-reports-map-loader";
import type { ReportListItem } from "@/types";

type MainRedesignPreviewProps = {
  activeReports: number;
  currentUserId: string | null;
  ecoIndex: number;
  ecoLabel: string;
  email: string;
  initialSelectedReportId: string | null;
  isAdmin: boolean;
  myReports: number;
  myResolvedReports: number;
  rating: number;
  reports: ReportListItem[];
  resolvedReports: number;
  resolvedThisMonth: number;
  totalReports: number;
  viewerMode: "guest" | "authorized";
};

type DemoArea = "challenge" | "community" | "nav";

type DemoMessage = {
  area: DemoArea;
  text: string;
} | null;

function DemoBadge({ label = "Demo" }: { label?: string }) {
  return (
    <span className="rounded-full border border-[#d7e5d5] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6c8770]">
      {label}
    </span>
  );
}

function getGaugeStyle(value: number) {
  return {
    background: `conic-gradient(
      #2f8d3f 0deg ${Math.max(value, 12) * 2.1}deg,
      #72bb43 ${Math.max(value, 12) * 2.1}deg 235deg,
      #f3b03e 235deg 285deg,
      #e46e47 285deg 360deg
    )`,
  };
}

function buildGuestReportHref(reportId: string) {
  return `/preview/main-redesign?mode=guest&report=${encodeURIComponent(reportId)}`;
}

export function MainRedesignPreview({
  activeReports,
  currentUserId,
  ecoIndex,
  ecoLabel,
  email,
  initialSelectedReportId,
  isAdmin,
  myReports,
  myResolvedReports,
  rating,
  reports,
  resolvedReports,
  resolvedThisMonth,
  totalReports,
  viewerMode,
}: MainRedesignPreviewProps) {
  const [demoMessage, setDemoMessage] = useState<DemoMessage>(null);
  const isGuestView = viewerMode === "guest";
  const selectedGuestReport =
    reports.find((report) => report.id === initialSelectedReportId) ?? reports[0] ?? null;
  const signInHref = "/auth/sign-in";
  const primaryCtaHref = isGuestView ? signInHref : "/reports/new";
  const secondaryCtaHref = isGuestView ? signInHref : "/my-reports";
  const guestMapExpandHref = selectedGuestReport
    ? buildGuestReportHref(selectedGuestReport.id)
    : "/preview/main-redesign?mode=guest";
  const userBadgeInitial = email.trim().charAt(0).toLowerCase() || "g";
  const reportSummaryItems = isGuestView
    ? [
        {
          href: "/preview/main-redesign?mode=guest",
          icon: <FileText size={22} className="text-[#2f8734]" strokeWidth={2} />,
          label: "Всего заявок",
          value: totalReports,
        },
        {
          href: "/preview/main-redesign?mode=guest",
          icon: <CheckCircle2 size={22} className="text-[#2f8734]" strokeWidth={2} />,
          label: "Решено за 30 дней",
          value: resolvedThisMonth,
        },
        {
          href: "/preview/main-redesign?mode=guest",
          icon: <Map size={22} className="text-[#2f8734]" strokeWidth={2} />,
          label: "В работе",
          value: activeReports,
        },
      ]
    : [
        {
          href: "/reports",
          icon: <FileText size={22} className="text-[#2f8734]" strokeWidth={2} />,
          label: "Всего заявок",
          value: totalReports,
        },
        {
          href: "/my-reports",
          icon: <FileText size={22} className="text-[#2f8734]" strokeWidth={2} />,
          label: "Моих",
          value: myReports,
        },
        {
          href: "/my-reports",
          icon: <CheckCircle2 size={22} className="text-[#2f8734]" strokeWidth={2} />,
          label: "Моих решено",
          value: myResolvedReports,
        },
      ];

  function openDemo(area: DemoArea, text: string) {
    setDemoMessage({ area, text });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#edf3ee] px-3 py-3 pb-28 sm:px-4 sm:py-4 sm:pb-32 lg:px-6 lg:py-6 lg:pb-6">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.36]"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(237,243,238,0.44),rgba(237,243,238,0.62))]" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <header className="rounded-[28px] border border-[#c9ddc7] bg-[#4f9663] px-3 py-3 shadow-[0_14px_30px_rgba(52,102,65,0.15)] sm:px-4 lg:rounded-[32px] lg:py-2">
          <div className="flex flex-nowrap items-center justify-between gap-3">
            <div className="flex items-center justify-start">
              <div className="flex items-center gap-0">
                <div className="flex h-[48px] w-[48px] items-center justify-center overflow-hidden sm:h-[52px] sm:w-[52px] lg:h-[58px] lg:w-[58px]">
                  <Image
                    src="/GreenStepLogo.svg"
                    alt="GreenStep logo"
                    width={64}
                    height={64}
                    className="h-[3.5rem] w-auto object-contain sm:h-[3.8rem] lg:h-[4.35rem]"
                  />
                </div>
                <p className="text-[24px] font-semibold tracking-[-0.04em] text-[#f7fbf3] sm:text-[27px] lg:text-[31px]">
                  GreenStep
                </p>
              </div>
            </div>

            <div className="hidden min-w-0 md:block">
              <div className="relative mx-auto h-[68px] max-w-full rounded-[20px] border border-white/10 bg-white/8 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:h-[72px] md:max-w-[420px] lg:rounded-[22px]">
                <div className="pointer-events-none absolute left-1/2 top-2 flex -translate-x-1/2 items-center gap-1 text-[#f3fbf2] sm:gap-1.5">
                  <Leaf size={13} className="text-[#dff5dd] sm:h-[14px] sm:w-[14px]" strokeWidth={2} />
                  <p className="text-center text-[8px] font-semibold uppercase leading-none tracking-[0.14em] sm:text-[9px]">
                    Эко-индекс района
                  </p>
                </div>
                <div className="grid h-full grid-cols-[54px_minmax(0,1fr)] items-center gap-2 pb-1.5 pt-1.5 sm:grid-cols-[60px_minmax(0,1fr)] sm:gap-3">
                  <div
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center self-center rounded-full p-[5px] sm:h-[58px] sm:w-[58px] sm:p-[6px]"
                    style={getGaugeStyle(ecoIndex)}
                  >
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#4f9663] text-[#f7fbf3]">
                      <p className="text-[16px] font-semibold leading-none sm:text-[18px]">{ecoIndex}</p>
                      <p className="mt-0.5 text-[6px] font-semibold uppercase tracking-[0.12em] text-[#f0fbef] sm:text-[7px]">
                        {ecoLabel}
                      </p>
                    </div>
                  </div>

                  <div className="grid min-w-0 grid-cols-3 items-center gap-1 self-end pb-1 text-[#f7fbf3] sm:gap-1.5">
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-[7px] uppercase tracking-[0.1em] text-[#f0fbef] sm:text-[8.5px] sm:tracking-[0.12em]">
                        Обращения
                      </p>
                      <p className="mt-1 text-[16px] font-semibold leading-none sm:text-[19px]">{activeReports}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-[7px] uppercase tracking-[0.1em] text-[#f0fbef] sm:text-[8.5px] sm:tracking-[0.12em]">
                        Инициативы
                      </p>
                      <p className="mt-1 text-[16px] font-semibold leading-none sm:text-[19px]">{resolvedReports}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-[7px] uppercase tracking-[0.1em] text-[#f0fbef] sm:text-[8.5px] sm:tracking-[0.12em]">
                        Решено
                      </p>
                      <p className="mt-1 text-[16px] font-semibold leading-none sm:text-[19px]">{resolvedReports}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex min-w-0 items-center justify-end gap-2 sm:flex-nowrap">
              {isGuestView ? (
                <>
                  <Link
                    href={signInHref}
                    className="rounded-full border border-white/30 bg-white/14 px-3 py-2 text-xs font-semibold text-[#f7fbf3] transition hover:bg-white/20 sm:px-4 sm:text-sm"
                  >
                    Вход
                  </Link>
                  <Link
                    href={signInHref}
                    className="rounded-full bg-[#f7fbf3] px-3 py-2 text-xs font-semibold text-[#1d5b2b] transition hover:bg-[#edf7ea] sm:px-4 sm:text-sm"
                  >
                    Регистрация
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex min-w-0 items-center gap-2 rounded-full bg-white/14 px-2 py-1.5 text-[#f7fbf3] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] sm:min-w-[220px] sm:gap-3 sm:px-3 sm:py-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173221] text-[16px] font-semibold lowercase text-white sm:h-10 sm:w-10 sm:text-[18px]">
                      {userBadgeInitial}
                    </div>
                    <div className="min-w-0 leading-none">
                      <p className="hidden text-[8px] uppercase tracking-[0.14em] text-[#dceadb] sm:block sm:text-[9px]">
                        {isAdmin ? "Администратор" : "Пользователь"}
                      </p>
                      <p className="mt-1 truncate text-[11px] font-medium text-[#f7fbf3] sm:text-[12px]">{email}</p>
                      <p className="mt-1 text-[11px] text-[#e0eee0] sm:text-[12px]">{rating} баллов</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openDemo("nav", "Уведомления находятся в разработке.")}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/35 bg-white/18 text-[#f7fbf3] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:bg-white/24"
                  >
                    <Bell size={20} className="text-[#f7fbf3]" strokeWidth={2} />
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {demoMessage ? (
          <div className="mt-3 rounded-[24px] border border-[#d4e4d2] bg-[#f7fbf6] px-4 py-3 text-sm text-[#35533c] shadow-sm">
            {demoMessage.text}
          </div>
        ) : null}

        <section className="fixed inset-x-3 bottom-3 z-[1200] rounded-[24px] border border-[#cfe0cd] bg-white/96 px-2 py-2 shadow-[0_18px_40px_rgba(59,94,57,0.16)] backdrop-blur md:inset-x-4 md:bottom-4 lg:static lg:mt-3 lg:rounded-[32px] lg:bg-white lg:px-4 lg:py-2 lg:shadow-[0_14px_30px_rgba(59,94,57,0.08)] lg:backdrop-blur-0">
          <div className="grid grid-cols-5 gap-2 lg:gap-3">
            <Link
              href="/preview/main-redesign"
              className="flex items-center justify-center rounded-[18px] border border-[#b7e8c1] bg-[#d9f6de] px-2 py-3 text-[15px] font-semibold text-[#12351d] shadow-[inset_1px_0_0_#1bc36a] lg:justify-between lg:px-4 lg:py-2"
            >
              <span className="flex items-center gap-0 lg:gap-3">
                <House size={20} className="text-[#12351d]" strokeWidth={2} />
                <span className="hidden lg:inline">Главная</span>
              </span>
            </Link>
            <Link
              href="/statistics"
              className="flex items-center justify-center rounded-[18px] bg-[#f3f7f1] px-2 py-3 text-[15px] font-medium text-[#173221] transition hover:bg-[#edf4ea] lg:justify-between lg:px-4 lg:py-2"
            >
              <span className="flex items-center gap-0 lg:gap-3">
                <BarChart3 size={20} className="text-[#173221]" strokeWidth={2} />
                <span className="hidden lg:inline">Статистика</span>
              </span>
              <span className="hidden lg:inline-flex">
                <DemoBadge />
              </span>
            </Link>
            {[
              ["Задания", <ListTodo key="tasks" size={20} className="text-[#173221]" strokeWidth={2} />],
              ["Обучение", <BookOpenText key="learn" size={20} className="text-[#173221]" strokeWidth={2} />],
              ["Сообщество", <Users key="community" size={20} className="text-[#173221]" strokeWidth={2} />],
            ].map(([item, iconNode]) => (
              <button
                key={item as string}
                type="button"
                onClick={() => openDemo("nav", `Раздел «${item as string}» находится в разработке.`)}
                className="flex items-center justify-center rounded-[18px] bg-[#f3f7f1] px-2 py-3 text-left text-[15px] font-medium text-[#173221] transition hover:bg-[#edf4ea] lg:justify-between lg:px-4 lg:py-2"
              >
                <span className="flex items-center gap-0 lg:gap-3">
                  {iconNode}
                  <span className="hidden lg:inline">{item as string}</span>
                </span>
                <span className="hidden lg:inline-flex">
                  <DemoBadge />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-3 grid grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
          <div className="order-2 flex flex-col gap-3 xl:order-1 xl:min-h-[760px]">
            <section className="rounded-[30px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-[18px] font-semibold text-[#12351d]">
                    <FileText size={20} className="text-[#2f8734]" strokeWidth={2} />
                    <span>{isGuestView ? "Пульс района" : "Заявки"}</span>
                  </h2>
                  <p className="mt-2 text-sm text-[#587160]">
                    {isGuestView
                      ? "Публичная сводка по обращениям: видно масштаб, динамику и то, где нужна поддержка."
                      : "Персональная панель по обращениям и вашему прогрессу в GreenStep."}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-2.5">
                {reportSummaryItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between rounded-[18px] bg-[#f3f7f1] px-4 py-3 text-[#173221] transition hover:bg-[#edf4ea]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-[15px] bg-white text-[#2f8734] shadow-sm">
                        {item.icon}
                      </span>
                      <span className="text-[14px] font-medium">{item.label}</span>
                    </div>
                    <p className="text-[35px] font-semibold leading-none tracking-[-0.05em] text-[#12351d]">
                      {item.value}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-[30px] border border-[#d4e4d2] bg-white px-4 py-3 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-[18px] font-semibold text-[#12351d]">
                  <Users size={20} className="text-[#2f8734]" strokeWidth={2} />
                  <span>Сообщество</span>
                </h2>
                <DemoBadge />
              </div>
              {!isGuestView ? (
                <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.08em] text-[#6b7f71]">
                  ТОП-3 обсуждений:
                </p>
              ) : null}
              {isGuestView ? (
                <div className="mt-2 rounded-[18px] bg-[#f3f7f1] px-4 py-2">
                  <p className="text-[13px] leading-5 font-medium text-[#23442d]">
                    В фокусе: кто уже двигает район вперёд и какие инициативы собирают соседей.
                  </p>
                </div>
              ) : null}
              <div className="mt-2.5 space-y-2">
                {isGuestView ? (
                  <>
                    {[
                      ["Айша", "420 баллов", "Запустила сортировку пластика у трёх домов"],
                      ["Тимур", "365 баллов", "Собрал соседей на весеннюю уборку двора"],
                      ["Салтанат", "310 баллов", "Следит за обновлениями по обращениям района"],
                    ].map(([name, score, text]) => (
                      <div key={name} className="rounded-[18px] bg-[#f3f7f1] px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[16px] font-semibold text-[#12351d]">{name}</p>
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2f8d3f]">
                            {score}
                          </span>
                        </div>
                        <p className="mt-2 text-[14px] leading-5 text-[#5d7361]">{text}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      "Высадка деревьев у школы",
                      "Субботник у набережной",
                      "Как улучшить точки сбора?",
                    ].map((title) => (
                      <div key={title} className="rounded-[18px] bg-[#f3f7f1] px-4 py-3">
                        <p className="text-[16px] font-semibold text-[#12351d]">{title}</p>
                      </div>
                    ))}
                  </>
                )}
                <button
                  type="button"
                  onClick={() => openDemo("community", "Инициативы сообщества находятся в разработке.")}
                  className="mx-auto flex w-fit rounded-[18px] border border-[#d4e4d2] bg-white px-5 py-1.5 text-[14px] font-medium text-[#6b6659] transition hover:bg-[#f6faf5]"
                >
                  Предложить инициативу
                </button>
              </div>
            </section>
          </div>

          <div className="order-1 flex flex-col gap-3 xl:order-2 xl:min-h-[760px]">
            <section className="rounded-[30px] border border-[#d4e4d2] bg-white px-5 py-5 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
              <h1 className="max-w-[620px] text-[28px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#12351d] sm:text-[32px] lg:text-[34px]">
                Экологические обращения района
              </h1>
              <p className="mt-3 max-w-[620px] text-[15px] leading-6 text-[#587160] sm:text-[16px] sm:leading-7">
                Сообщайте о проблемах на карте, прикрепляйте фото и отслеживайте статус обращения.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href={primaryCtaHref}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#2f8734] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_18px_30px_rgba(47,135,52,0.22)] transition hover:bg-[#286f2c] sm:w-auto"
                  style={{ color: "#ffffff" }}
                >
                  Сообщить о проблеме
                </Link>
                <Link
                  href={secondaryCtaHref}
                  className="inline-flex w-full items-center justify-center rounded-full border border-[#d4e4d2] bg-white px-6 py-3 text-[15px] font-semibold text-[#28452e] transition hover:bg-[#f6faf5] sm:w-auto"
                >
                  Список заявок
                </Link>
                <div className="inline-flex w-full items-center justify-between rounded-full border border-[#cfe0cd] bg-[#f3f7f1] p-1 sm:w-auto sm:justify-start">
                  <Link
                    href="/preview/main-redesign?mode=guest"
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isGuestView
                        ? "bg-white text-[#173221] shadow-sm"
                        : "text-[#6a7d6d] hover:text-[#173221]"
                    }`}
                  >
                    Гость
                  </Link>
                  <Link
                    href="/preview/main-redesign?mode=auth"
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      !isGuestView
                        ? "bg-white text-[#173221] shadow-sm"
                        : "text-[#6a7d6d] hover:text-[#173221]"
                    }`}
                  >
                    Авторизован
                  </Link>
                </div>
              </div>
            </section>

            <section className="rounded-[30px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
              <div>
                <h2 className="flex items-center gap-2 text-[18px] font-semibold text-[#12351d]">
                  <Map size={20} className="text-[#2f8734]" strokeWidth={2} />
                  <span>Карта обращений района</span>
                </h2>
              </div>

              <div className="relative mt-4">
                <PreviewReportsMapLoader
                  currentUserId={isGuestView ? null : currentUserId}
                  reports={reports}
                />
                <Link
                  href={isGuestView ? guestMapExpandHref : "/map"}
                  className="absolute right-5 bottom-5 z-[700] rounded-full border border-[#d4e4d2] bg-white/96 px-4 py-2 text-sm font-semibold text-[#28452e] shadow-sm transition hover:bg-[#f6faf5]"
                >
                  {isGuestView ? "Открыть выбранную заявку" : "Развернуть карту"}
                </Link>
              </div>
            </section>

            <section className="rounded-[30px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(59,94,57,0.08)] md:hidden">
              <div className="relative rounded-[22px] bg-[#4f9663] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="pointer-events-none absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-1 text-[#f3fbf2]">
                  <Leaf size={13} className="text-[#dff5dd]" strokeWidth={2} />
                  <p className="text-center text-[8px] font-semibold uppercase leading-none tracking-[0.14em]">
                    Эко-индекс района
                  </p>
                </div>
                <div className="grid grid-cols-[54px_minmax(0,1fr)] items-center gap-2 pt-4">
                  <div
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center self-center rounded-full p-[5px]"
                    style={getGaugeStyle(ecoIndex)}
                  >
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#4f9663] text-[#f7fbf3]">
                      <p className="text-[16px] font-semibold leading-none">{ecoIndex}</p>
                      <p className="mt-0.5 text-[6px] font-semibold uppercase tracking-[0.12em] text-[#f0fbef]">
                        {ecoLabel}
                      </p>
                    </div>
                  </div>

                  <div className="grid min-w-0 grid-cols-3 items-center gap-1 self-end pb-1 text-[#f7fbf3]">
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-[7px] uppercase tracking-[0.1em] text-[#f0fbef]">Обращения</p>
                      <p className="mt-1 text-[16px] font-semibold leading-none">{activeReports}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-[7px] uppercase tracking-[0.1em] text-[#f0fbef]">Инициативы</p>
                      <p className="mt-1 text-[16px] font-semibold leading-none">{resolvedReports}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-[7px] uppercase tracking-[0.1em] text-[#f0fbef]">Решено</p>
                      <p className="mt-1 text-[16px] font-semibold leading-none">{resolvedReports}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="order-3 flex flex-col gap-3 xl:min-h-[760px]">
            {isGuestView ? (
              <>
                <section className="rounded-[30px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="flex items-center gap-2 text-[18px] font-semibold text-[#12351d]">
                      <BarChart3 size={20} className="text-[#2f8734]" strokeWidth={2} />
                      <span>Обзор района</span>
                    </h2>
                    <DemoBadge />
                  </div>
                  <p className="mt-2 text-sm text-[#587160]">
                    Публичный срез для гостя: видно темп района, текущую нагрузку и куда сейчас смотрят соседи.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      ["Активных точек", String(activeReports)],
                      ["Решено за месяц", String(resolvedThisMonth)],
                      ["Поддержек", String(selectedGuestReport?.support_count ?? 0)],
                      ["Эко-индекс", String(ecoIndex)],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[18px] bg-[#f3f7f1] px-4 py-4">
                        <p className="text-[12px] uppercase tracking-[0.12em] text-[#6c8770]">{label}</p>
                        <p className="mt-2.5 text-[29px] font-semibold leading-none tracking-[-0.03em] text-[#12351d]">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <section className="rounded-[30px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-[18px] font-semibold text-[#12351d]">
                    <BarChart3 size={20} className="text-[#2f8734]" strokeWidth={2} />
                    <span>Статистика</span>
                  </h2>
                  <DemoBadge />
                </div>
                <p className="mt-2 text-sm text-[#587160]">
                  Смешение реальных и demo-метрик
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    ["Качество воздуха", "72%"],
                    ["Переработка", "18 т"],
                    ["Обращения", String(activeReports)],
                    ["Динамика", "+12%"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[18px] bg-[#f3f7f1] px-4 py-4">
                      <p className="text-[12px] uppercase tracking-[0.12em] text-[#6c8770]">{label}</p>
                      <p className="mt-2.5 text-[29px] font-semibold leading-none tracking-[-0.03em] text-[#12351d]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-[30px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-[18px] font-semibold text-[#12351d]">
                  <Trophy size={20} className="text-[#2f8734]" strokeWidth={2} />
                  <span>{isGuestView ? "Челленджи района" : "Челлендж"}</span>
                </h2>
                <DemoBadge />
              </div>
              <p className="mt-2 text-sm text-[#587160]">
                {isGuestView
                  ? "Promo-слой для конкурсного MVP: участие открывается после входа, а витрина помогает почувствовать активность района."
                  : "Короткий demo-челлендж"}
              </p>
              <h3 className="mt-3 text-[16px] font-semibold text-[#12351d]">
                {isGuestView ? "Неделя соседских экопривычек" : "7 дней без лишнего пластика"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#4f6856]">
                {isGuestView
                  ? "Жители выбирают простые действия на неделю: сортировка дома, отказ от одноразового пластика и поддержка локальных заявок."
                  : "Выполнено 5 из 7 дней. Награда после завершения."}
              </p>
              <div className="mt-4 h-3 rounded-full bg-[#e2ebdf]">
                <div
                  className={`h-full rounded-full bg-[#2f8734] ${isGuestView ? "w-[58%]" : "w-[72%]"}`}
                />
              </div>
              <div className="mt-4 flex items-center justify-between rounded-[20px] bg-[#f3f7f1] px-4 py-4">
                <div>
                  <p className="text-[15px] font-medium text-[#173221]">
                    {isGuestView ? "Уже участвуют 24 соседа" : "Превью награды"}
                  </p>
                  <p className="mt-1 text-sm text-[#6b7f71]">
                    {isGuestView
                      ? "Вход откроет участие, историю прогресса и персональные награды."
                      : "Эко-значок активиста"}
                  </p>
                </div>
                {isGuestView ? (
                  <Link
                    href={signInHref}
                    className="rounded-full border border-[#d4e4d2] bg-white px-5 py-3 text-sm font-semibold text-[#28452e] transition hover:bg-[#f6faf5]"
                  >
                    Хочу участвовать
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => openDemo("challenge", "Раздел с наградами находится в разработке.")}
                    className="rounded-full border border-[#d4e4d2] bg-white px-5 py-3 text-sm font-semibold text-[#28452e] transition hover:bg-[#f6faf5]"
                  >
                    Подробнее
                  </button>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
