import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  BadgeCheck,
  BookOpenText,
  Leaf,
  MapPinned,
  Recycle,
  Shield,
  Sprout,
  TreePine,
} from "lucide-react";
import { AppShellChrome } from "@/components/layout/app-shell-chrome";
import { getCurrentUserWithProfile } from "@/lib/auth";
import type { ReportListItem } from "@/types";

function getEcoLevel(rating: number) {
  if (rating >= 400) {
    return {
      level: 4,
      title: "Эко-активист",
      nextMilestone: 0,
    };
  }

  if (rating >= 250) {
    return {
      level: 3,
      title: "Активный житель района",
      nextMilestone: 400 - rating,
    };
  }

  if (rating >= 120) {
    return {
      level: 2,
      title: "Участник GreenStep",
      nextMilestone: 250 - rating,
    };
  }

  return {
    level: 1,
    title: "Новый участник",
    nextMilestone: 120 - rating,
  };
}

function getAvatarSeed(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <article className="rounded-[24px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_12px_24px_rgba(59,94,57,0.06)]">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[18px] border border-[#d7e5d5] bg-[#f7fbf6] text-[#2f8734]">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold leading-5 text-[#12351d]">{label}</p>
          <p className="mt-2 text-[34px] font-semibold leading-none tracking-[-0.05em] text-[#12351d]">
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}

function AchievementBadge({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-h-[126px] flex-col items-center justify-center rounded-[24px] border border-[#d4e4d2] bg-white px-4 py-4 text-center shadow-[0_12px_24px_rgba(59,94,57,0.06)]">
      <div className="grid h-16 w-16 place-items-center rounded-full border border-[#d7e5d5] bg-[#f7fbf6] text-[#2f8734]">
        {icon}
      </div>
      <p className="mt-3 text-[14px] font-medium leading-5 text-[#23442d]">{label}</p>
    </div>
  );
}

export default async function ProfilePage() {
  const { profile, supabase, user } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const [{ data: reportsData }, { count: supportsCount }] = await Promise.all([
    supabase
      .from("reports")
      .select(
        "id, category, created_at, status, support_count, user_id",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("report_supports")
      .select("report_id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const reports = (reportsData ?? []) as Pick<
    ReportListItem,
    "id" | "category" | "created_at" | "status" | "support_count" | "user_id"
  >[];
  const rating = profile?.rating ?? 0;
  const displayName =
    profile?.full_name ?? user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Пользователь";
  const email = user.email ?? profile?.email ?? "";
  const avatarSeed = getAvatarSeed(displayName) || "GS";
  const ecoLevel = getEcoLevel(rating);

  const resolvedReports = reports.filter((report) => report.status === "resolved").length;
  const ecoInitiatives = Math.max(3, Math.min(12, resolvedReports + 2));
  const learnedMaterials = Math.max(5, Math.min(12, Math.floor(rating / 40) || 5));
  const plantedTrees = Math.max(3, resolvedReports + 1);
  const sortedWaste = Math.max(2, Math.floor((supportsCount ?? 0) / 2) + 2);
  const progressPercent = Math.min(
    ecoLevel.level >= 4 ? 100 : Math.max((rating / 400) * 100, 12),
    100,
  );

  const achievements = [
    {
      icon: <Recycle size={28} strokeWidth={2} />,
      label: "Эко-активист",
    },
    {
      icon: <Sprout size={28} strokeWidth={2} />,
      label: "Начал сортировку",
    },
    {
      icon: <Shield size={28} strokeWidth={2} />,
      label: "Защитник природы",
    },
    {
      icon: <TreePine size={28} strokeWidth={2} />,
      label: "7 дней без пакетов",
    },
  ];

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
          title="Профиль пользователя"
        />

        <section className="mt-3 rounded-[28px] border border-[#d4e4d2] bg-white p-5 shadow-[0_14px_30px_rgba(59,94,57,0.08)] lg:rounded-[32px] lg:p-8">
          <div className="flex flex-col gap-5">
            <section className="rounded-[28px] border border-[#d4e4d2] bg-[#f7fbf6] px-5 py-5 shadow-[0_12px_24px_rgba(59,94,57,0.06)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#f7d88d,#e2b55f_45%,#d18d58_75%,#b56f4f)] text-[28px] font-semibold text-white shadow-[0_16px_28px_rgba(59,94,57,0.12)]">
                    {avatarSeed}
                  </div>
                  <div>
                    <h1 className="text-[30px] font-semibold leading-none tracking-[-0.05em] text-[#12351d] lg:text-[38px]">
                      {displayName}
                    </h1>
                    <p className="mt-2 text-[17px] font-medium text-[#35533c]">{ecoLevel.title}</p>
                    <p className="mt-1 text-sm text-[#6a7d6d]">{email}</p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#d4e4d2] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(59,94,57,0.06)] lg:min-w-[360px]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6c8770]">
                        Уровень {ecoLevel.level}
                      </p>
                      <p className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.04em] text-[#12351d]">
                        {ecoLevel.title}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#1f8bb3] transition hover:text-[#176f8f]"
                    >
                      <BadgeCheck size={16} strokeWidth={2.1} />
                      Обменять баллы
                    </button>
                  </div>

                  <p className="mt-4 text-[15px] leading-6 text-[#46604a]">
                    Эко-рейтинг: <span className="font-semibold">{rating}</span> баллов
                  </p>
                  <p className="mt-1 text-sm leading-5 text-[#6a7d6d]">
                    {ecoLevel.nextMilestone > 0
                      ? `До следующего уровня: ${ecoLevel.nextMilestone} баллов`
                      : "Максимальный уровень для текущего MVP достигнут"}
                  </p>

                  <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[#dfe5dd]">
                    <div
                      className="h-full rounded-full bg-[#57a462]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-[24px] font-semibold tracking-[-0.04em] text-[#12351d]">
                Статистика пользователя
              </h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  icon={<Recycle size={28} strokeWidth={1.9} />}
                  label="Выполнено челленджей"
                  value={Math.max(12, resolvedReports + learnedMaterials)}
                />
                <MetricCard
                  icon={<MapPinned size={28} strokeWidth={1.9} />}
                  label="Сообщено проблем"
                  value={reports.length}
                />
                <MetricCard
                  icon={<TreePine size={28} strokeWidth={1.9} />}
                  label="Экологические инициативы"
                  value={ecoInitiatives}
                />
                <MetricCard
                  icon={<BookOpenText size={28} strokeWidth={1.9} />}
                  label="Изучено материалов"
                  value={learnedMaterials}
                />
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-[24px] font-semibold tracking-[-0.04em] text-[#12351d]">
                Достижения
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {achievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.label}
                    icon={achievement.icon}
                    label={achievement.label}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-[#d4e4d2] bg-[#f7fbf6] px-5 py-5 shadow-[0_10px_24px_rgba(59,94,57,0.06)]">
              <h2 className="text-[24px] font-semibold tracking-[-0.04em] text-[#12351d]">
                Ваш вклад в экологию района
              </h2>
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                {[
                  {
                    icon: <Recycle size={22} className="text-[#2f8734]" strokeWidth={2} />,
                    label: `Отсортировано отходов: ${sortedWaste}`,
                  },
                  {
                    icon: <TreePine size={22} className="text-[#2f8734]" strokeWidth={2} />,
                    label: `Посажено деревьев: ${plantedTrees}`,
                  },
                  {
                    icon: <Leaf size={22} className="text-[#2f8734]" strokeWidth={2} />,
                    label: `Сообщено о проблемах: ${reports.length}`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-[22px] border border-[#d4e4d2] bg-white px-4 py-4"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-[18px] bg-[#f7fbf6]">
                      {item.icon}
                    </span>
                    <p className="text-[15px] font-medium leading-6 text-[#23442d]">{item.label}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
