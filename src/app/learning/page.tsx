import { redirect } from "next/navigation";
import {
  BatteryWarning,
  BookOpenText,
  Leaf,
  Newspaper,
  PlayCircle,
  Recycle,
  TriangleAlert,
} from "lucide-react";
import { AppShellChrome } from "@/components/layout/app-shell-chrome";
import { getCurrentUserWithProfile } from "@/lib/auth";

type LearningCard = {
  title: string;
  subtitle: string;
  badge?: { label: string; tone: "green" | "amber" };
  icon: React.ReactNode;
};

const learningCards: LearningCard[] = [
  {
    title: "Совет дня",
    subtitle: "Не выбрасывай батарейки в обычный мусор. Одна батарейка загрязняет до 20 м² почвы.",
    badge: { label: "+10 баллов", tone: "green" },
    icon: <BatteryWarning size={34} strokeWidth={1.9} />,
  },
  {
    title: "Как сортировать отходы",
    subtitle: "Какие отходы можно перерабатывать и куда их сдавать.",
    badge: { label: "Новое", tone: "amber" },
    icon: <Recycle size={34} strokeWidth={1.9} />,
  },
  {
    title: "Почему опасны свалки",
    subtitle: "Чем опасны стихийные свалки для природы и людей.",
    badge: { label: "Пройдено", tone: "green" },
    icon: <TriangleAlert size={34} strokeWidth={1.9} />,
  },
  {
    title: "Экологичные привычки",
    subtitle: "Простые действия, которые может делать каждый.",
    badge: { label: "Пройдено", tone: "green" },
    icon: <Leaf size={34} strokeWidth={1.9} />,
  },
  {
    title: "Эко-новости района",
    subtitle: "Экологические события и инициативы района.",
    badge: { label: "+10 баллов", tone: "green" },
    icon: <Newspaper size={34} strokeWidth={1.9} />,
  },
  {
    title: "Видео и инфографика",
    subtitle: "Наглядные материалы о переработке и защите природы.",
    badge: { label: "Новое", tone: "amber" },
    icon: <PlayCircle size={34} strokeWidth={1.9} />,
  },
];

function DemoBadge() {
  return (
    <span className="inline-flex rounded-full border border-[#d8e7d6] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6c8770]">
      Demo
    </span>
  );
}

function CardBadge({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "amber";
}) {
  const className =
    tone === "amber"
      ? "bg-[#fff1c9] text-[#b97d09]"
      : "bg-[#edf7ea] text-[#2f8734]";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}

function LearningCardItem({ title, subtitle, badge, icon }: LearningCard) {
  return (
    <article className="rounded-[28px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[20px] border border-[#d7e5d5] bg-[#f7fbf6] text-[#2f8734]">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-[18px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#12351d]">
                {title}
              </h3>
              <p className="mt-1 text-sm leading-5 text-[#5f7462]">{subtitle}</p>
            </div>
            {badge ? <CardBadge label={badge.label} tone={badge.tone} /> : null}
          </div>

          <div className="mt-4 flex items-center justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-[#2f8734] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#286f2c]"
            >
              Подробнее
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function LearningPage() {
  const { profile, user } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/auth/sign-in");
  }

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
          title="Обучение"
          titleBadge="Demo"
        />

        <section className="mt-3 rounded-[28px] border border-[#d4e4d2] bg-white p-5 shadow-[0_14px_30px_rgba(59,94,57,0.08)] lg:rounded-[32px] lg:p-8">
          <div className="flex flex-col gap-5">
            <div className="max-w-[680px]">
              <div className="flex items-center gap-3">
                <h1 className="text-[30px] font-semibold leading-none tracking-[-0.05em] text-[#12351d] lg:text-[38px]">
                  Обучение
                </h1>
                <DemoBadge />
              </div>
              <p className="mt-3 max-w-[540px] text-[15px] leading-6 text-[#5b7160] lg:text-base">
                Узнай, как сделать район чище. Это demo-раздел с короткими
                материалами, карточками и микро-уроками внутри GreenStep.
              </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {learningCards.map((card) => (
                <LearningCardItem key={card.title} {...card} />
              ))}
            </div>

            <section className="rounded-[28px] border border-[#d4e4d2] bg-[#f7fbf6] px-5 py-5 shadow-[0_10px_24px_rgba(59,94,57,0.06)]">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6c8770]">
                    Demo-слой
                  </p>
                  <h2 className="mt-2 flex items-center gap-2 text-[24px] font-semibold tracking-[-0.04em] text-[#12351d]">
                    <BookOpenText size={22} className="text-[#2f8734]" strokeWidth={2.1} />
                    База знаний района
                  </h2>
                  <p className="mt-2 max-w-[620px] text-sm leading-6 text-[#5f7462]">
                    Позже сюда можно добавить реальные учебные модули, короткие тесты,
                    сохранение прогресса и персональные рекомендации по экопривычкам.
                  </p>
                </div>
                <div className="rounded-[22px] border border-[#d4e4d2] bg-white px-5 py-4 text-center">
                  <p className="text-[12px] uppercase tracking-[0.12em] text-[#6c8770]">
                    Материалов
                  </p>
                  <p className="mt-2 text-[34px] font-semibold leading-none tracking-[-0.04em] text-[#12351d]">
                    6
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
