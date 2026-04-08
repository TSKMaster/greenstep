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
  MessageSquare,
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
  isAdmin: boolean;
  myReports: number;
  myResolvedReports: number;
  rating: number;
  reports: ReportListItem[];
  resolvedReports: number;
  totalReports: number;
};

type DemoArea = "challenge" | "community" | "nav";

type DemoMessage = {
  area: DemoArea;
  text: string;
} | null;

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

function getStatusText(value: string) {
  switch (value) {
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

function getShortCategory(category: string) {
  if (category.includes("контейнер")) {
    return "Контейнеры";
  }

  if (category.includes("свал")) {
    return "Свалки";
  }

  return "Пункты сбора";
}

export function MainRedesignPreview({
  activeReports,
  currentUserId,
  ecoIndex,
  ecoLabel,
  email,
  isAdmin,
  myReports,
  myResolvedReports,
  rating,
  reports,
  resolvedReports,
  totalReports,
}: MainRedesignPreviewProps) {
  const [demoMessage, setDemoMessage] = useState<DemoMessage>(null);
  const latestReports = reports.slice(0, 2);
  const communityActivityCount = Math.max(2, Math.min(totalReports, 9));

  function openDemo(area: DemoArea, text: string) {
    setDemoMessage({ area, text });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#edf3ee] px-6 py-6">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.36]"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(237,243,238,0.44),rgba(237,243,238,0.62))]" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <header className="rounded-[32px] border border-[#c9ddc7] bg-[#4f9663] px-4 py-2 shadow-[0_14px_30px_rgba(52,102,65,0.15)]">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
            <div className="flex items-center justify-start">
              <div className="flex items-center gap-0">
                <div className="flex h-[58px] w-[58px] items-center justify-center overflow-hidden">
                  <Image
                    src="/GreenStepLogo.svg"
                    alt="GreenStep logo"
                    width={64}
                    height={64}
                    className="h-[4.35rem] w-auto object-contain"
                  />
                </div>
                <p className="text-[31px] font-semibold tracking-[-0.04em] text-[#f7fbf3]">
                  GreenStep
                </p>
              </div>
            </div>

            <div className="min-w-0">
              <div className="relative mx-auto h-[72px] max-w-[420px] rounded-[22px] border border-white/10 bg-white/8 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="pointer-events-none absolute left-1/2 top-2 flex -translate-x-1/2 items-center gap-1.5 text-[#f3fbf2]">
                  <Leaf size={14} className="text-[#dff5dd]" strokeWidth={2} />
                  <p className="text-center text-[9px] font-semibold uppercase leading-none tracking-[0.14em]">
                    Эко-индекс района
                  </p>
                </div>
                <div className="grid h-full grid-cols-[60px_minmax(0,1fr)] items-center gap-3 pb-1.5 pt-1.5">
                  <div
                    className="flex h-[58px] w-[58px] shrink-0 items-center justify-center self-center rounded-full p-[6px]"
                    style={getGaugeStyle(ecoIndex)}
                  >
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#4f9663] text-[#f7fbf3]">
                      <p className="text-[18px] font-semibold leading-none">{ecoIndex}</p>
                      <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-[0.12em] text-[#f0fbef]">
                        {ecoLabel}
                      </p>
                    </div>
                  </div>

                  <div className="grid min-w-0 grid-cols-3 items-center gap-1.5 self-end pb-1 text-[#f7fbf3]">
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-[8.5px] uppercase tracking-[0.12em] text-[#f0fbef]">
                        Обращения
                      </p>
                      <p className="mt-1 text-[19px] font-semibold leading-none">{activeReports}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-[8.5px] uppercase tracking-[0.12em] text-[#f0fbef]">
                        Мероприятия
                      </p>
                      <p className="mt-1 text-[19px] font-semibold leading-none">{resolvedReports}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-[8.5px] uppercase tracking-[0.12em] text-[#f0fbef]">
                        Решено
                      </p>
                      <p className="mt-1 text-[19px] font-semibold leading-none">{resolvedReports}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <div className="rounded-[18px] bg-white/14 px-3 py-1.5 text-[#f7fbf3] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                <p className="text-[9px] uppercase tracking-[0.16em] text-[#dceadb]">
                  {isAdmin ? "Администратор" : "Пользователь"}
                </p>
                <p className="mt-1 text-[12px] font-medium">{email}</p>
                <p className="mt-1 text-[12px] font-semibold">{rating} баллов</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  openDemo("nav", "Уведомления находятся в разработке.")
                }
                className="grid h-9 w-9 place-items-center rounded-full border border-white/35 bg-white/18 text-[#f7fbf3] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:bg-white/24"
              >
                <Bell size={20} className="text-[#f7fbf3]" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => openDemo("nav", "Сообщения находятся в разработке.")}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/35 bg-white/18 text-[#f7fbf3] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:bg-white/24"
              >
                <MessageSquare size={20} className="text-[#f7fbf3]" strokeWidth={2} />
              </button>
            </div>
          </div>
        </header>

        {demoMessage ? (
          <div className="mt-3 rounded-[24px] border border-[#d4e4d2] bg-[#f7fbf6] px-4 py-3 text-sm text-[#35533c] shadow-sm">
            {demoMessage.text}
          </div>
        ) : null}

        <section className="mt-3 rounded-[32px] border border-[#cfe0cd] bg-white px-4 py-2 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
          <div className="grid grid-cols-5 gap-3">
            <Link
              href="/preview/main-redesign"
              className="flex items-center justify-between rounded-[18px] border border-[#b7e8c1] bg-[#d9f6de] px-4 py-2 text-[15px] font-semibold text-[#12351d] shadow-[inset_1px_0_0_#1bc36a]"
            >
              <span className="flex items-center gap-3">
                <House size={20} className="text-[#12351d]" strokeWidth={2} />
                <span>Главная</span>
              </span>
            </Link>
            <Link
              href="/statistics"
              className="flex items-center rounded-[18px] bg-[#f3f7f1] px-4 py-2 text-[15px] font-medium text-[#173221] transition hover:bg-[#edf4ea]"
            >
              <span className="flex items-center gap-3">
                <BarChart3 size={20} className="text-[#173221]" strokeWidth={2} />
                <span>Статистика</span>
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
                onClick={() =>
                  openDemo("nav", `Раздел «${item as string}» находится в разработке.`)
                }
                className="flex items-center rounded-[18px] bg-[#f3f7f1] px-4 py-2 text-left text-[15px] font-medium text-[#173221] transition hover:bg-[#edf4ea]"
              >
                <span className="flex items-center gap-3">
                  {iconNode}
                  <span>{item as string}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-3 grid grid-cols-[300px_minmax(0,1fr)_320px] gap-4">
          <div className="flex min-h-[760px] flex-col gap-3">
            <section className="rounded-[30px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-[18px] font-semibold text-[#12351d]">
                    <FileText size={20} className="text-[#2f8734]" strokeWidth={2} />
                    <span>Заявки</span>
                  </h2>
                </div>
              </div>

              <div className="mt-3 space-y-2.5">
                <Link
                  href="/reports"
                  className="flex items-center justify-between rounded-[18px] bg-[#f3f7f1] px-4 py-3 text-[#173221] transition hover:bg-[#edf4ea]"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-[15px] bg-white text-[#2f8734] shadow-sm">
                      <FileText size={22} className="text-[#2f8734]" strokeWidth={2} />
                    </span>
                    <span className="text-[14px] font-medium">Всего заявок</span>
                  </div>
                  <p className="text-[35px] font-semibold leading-none tracking-[-0.05em] text-[#12351d]">
                    {totalReports}
                  </p>
                </Link>
                <Link
                  href="/my-reports"
                  className="flex items-center justify-between rounded-[18px] bg-[#f3f7f1] px-4 py-3 text-[#173221] transition hover:bg-[#edf4ea]"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-[15px] bg-white text-[#2f8734] shadow-sm">
                      <FileText size={22} className="text-[#2f8734]" strokeWidth={2} />
                    </span>
                    <span className="text-[14px] font-medium">Моих</span>
                  </div>
                  <p className="text-[35px] font-semibold leading-none tracking-[-0.05em] text-[#12351d]">
                    {myReports}
                  </p>
                </Link>
                <Link
                  href="/my-reports"
                  className="flex items-center justify-between rounded-[18px] bg-[#f3f7f1] px-4 py-3 text-[#173221] transition hover:bg-[#edf4ea]"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-[15px] bg-white text-[#2f8734] shadow-sm">
                      <CheckCircle2 size={22} className="text-[#2f8734]" strokeWidth={2} />
                    </span>
                    <span className="text-[14px] font-medium">Моих решено</span>
                  </div>
                  <p className="text-[35px] font-semibold leading-none tracking-[-0.05em] text-[#12351d]">
                    {myResolvedReports}
                  </p>
                </Link>
              </div>
            </section>

            <section className="min-h-[330px] rounded-[30px] border border-[#d4e4d2] bg-white px-4 py-3 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-[18px] font-semibold text-[#12351d]">
                  <Users size={20} className="text-[#2f8734]" strokeWidth={2} />
                  <span>Сообщество</span>
                </h2>
                <div className="rounded-full bg-[#ebf5e9] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2f8d3f]">
                  {communityActivityCount} актив.
                </div>
              </div>
              <div className="mt-2 rounded-[18px] bg-[#f3f7f1] px-4 py-2">
                <p className="text-[13px] leading-5 font-medium text-[#23442d]">
                  В фокусе: локальные инициативы рядом с активными точками.
                </p>
              </div>
              <div className="mt-2.5 space-y-2">
                {[...latestReports, ...reports.slice(2, 3)].slice(0, 1).map((report) => (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() =>
                      openDemo(
                        "community",
                        `Карточка «${getShortCategory(report.category)}» пока открывает demo-сообщение.`,
                      )
                    }
                    className="flex w-full items-center justify-between rounded-[18px] bg-[#f3f7f1] px-4 py-2.5 text-left transition hover:bg-[#edf4ea]"
                  >
                    <div>
                      <p className="text-[17px] font-semibold leading-5 text-[#12351d]">
                        {report.address ?? getShortCategory(report.category)}
                      </p>
                      <p className="mt-1 text-[14px] leading-5 text-[#5d7361]">
                        {getStatusText(report.status)} · соседи следят за обновлениями
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2f8d3f]">
                      Обсуждение
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    openDemo("community", "Инициативы сообщества находятся в разработке.")
                  }
                  className="w-full rounded-[18px] border border-[#d4e4d2] bg-white px-4 py-2 text-[15px] font-medium text-[#28452e] transition hover:bg-[#f6faf5]"
                >
                  Предложить инициативу
                </button>
              </div>
            </section>
          </div>

          <div className="flex min-h-[760px] flex-col gap-3">
            <section className="rounded-[30px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="flex items-center gap-2 text-[18px] font-semibold text-[#12351d]">
                    <Map size={20} className="text-[#2f8734]" strokeWidth={2} />
                    <span>Карта района</span>
                  </h2>
                  <p className="mt-2 text-sm text-[#587160]">
                    Реальные заявки проекта на карте с demo-фильтрами
                  </p>
                </div>
                <Link
                  href="/map"
                  className="rounded-full border border-[#d4e4d2] bg-white px-5 py-3 text-sm font-semibold text-[#28452e] transition hover:bg-[#f6faf5]"
                >
                  Развернуть карту
                </Link>
              </div>

              <div className="mt-4">
                <PreviewReportsMapLoader currentUserId={currentUserId} reports={reports} />
              </div>
            </section>

            <Link
              href="/reports/new"
              className="mt-1 inline-flex w-full items-center justify-center rounded-[22px] bg-[#2f8734] px-5 py-5 text-[17px] font-semibold text-white shadow-[0_18px_30px_rgba(47,135,52,0.28)] transition hover:bg-[#286f2c]"
              style={{ color: "#ffffff" }}
            >
              Сообщить о проблеме
            </Link>
          </div>

          <div className="flex min-h-[760px] flex-col gap-3">
            <section className="rounded-[30px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
              <h2 className="flex items-center gap-2 text-[18px] font-semibold text-[#12351d]">
                <BarChart3 size={20} className="text-[#2f8734]" strokeWidth={2} />
                <span>Статистика</span>
              </h2>
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
                  <div
                    key={label}
                    className="rounded-[18px] bg-[#f3f7f1] px-4 py-4"
                  >
                    <p className="text-[12px] uppercase tracking-[0.12em] text-[#6c8770]">{label}</p>
                    <p className="mt-2.5 text-[29px] font-semibold leading-none tracking-[-0.03em] text-[#12351d]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[30px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
              <h2 className="flex items-center gap-2 text-[18px] font-semibold text-[#12351d]">
                <Trophy size={20} className="text-[#2f8734]" strokeWidth={2} />
                <span>Челлендж</span>
              </h2>
              <p className="mt-2 text-sm text-[#587160]">Короткий demo-челлендж</p>
              <h3 className="mt-3 text-[16px] font-semibold text-[#12351d]">
                7 дней без лишнего пластика
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#4f6856]">
                Выполнено 5 из 7 дней. Награда после завершения.
              </p>
              <div className="mt-4 h-3 rounded-full bg-[#e2ebdf]">
                <div className="h-full w-[72%] rounded-full bg-[#2f8734]" />
              </div>
              <div className="mt-4 flex items-center justify-between rounded-[20px] bg-[#f3f7f1] px-4 py-4">
                <div>
                  <p className="text-[15px] font-medium text-[#173221]">Превью награды</p>
                  <p className="mt-1 text-sm text-[#6b7f71]">Эко-значок активиста</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    openDemo("challenge", "Раздел с наградами находится в разработке.")
                  }
                  className="rounded-full border border-[#d4e4d2] bg-white px-5 py-3 text-sm font-semibold text-[#28452e] transition hover:bg-[#f6faf5]"
                >
                  Подробнее
                </button>
              </div>
            </section>
          </div>
        </section>

      </div>
    </main>
  );
}
