import Link from "next/link";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/home/bottom-nav";
import { getCurrentUserWithProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { calculateEcoIndex, getEcoIndexLabel } from "@/lib/statistics";
import type { ReportListItem } from "@/types";

function getGaugeStyle(value: number) {
  return {
    background: `conic-gradient(
      #1f7a45 0deg ${Math.max(value, 12) * 1.8}deg,
      #99c24d ${Math.max(value, 12) * 1.8}deg 220deg,
      #f2b134 220deg 270deg,
      #e76f51 270deg 360deg
    )`,
  };
}

function getGreetingName(name: string | null, email: string | undefined) {
  if (name && name.trim()) {
    return name.trim();
  }

  if (email) {
    return email.split("@")[0];
  }

  return "Пользователь";
}

export default async function Home() {
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
    throw new Error("Не удалось загрузить данные главной страницы.");
  }

  const reports = (data ?? []) as ReportListItem[];
  const ecoIndex = calculateEcoIndex(reports);
  const ecoLabel = getEcoIndexLabel(ecoIndex);
  const totalReports = reports.length;
  const activeReports = reports.filter(
    (report) =>
      report.status === "new" ||
      report.status === "accepted" ||
      report.status === "in_progress",
  ).length;
  const resolvedReports = reports.filter(
    (report) => report.status === "resolved",
  ).length;
  const greetingName = getGreetingName(profile?.full_name ?? null, user.email);
  const latestReports = reports.slice(0, 3);

  async function signOut() {
    "use server";

    const serverSupabase = await createSupabaseServerClient();
    await serverSupabase.auth.signOut();
    redirect("/auth/sign-in");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fff4_0%,_#eef8ea_45%,_#e4f1df_100%)] px-4 py-6">
      <section className="mx-auto w-full max-w-[430px] rounded-[34px] border border-border/80 bg-white/85 p-4 shadow-[0_20px_50px_rgba(31,122,69,0.12)] backdrop-blur">
        <header className="rounded-[28px] bg-primary px-4 py-4 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">GreenStep</p>
              <p className="mt-1 text-lg font-bold">{greetingName}</p>
              <p className="text-sm text-white/80">
                Рейтинг: {profile?.rating ?? 0}
              </p>
            </div>
            <div className="text-right text-xs text-white/80">
              <p>{user.email}</p>
              {profile?.is_admin ? <p className="mt-1">Администратор</p> : null}
            </div>
          </div>
        </header>

        <section className="mt-5 rounded-[30px] bg-[radial-gradient(circle_at_top,_#f3ffe9_0%,_#edf8e6_40%,_#ffffff_100%)] px-4 py-5">
          <h1 className="text-center text-[32px] font-bold leading-none text-primary-dark">
            Эко-Индекс
          </h1>

          <div className="mx-auto mt-5 flex h-52 w-52 items-center justify-center rounded-full p-5" style={getGaugeStyle(ecoIndex)}>
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white shadow-inner">
              <p className="text-5xl font-bold text-primary-dark">{ecoIndex}</p>
              <p className="mt-1 text-lg font-bold uppercase text-primary">
                {ecoLabel}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-[0.08em] text-foreground/60">
                Проведенных мероприятий
              </p>
              <p className="mt-2 text-2xl font-bold text-primary-dark">
                {resolvedReports}
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-[0.08em] text-foreground/60">
                Активных обращений
              </p>
              <p className="mt-2 text-2xl font-bold text-primary-dark">
                {activeReports}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[26px] border border-border bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-primary-dark">
                  Карта района
                </p>
                <p className="text-xs text-foreground/60">
                  Центр: Павлодар, район ТОЦ
                </p>
              </div>
              <Link
                href="/map"
                className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-primary-dark transition hover:bg-surface-muted"
              >
                Открыть карту
              </Link>
            </div>
            <div className="mt-3 rounded-[22px] bg-surface-muted p-4">
              <div className="grid grid-cols-3 gap-2">
                {latestReports.length > 0 ? (
                  latestReports.map((report) => (
                    <div
                      key={report.id}
                      className="rounded-2xl bg-white px-3 py-4 text-center shadow-sm"
                    >
                      <p className="text-xs font-semibold text-primary-dark">
                        {report.category.slice(0, 14)}
                      </p>
                      <p className="mt-2 text-[11px] text-foreground/60">
                        {report.support_count} поддержек
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 rounded-2xl bg-white px-3 py-5 text-center text-sm text-foreground/70 shadow-sm">
                    Пока нет заявок. Создай первую.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <Link
          href="/reports/new"
          className="mt-5 inline-flex w-full items-center justify-center rounded-[24px] bg-primary px-4 py-4 text-lg font-bold !text-white shadow-lg transition hover:bg-primary-dark"
        >
          Сообщить о проблеме
        </Link>

        <section className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href="/my-reports"
            className="rounded-[24px] bg-primary px-4 py-5 text-center text-base font-bold !text-white shadow-md transition hover:bg-primary-dark"
          >
            Мои заявки
          </Link>
          <Link
            href="/statistics"
            className="rounded-[24px] bg-primary px-4 py-5 text-center text-base font-bold !text-white shadow-md transition hover:bg-primary-dark"
          >
            Статистика
          </Link>
          <Link
            href="/reports"
            className="rounded-[24px] bg-primary px-4 py-5 text-center text-base font-bold !text-white shadow-md transition hover:bg-primary-dark"
          >
            Все заявки
          </Link>
          <Link
            href="/map"
            className="rounded-[24px] bg-primary px-4 py-5 text-center text-base font-bold !text-white shadow-md transition hover:bg-primary-dark"
          >
            Карта
          </Link>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[24px] border border-dashed border-border bg-surface-muted px-4 py-5 text-center text-sm font-semibold text-foreground/70">
            Обучение
            <p className="mt-2 text-xs font-normal">Будет расширено позже</p>
          </div>
          <div className="rounded-[24px] border border-dashed border-border bg-surface-muted px-4 py-5 text-center text-sm font-semibold text-foreground/70">
            Сообщество
            <p className="mt-2 text-xs font-normal">Будет расширено позже</p>
          </div>
        </section>

        <div className="mt-4 flex items-center justify-between rounded-[24px] bg-surface-muted px-4 py-3 text-sm text-foreground/70">
          <p>Всего заявок: {totalReports}</p>
          <form action={signOut}>
            <button type="submit" className="font-semibold text-primary-dark">
              Выйти
            </button>
          </form>
        </div>

        <BottomNav isAdmin={Boolean(profile?.is_admin)} />
      </section>
    </main>
  );
}
