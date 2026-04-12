import { redirect } from "next/navigation";
import {
  ArrowRight,
  Camera,
  Coins,
  Recycle,
  ShoppingBag,
} from "lucide-react";
import { AppShellChrome } from "@/components/layout/app-shell-chrome";
import { getCurrentUserWithProfile } from "@/lib/auth";

type TaskCard = {
  title: string;
  subtitle: string;
  progressLabel: string;
  progressValue: number;
  points: string;
  cta: string;
  icon: React.ReactNode;
};

const activeChallenges: TaskCard[] = [
  {
    title: "Сортируй отходы 7 дней",
    subtitle: "Недельный eco-челлендж по сортировке дома",
    progressLabel: "3 / 7 дней",
    progressValue: 43,
    points: "+70 баллов",
    cta: "Продолжить",
    icon: <Recycle size={34} strokeWidth={1.9} />,
  },
  {
    title: "Неделя без пластиковых пакетов",
    subtitle: "Выбирай многоразовые альтернативы в магазине",
    progressLabel: "0 / 7 дней",
    progressValue: 6,
    points: "+50 баллов",
    cta: "Начать",
    icon: <ShoppingBag size={34} strokeWidth={1.9} />,
  },
];

const quickTasks: TaskCard[] = [
  {
    title: "Сделай фото чистого двора",
    subtitle: "Загрузи фото убранной территории",
    progressLabel: "Быстрое действие",
    progressValue: 100,
    points: "+30 баллов",
    cta: "Загрузить фото",
    icon: <Camera size={34} strokeWidth={1.9} />,
  },
];

function DemoBadge() {
  return (
    <span className="inline-flex rounded-full border border-[#d8e7d6] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6c8770]">
      Demo
    </span>
  );
}

function TaskCardItem({
  title,
  subtitle,
  progressLabel,
  progressValue,
  points,
  cta,
  icon,
}: TaskCard) {
  return (
    <article className="rounded-[28px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[20px] border border-[#d7e5d5] bg-[#f7fbf6] text-[#2f8734]">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-[18px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#12351d]">
                {title}
              </h3>
              <p className="mt-1 text-sm leading-5 text-[#5f7462]">{subtitle}</p>
            </div>
            <span className="rounded-full bg-[#edf7ea] px-3 py-1 text-xs font-semibold text-[#2f8734]">
              {points}
            </span>
          </div>

          <div className="mt-4">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e8eee6]">
              <div
                className="h-full rounded-full bg-[#59a564]"
                style={{ width: `${progressValue}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[#35533c]">{progressLabel}</p>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-[#2f8734] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#286f2c]"
              >
                {cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function TasksPage() {
  const { profile, user } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const email = user.email ?? profile?.email ?? "";
  const displayName = profile?.full_name ?? user.user_metadata?.full_name ?? null;
  const rating = profile?.rating ?? 0;
  const displayRating = rating > 0 ? rating : 320;
  const remainingToHero = displayRating >= 400 ? 0 : Math.max(400 - displayRating, 80);

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
          titleBadge="Demo"
          title="Задания"
        />

        <section className="mt-3 rounded-[28px] border border-[#d4e4d2] bg-white p-5 shadow-[0_14px_30px_rgba(59,94,57,0.08)] lg:rounded-[32px] lg:p-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-[640px]">
                <div className="flex items-center gap-3">
                  <h1 className="text-[30px] font-semibold leading-none tracking-[-0.05em] text-[#12351d] lg:text-[38px]">
                    Задания
                  </h1>
                  <DemoBadge />
                </div>
                <p className="mt-3 max-w-[520px] text-[15px] leading-6 text-[#5b7160] lg:text-base">
                  Выполняй задания, зарабатывай баллы и повышай свой уровень.
                  Это demo-сценарий геймификации внутри GreenStep.
                </p>
              </div>

              <div className="rounded-[26px] border border-[#d4e4d2] bg-[#f7fbf6] px-5 py-5 shadow-[0_10px_24px_rgba(59,94,57,0.06)] lg:min-w-[360px]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6c8770]">
                      Ваш эко-рейтинг
                    </p>
                    <div className="mt-3 flex items-end gap-3">
                      <p className="text-[46px] font-semibold leading-none tracking-[-0.05em] text-[#12351d]">
                        {displayRating}
                      </p>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 pb-1 text-sm font-semibold text-[#1f8bb3] transition hover:text-[#176f8f]"
                      >
                        <Coins size={16} strokeWidth={2.1} />
                        Обменять баллы
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[#dfe5dd]">
                  <div
                    className="h-full rounded-full bg-[#57a462]"
                    style={{ width: `${Math.min((displayRating / 400) * 100, 100)}%` }}
                  />
                </div>
                <p className="mt-3 text-sm leading-5 text-[#46604a]">
                  До уровня &quot;Эко-герой&quot;: {remainingToHero} баллов
                </p>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-[24px] font-semibold tracking-[-0.04em] text-[#12351d]">
                  Активные челленджи
                </h2>
                <span className="hidden text-sm text-[#6c8770] lg:inline">
                  2 активных сценария
                </span>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {activeChallenges.map((item) => (
                  <TaskCardItem key={item.title} {...item} />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-[24px] font-semibold tracking-[-0.04em] text-[#12351d]">
                  Быстрые задания
                </h2>
                <button
                  type="button"
                  className="hidden items-center gap-1 text-sm font-semibold text-[#2f8734] transition hover:text-[#286f2c] lg:inline-flex"
                >
                  Смотреть все
                  <ArrowRight size={16} strokeWidth={2.2} />
                </button>
              </div>
              <div className="grid gap-4">
                {quickTasks.map((item) => (
                  <TaskCardItem key={item.title} {...item} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
