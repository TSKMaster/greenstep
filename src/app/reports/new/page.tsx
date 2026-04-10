import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BarChart3,
  Bell,
  BookOpenText,
  House,
  ListTodo,
  Users,
} from "lucide-react";
import { ReportForm } from "@/components/reports/report-form";
import { getCurrentUserWithProfile } from "@/lib/auth";

export default async function NewReportPage() {
  const { profile, user } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const email = user.email ?? profile?.email ?? "";
  const userBadgeInitial = email.trim().charAt(0).toLowerCase() || "g";
  const navItems = [
    {
      href: "/",
      icon: <House size={20} className="text-[#173221]" strokeWidth={2} />,
      label: "Главная",
      isActive: true,
    },
    {
      href: "/statistics",
      icon: <BarChart3 size={20} className="text-[#173221]" strokeWidth={2} />,
      label: "Статистика",
      isDemo: true,
    },
    {
      icon: <ListTodo size={20} className="text-[#173221]" strokeWidth={2} />,
      label: "Задания",
      isDemo: true,
    },
    {
      icon: <BookOpenText size={20} className="text-[#173221]" strokeWidth={2} />,
      label: "Обучение",
      isDemo: true,
    },
    {
      icon: <Users size={20} className="text-[#173221]" strokeWidth={2} />,
      label: "Сообщество",
      isDemo: true,
    },
  ];

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

            <div className="hidden min-w-0 justify-center lg:flex lg:flex-1">
              <h1 className="truncate text-[24px] font-semibold tracking-[-0.04em] text-[#f7fbf3]">
                Создание заявки
              </h1>
            </div>

            <div className="flex min-w-0 items-center justify-end gap-2 sm:flex-nowrap">
              <div className="flex min-w-0 items-center gap-2 rounded-full bg-white/14 px-2 py-1.5 text-[#f7fbf3] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] sm:min-w-[220px] sm:gap-3 sm:px-3 sm:py-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173221] text-[16px] font-semibold lowercase text-white sm:h-10 sm:w-10 sm:text-[18px]">
                  {userBadgeInitial}
                </div>
                <div className="min-w-0 leading-none">
                  <p className="hidden text-[8px] uppercase tracking-[0.14em] text-[#dceadb] sm:block sm:text-[9px]">
                    {profile?.is_admin ? "Администратор" : "Пользователь"}
                  </p>
                  <p className="mt-1 truncate text-[11px] font-medium text-[#f7fbf3] sm:text-[12px]">
                    {email}
                  </p>
                  <p className="mt-1 text-[11px] text-[#e0eee0] sm:text-[12px]">
                    {profile?.rating ?? 0} баллов
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/35 bg-white/18 text-[#f7fbf3] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:bg-white/24"
                aria-label="Уведомления"
              >
                <Bell size={20} className="text-[#f7fbf3]" strokeWidth={2} />
              </button>
            </div>
          </div>
        </header>

        <section className="fixed inset-x-3 bottom-3 z-[1200] rounded-[24px] border border-[#cfe0cd] bg-white/96 px-2 py-2 shadow-[0_18px_40px_rgba(59,94,57,0.16)] backdrop-blur md:inset-x-4 md:bottom-4 lg:static lg:mt-3 lg:rounded-[32px] lg:bg-white lg:px-4 lg:py-2 lg:shadow-[0_14px_30px_rgba(59,94,57,0.08)] lg:backdrop-blur-0">
          <div className="grid grid-cols-5 gap-2 lg:gap-3">
            {navItems.map((item) => (
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    item.isActive
                      ? "flex items-center justify-center rounded-[18px] border border-[#b7e8c1] bg-[#d9f6de] px-2 py-3 text-[15px] font-semibold text-[#12351d] shadow-[inset_1px_0_0_#1bc36a] lg:justify-between lg:px-4 lg:py-2"
                      : "flex items-center justify-center rounded-[18px] bg-[#f3f7f1] px-2 py-3 text-[15px] font-medium text-[#173221] transition hover:bg-[#edf4ea] lg:justify-between lg:px-4 lg:py-2"
                  }
                >
                  <span className="flex items-center gap-0 lg:gap-3">
                    {item.icon}
                    <span className="hidden lg:inline">{item.label}</span>
                  </span>
                  {item.isDemo ? (
                    <span className="hidden rounded-full border border-[#d7e5d5] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6c8770] lg:inline-flex">
                      Demo
                    </span>
                  ) : null}
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  className="flex items-center justify-center rounded-[18px] bg-[#f3f7f1] px-2 py-3 text-[15px] font-medium text-[#173221] lg:justify-between lg:px-4 lg:py-2"
                >
                  <span className="flex items-center gap-0 lg:gap-3">
                    {item.icon}
                    <span className="hidden lg:inline">{item.label}</span>
                  </span>
                  <span className="hidden rounded-full border border-[#d7e5d5] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6c8770] lg:inline-flex">
                    Demo
                  </span>
                </button>
              )
            ))}
          </div>
        </section>

        <div className="mt-3 flex items-center justify-center">
          <section className="w-full rounded-[28px] border border-border bg-surface p-8 shadow-sm lg:rounded-[32px] lg:border-[#d4e4d2] lg:bg-white lg:p-8 lg:shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
            <div className="lg:hidden">
              <h1 className="text-3xl font-bold text-primary-dark">
                Создание заявки
              </h1>
            </div>
            <ReportForm userId={user.id} />
            <Link
              href="/"
              className="mt-6 inline-flex text-sm font-medium text-primary"
            >
              Вернуться на главную
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
