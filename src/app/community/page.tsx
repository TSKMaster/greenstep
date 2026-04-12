import { redirect } from "next/navigation";
import {
  BrushCleaning,
  Lightbulb,
  TreePine,
  UserRound,
} from "lucide-react";
import { AppShellChrome } from "@/components/layout/app-shell-chrome";
import { getCurrentUserWithProfile } from "@/lib/auth";

type InitiativeCard = {
  title: string;
  subtitle: string;
  meta: string;
  cta: string;
  icon: React.ReactNode;
};

type DiscussionCard = {
  author: string;
  topic: string;
  excerpt: string;
  comments: string;
  cta: string;
};

const initiatives: InitiativeCard[] = [
  {
    title: "Посадка деревьев во дворе",
    subtitle: "Предлагается высадить новые деревья возле дома №12.",
    meta: "24 участника · 3 идеи",
    cta: "Проголосовать",
    icon: <TreePine size={34} strokeWidth={1.9} />,
  },
  {
    title: "Субботник во дворе",
    subtitle: "Общая уборка территории в эту субботу. Участники: 12 человек.",
    meta: "12 участников",
    cta: "Присоединиться",
    icon: <BrushCleaning size={34} strokeWidth={1.9} />,
  },
];

const discussions: DiscussionCard[] = [
  {
    author: "Иван Кузнецов",
    topic: "Кто знает, куда вывозить мусор с контейнерной площадки?",
    excerpt: "Обсуждение по вывозу и возможным точкам приёма.",
    comments: "Комментариев 8",
    cta: "Открыть обсуждение",
  },
  {
    author: "Мария Соколова",
    topic: "Сегодня отвезла батарейки в пункт приёма возле магазина.",
    excerpt: "Небольшой опыт и адрес точки, куда удобно сдавать батарейки.",
    comments: "Комментариев 5",
    cta: "Ответить",
  },
];

function DemoBadge() {
  return (
    <span className="inline-flex rounded-full border border-[#d8e7d6] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6c8770]">
      Demo
    </span>
  );
}

function InitiativeItem({ title, subtitle, meta, cta, icon }: InitiativeCard) {
  return (
    <article className="rounded-[28px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[20px] border border-[#d7e5d5] bg-[#f7fbf6] text-[#2f8734]">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-[18px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#12351d]">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-5 text-[#5f7462]">{subtitle}</p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-[#35533c]">{meta}</p>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-[#2f8734] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#286f2c]"
            >
              {cta}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function DiscussionItem({ author, topic, excerpt, comments, cta }: DiscussionCard) {
  return (
    <article className="rounded-[28px] border border-[#d4e4d2] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-[20px] border border-[#d7e5d5] bg-[#f7fbf6] text-[#2f8734]">
          <UserRound size={28} strokeWidth={1.9} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[17px] font-semibold text-[#12351d]">{author}</p>
          <h3 className="mt-1 text-[16px] font-medium leading-6 text-[#24442d]">{topic}</h3>
          <p className="mt-1 text-sm leading-5 text-[#5f7462]">{excerpt}</p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-[#35533c]">{comments}</p>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-[#2f8734] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#286f2c]"
            >
              {cta}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function CommunityPage() {
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
          title="Сообщество"
          titleBadge="Demo"
        />

        <section className="mt-3 rounded-[28px] border border-[#d4e4d2] bg-white p-5 shadow-[0_14px_30px_rgba(59,94,57,0.08)] lg:rounded-[32px] lg:p-8">
          <div className="flex flex-col gap-5">
            <div className="max-w-[680px]">
              <div className="flex items-center gap-3">
                <h1 className="text-[30px] font-semibold leading-none tracking-[-0.05em] text-[#12351d] lg:text-[38px]">
                  Сообщество
                </h1>
                <DemoBadge />
              </div>
              <p className="mt-3 max-w-[560px] text-[15px] leading-6 text-[#5b7160] lg:text-base">
                Обсуждения и инициативы жителей. Это demo-раздел для будущих
                локальных обсуждений, голосований и совместных действий внутри GreenStep.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-[24px] font-semibold tracking-[-0.04em] text-[#12351d]">
                Активные инициативы
              </h2>
              <div className="grid gap-4 xl:grid-cols-2">
                {initiatives.map((item) => (
                  <InitiativeItem key={item.title} {...item} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-[24px] font-semibold tracking-[-0.04em] text-[#12351d]">
                Лента обсуждений
              </h2>
              <div className="grid gap-4">
                {discussions.map((item) => (
                  <DiscussionItem key={item.author + item.topic} {...item} />
                ))}
              </div>
            </div>

            <section className="rounded-[28px] border border-[#d4e4d2] bg-[#f7fbf6] px-5 py-5 shadow-[0_10px_24px_rgba(59,94,57,0.06)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-[24px] font-semibold tracking-[-0.04em] text-[#12351d]">
                    <Lightbulb size={24} className="text-[#2f8734]" strokeWidth={2.1} />
                    Есть идея, как улучшить район?
                  </h2>
                  <p className="mt-2 max-w-[620px] text-sm leading-6 text-[#5f7462]">
                    В будущем здесь можно будет создавать инициативы, собирать соседей,
                    открывать обсуждения и запускать локальные экологические акции.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-[#2f8734] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#286f2c]"
                >
                  Предложить инициативу
                </button>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
