import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  Activity,
  Leaf,
  MapPinned,
  Recycle,
  TreePine,
  Wind,
} from "lucide-react";
import { AppShellChrome } from "@/components/layout/app-shell-chrome";
import { getCurrentUserWithProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { calculateEcoIndex } from "@/lib/statistics";
import type { ReportListItem } from "@/types";

function DemoBadge() {
  return (
    <span className="inline-flex rounded-full border border-[#d8e7d6] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6c8770]">
      Demo
    </span>
  );
}

function MetricCard({
  icon,
  label,
  value,
  caption,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <article className="rounded-[24px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[18px] border border-[#d7e5d5] bg-[#f7fbf6] text-[#2f8734]">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold leading-5 text-[#12351d]">{label}</p>
          <p className="mt-1 text-[30px] font-semibold leading-none tracking-[-0.04em] text-[#12351d]">
            {value}
          </p>
          <p className="mt-2 text-sm leading-5 text-[#5f7462]">{caption}</p>
        </div>
      </div>
    </article>
  );
}

function StatSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-[#d4e4d2] bg-white px-5 py-5 shadow-[0_14px_30px_rgba(59,94,57,0.08)] lg:px-6 lg:py-6">
      <h2 className="text-[24px] font-semibold tracking-[-0.04em] text-[#12351d]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ActivityChart({ values }: { values: number[] }) {
  const width = 100;
  const height = 44;
  const padding = 4;
  const max = Math.max(...values, 1);
  const step = values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0;
  const points = values
    .map((value, index) => {
      const x = padding + step * index;
      const y = height - padding - ((value / max) * (height - padding * 2));
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-[24px] border border-[#d4e4d2] bg-[#fcfefd] p-4">
      <div className="flex items-end justify-between gap-2 text-[11px] text-[#7a8e7d]">
        <span>Нояб</span>
        <span>Дек</span>
        <span>Янв</span>
        <span>Фев</span>
        <span>Мар</span>
      </div>
      <div className="mt-3 h-[180px] rounded-[20px] bg-[linear-gradient(180deg,#f9fcf8,#f3f8f3)] p-3">
        <svg viewBox="0 0 100 44" className="h-full w-full overflow-visible">
          {[0, 1, 2, 3].map((row) => {
            const y = 8 + row * 10;
            return (
              <line
                key={row}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="#d9e6d8"
                strokeWidth="0.6"
                strokeDasharray="2 2"
              />
            );
          })}
          <polyline
            fill="none"
            stroke="#58a562"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
          {values.map((value, index) => {
            const x = padding + step * index;
            const y = height - padding - ((value / max) * (height - padding * 2));
            return <circle key={`${value}-${index}`} cx={x} cy={y} r="1.7" fill="#2f8734" />;
          })}
        </svg>
      </div>
    </div>
  );
}

function DonutChart({ data }: { data: { label: string; value: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const colors = ["#57a462", "#8ac08a", "#c7dfba", "#e1edd8"];
  const segments = data.reduce<
    { label: string; value: number; color: string; start: number; end: number }[]
  >((acc, item, index) => {
    const previousEnd = acc.length > 0 ? acc[acc.length - 1].end : 0;
    const end = previousEnd + (item.value / total) * 100;
    acc.push({
      ...item,
      color: colors[index % colors.length],
      start: previousEnd,
      end,
    });
    return acc;
  }, []);

  const gradient = segments
    .map((segment) => `${segment.color} ${segment.start}% ${segment.end}%`)
    .join(", ");

  return (
    <div className="grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center">
      <div
        className="mx-auto flex h-[170px] w-[170px] items-center justify-center rounded-full border border-white/70 bg-white/70 shadow-[0_18px_40px_rgba(59,94,57,0.12)] backdrop-blur-[2px]"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-white text-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#6c8770]">Всего</p>
            <p className="mt-1 text-[28px] font-semibold leading-none tracking-[-0.04em] text-[#12351d]">{total}%</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center justify-between gap-3 rounded-[18px] bg-[#f7fbf6] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
              <span className="text-[15px] font-medium text-[#26412d]">{segment.label}</span>
            </div>
            <span className="text-[15px] font-semibold text-[#12351d]">{segment.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function StatisticsPage() {
  const { profile, user } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("reports")
    .select(
      "id, address, category, created_at, description, is_anonymous, latitude, longitude, status, support_count",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить статистику.");
  }

  const reports = (data ?? []) as ReportListItem[];
  const totalReports = reports.length;
  const ecoIndex = calculateEcoIndex(reports);
  const resolvedReports = reports.filter((report) => report.status === "resolved").length;
  const supportCount = reports.reduce((sum, report) => sum + report.support_count, 0);
  const recycledKg = totalReports > 0 ? (totalReports * 0.8).toFixed(1) : "2.4";
  const trees = totalReports > 0 ? Math.max(12, resolvedReports * 3) : 12;

  const reportsByMonth = (() => {
    const now = new Date();
    return Array.from({ length: 5 }).map((_, index) => {
      const bucketDate = new Date(now.getFullYear(), now.getMonth() - (4 - index), 1);
      return reports.filter((report) => {
        if (!report.created_at) return false;
        const createdAt = new Date(report.created_at);
        return (
          createdAt.getFullYear() === bucketDate.getFullYear() &&
          createdAt.getMonth() === bucketDate.getMonth()
        );
      }).length || [12, 15, 31, 22, 41][index];
    });
  })();

  const categoryShare = [
    { label: "Пластик", value: 40 },
    { label: "Бумага", value: 35 },
    { label: "Стекло", value: 15 },
    { label: "Металл", value: 10 },
  ];

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
          title="Статистика"
          titleBadge="Demo"
        />

        <section className="mt-3 rounded-[28px] border border-[#d4e4d2] bg-white p-5 shadow-[0_14px_30px_rgba(59,94,57,0.08)] lg:rounded-[32px] lg:p-8">
          <div className="flex flex-col gap-5">
            <div className="max-w-[760px]">
              <div className="flex items-center gap-3">
                <h1 className="text-[30px] font-semibold leading-none tracking-[-0.05em] text-[#12351d] lg:text-[38px]">
                  Экологическая статистика
                </h1>
                <DemoBadge />
              </div>
              <p className="mt-3 max-w-[600px] text-[15px] leading-6 text-[#5b7160] lg:text-base">
                Данные по состоянию района. Здесь объединены реальные метрики из обращений и demo-визуализация для конкурсного MVP.
              </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <MetricCard
                icon={<Wind size={28} strokeWidth={1.9} />}
                label="Качество воздуха"
                value={`Индекс AQI: ${ecoIndex}`}
                caption="Хорошее качество воздуха"
              />
              <MetricCard
                icon={<Recycle size={28} strokeWidth={1.9} />}
                label="Отходы отправленные на переработку"
                value={`${recycledKg} т`}
                caption="За последний месяц"
              />
              <MetricCard
                icon={<MapPinned size={28} strokeWidth={1.9} />}
                label="Сообщено проблем"
                value={String(totalReports || 38)}
                caption="За 3 месяца"
              />
              <MetricCard
                icon={<TreePine size={28} strokeWidth={1.9} />}
                label="Экологические мероприятия"
                value={String(trees)}
                caption="Субботники и акции"
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
              <StatSection title="Динамика обращений жителей">
                <p className="mb-3 text-sm leading-5 text-[#5f7462]">Последние 5 месяцев</p>
                <ActivityChart values={reportsByMonth} />
              </StatSection>

              <StatSection title="Структура переработанных отходов">
                <DonutChart data={categoryShare} />
              </StatSection>
            </div>

            <StatSection title="Вклад жителей района">
              <div className="grid gap-3 xl:grid-cols-3">
                {[
                  {
                    icon: <Activity size={20} className="text-[#2f8734]" strokeWidth={2} />,
                    label: `Выполнено эко-челленджей: ${Math.max(124, supportCount + 124)}`,
                  },
                  {
                    icon: <MapPinned size={20} className="text-[#2f8734]" strokeWidth={2} />,
                    label: `Сообщено проблем: ${totalReports || 38}`,
                  },
                  {
                    icon: <Leaf size={20} className="text-[#2f8734]" strokeWidth={2} />,
                    label: `Посажено деревьев: ${trees + 15}`,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-[22px] border border-[#d4e4d2] bg-[#f7fbf6] px-4 py-4">
                    <span className="grid h-11 w-11 place-items-center rounded-[16px] bg-white">{item.icon}</span>
                    <p className="text-[16px] font-medium leading-6 text-[#23442d]">{item.label}</p>
                  </div>
                ))}
              </div>
            </StatSection>
          </div>
        </section>
      </div>
    </main>
  );
}



