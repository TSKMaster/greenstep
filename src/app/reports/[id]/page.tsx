import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  CalendarDays,
  FileText,
  MapPinned,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AppShellChrome } from "@/components/layout/app-shell-chrome";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { SupportReportButton } from "@/components/reports/support-report-button";
import { getCurrentUserWithProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReportListItem } from "@/types";

type ReportDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#d4e4d2] bg-[#f7fbf6] px-4 py-4 shadow-[0_10px_24px_rgba(59,94,57,0.05)]">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[16px] bg-white text-[#2f8734] shadow-sm">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6c8770]">
            {label}
          </p>
          <p className="mt-2 text-[15px] font-medium leading-6 text-[#23442d]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function ReportDetailsPage({
  params,
}: ReportDetailsPageProps) {
  const { id } = await params;
  const { profile, user } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const supabase = await createSupabaseServerClient();
  const [{ data, error }, { data: supportRow }] = await Promise.all([
    supabase
      .from("reports")
      .select(
        "id, user_id, address, admin_comment, category, created_at, description, is_anonymous, latitude, longitude, photo_url, status, support_count",
      )
      .eq("id", id)
      .single(),
    supabase
      .from("report_supports")
      .select("report_id")
      .eq("report_id", id)
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  if (error || !data) {
    notFound();
  }

  const report = data as ReportListItem;
  const hasSupported = Boolean(supportRow);
  const isOwnReport = report.user_id === user.id;
  const email = user.email ?? profile?.email ?? "";
  const displayName = profile?.full_name ?? user.user_metadata?.full_name ?? null;
  const rating = profile?.rating ?? 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#edf3ee] px-3 py-3 pb-28 sm:px-4 sm:py-4 sm:pb-32 lg:px-6 lg:py-5 lg:pb-6">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.36]"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(237,243,238,0.44),rgba(237,243,238,0.62))]" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <AppShellChrome
          displayName={displayName}
          email={email}
          isAdmin={Boolean(profile?.is_admin)}
          rating={rating}
          title="Карточка заявки"
        />

        <section className="mt-3 rounded-[28px] border border-[#d4e4d2] bg-white p-5 shadow-[0_14px_30px_rgba(59,94,57,0.08)] lg:rounded-[32px] lg:p-8">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_380px]">
            <div className="flex flex-col gap-5">
              <section className="rounded-[28px] border border-[#d4e4d2] bg-[#fcfefd] px-5 py-5 shadow-[0_10px_24px_rgba(59,94,57,0.05)]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-[760px]">
                    <div className="flex items-center gap-3">
                      <h1 className="text-[30px] font-semibold leading-[1.02] tracking-[-0.05em] text-[#12351d] lg:text-[38px]">
                        {report.category}
                      </h1>
                      <ReportStatusBadge status={report.status} />
                    </div>
                    <p className="mt-3 text-[15px] leading-6 text-[#5b7160] lg:text-base">
                      {report.description}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(59,94,57,0.06)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6c8770]">
                      Создано
                    </p>
                    <p className="mt-2 text-[16px] font-medium leading-6 text-[#23442d]">
                      {formatDate(report.created_at)}
                    </p>
                  </div>
                </div>
              </section>

              {report.photo_url ? (
                <section className="overflow-hidden rounded-[28px] border border-[#d4e4d2] bg-[#f8fbf8] shadow-[0_12px_28px_rgba(59,94,57,0.06)]">
                  <div className="relative h-[280px] sm:h-[380px] lg:h-[480px]">
                    <Image
                      src={report.photo_url}
                      alt="Фото заявки"
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                </section>
              ) : (
                <section className="rounded-[28px] border border-dashed border-[#cfe0cd] bg-[#f8fbf8] px-5 py-12 text-center text-[#6c8770]">
                  Фото к заявке не прикреплено.
                </section>
              )}

              <section className="rounded-[28px] border border-[#d4e4d2] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(59,94,57,0.05)]">
                <div className="flex items-center gap-2">
                  <MessageSquareText size={20} className="text-[#2f8734]" strokeWidth={2} />
                  <h2 className="text-[22px] font-semibold tracking-[-0.04em] text-[#12351d]">
                    Комментарий администратора
                  </h2>
                </div>
                <p className="mt-4 text-[15px] leading-7 text-[#506754]">
                  {report.admin_comment || "Комментарий пока не добавлен."}
                </p>
              </section>
            </div>

            <aside className="flex flex-col gap-5">
              <section className="rounded-[28px] border border-[#d4e4d2] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(59,94,57,0.05)]">
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-[#2f8734]" strokeWidth={2} />
                  <h2 className="text-[22px] font-semibold tracking-[-0.04em] text-[#12351d]">
                    Информация по заявке
                  </h2>
                </div>

                <div className="mt-4 grid gap-3">
                  <InfoCard
                    icon={<MapPinned size={20} strokeWidth={2} />}
                    label="Адрес"
                    value={report.address || "Не указан"}
                  />
                  <InfoCard
                    icon={<CalendarDays size={20} strokeWidth={2} />}
                    label="Поддержка"
                    value={String(report.support_count)}
                  />
                  <InfoCard
                    icon={<ShieldCheck size={20} strokeWidth={2} />}
                    label="Анонимная отправка"
                    value={report.is_anonymous ? "Да" : "Нет"}
                  />
                  <InfoCard
                    icon={<FileText size={20} strokeWidth={2} />}
                    label="Координаты"
                    value={`${report.latitude}, ${report.longitude}`}
                  />
                </div>
              </section>

              <section className="rounded-[28px] border border-[#d4e4d2] bg-[#f7fbf6] px-5 py-5 shadow-[0_10px_24px_rgba(59,94,57,0.06)]">
                <h2 className="text-[22px] font-semibold tracking-[-0.04em] text-[#12351d]">
                  Действия
                </h2>

                <div className="mt-4 flex flex-col gap-3">
                  {isOwnReport ? (
                    <div className="inline-flex w-full items-center justify-center rounded-[20px] bg-slate-100 px-4 py-3 text-center font-semibold text-slate-700">
                      Это твоя заявка
                    </div>
                  ) : hasSupported ? (
                    <div className="inline-flex w-full items-center justify-center rounded-[20px] bg-emerald-100 px-4 py-3 text-center font-semibold text-emerald-800">
                      Ты уже поддержал это обращение
                    </div>
                  ) : (
                    <SupportReportButton reportId={report.id} />
                  )}

                  <Link
                    href="/reports"
                    className="inline-flex items-center justify-center rounded-[20px] border border-[#d4e4d2] bg-white px-4 py-3 font-semibold text-[#28452e] transition hover:bg-[#f6faf5]"
                  >
                    Назад к списку
                  </Link>
                </div>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
