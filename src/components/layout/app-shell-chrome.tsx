import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Bell,
  BookOpenText,
  FileText,
  House,
  MapPinned,
  Users,
} from "lucide-react";
import { HeaderUserMenu } from "@/components/layout/header-user-menu";

type AppShellChromeProps = {
  displayName?: string | null;
  email: string;
  isAdmin: boolean;
  rating: number;
  titleBadge?: string | null;
  title?: string;
};

type NavItem = {
  href?: string;
  icon: ReactNode;
  isActive?: boolean;
  isDemo?: boolean;
  label: string;
};

function DemoBadge() {
  return (
    <span className="hidden rounded-full border border-[#d7e5d5] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6c8770] lg:inline-flex">
      Demo
    </span>
  );
}

export function AppShellChrome({
  displayName,
  email,
  isAdmin,
  rating,
  titleBadge,
  title,
}: AppShellChromeProps) {
  const navItems: NavItem[] = [
    {
      href: "/",
      icon: <House size={24} className="text-[#f7fbf3] lg:text-[#173221]" strokeWidth={2.2} />,
      label: "Главная",
      isActive: !title,
    },
    {
      href: "/map",
      icon: <MapPinned size={24} className="text-[#f7fbf3] lg:text-[#173221]" strokeWidth={2.2} />,
      label: "Карта",
      isActive: title === "Карта обращений",
    },
    {
      href: "/reports",
      icon: <FileText size={24} className="text-[#f7fbf3] lg:text-[#173221]" strokeWidth={2.2} />,
      label: "Все заявки",
      isActive: title === "Все заявки",
    },
    {
      href: "/learning",
      icon: <BookOpenText size={24} className="text-[#f7fbf3] lg:text-[#173221]" strokeWidth={2.2} />,
      label: "Обучение",
      isActive: title === "Обучение",
      isDemo: true,
    },
    {
      href: "/community",
      icon: <Users size={24} className="text-[#f7fbf3] lg:text-[#173221]" strokeWidth={2.2} />,
      label: "Сообщество",
      isActive: title === "Сообщество",
      isDemo: true,
    },
  ];

  return (
    <>
      <header className="rounded-[28px] border border-[#2a7a2f] bg-[#2f8734] px-3 py-3 shadow-[0_14px_30px_rgba(47,135,52,0.22)] sm:px-4 lg:rounded-[32px] lg:py-2">
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
            {title ? (
              <div className="flex min-w-0 items-center gap-3">
                <h1 className="truncate text-[24px] font-semibold tracking-[-0.04em] text-[#f7fbf3]">
                  {title}
                </h1>
                {titleBadge ? (
                  <span className="inline-flex shrink-0 rounded-full border border-white/30 bg-white/14 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f7fbf3]">
                    {titleBadge}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="flex min-w-0 items-center justify-end gap-2 sm:flex-nowrap">
            <HeaderUserMenu
              displayName={displayName}
              email={email}
              isAdmin={isAdmin}
              rating={rating}
            />
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

      <section className="fixed inset-x-3 bottom-3 z-[1200] rounded-[24px] border border-[#2a7a2f] bg-[#2f8734] px-2 py-2 shadow-[0_18px_40px_rgba(47,135,52,0.22)] backdrop-blur md:inset-x-4 md:bottom-4 lg:static lg:mt-3 lg:rounded-[32px] lg:border-[#cfe0cd] lg:bg-white lg:px-4 lg:py-2 lg:shadow-[0_14px_30px_rgba(59,94,57,0.08)] lg:backdrop-blur-0">
        <div className="grid grid-cols-5 gap-2 lg:gap-3">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href ?? "#"}
              className={
                item.isActive
                  ? "flex items-center justify-center rounded-[18px] border border-transparent bg-transparent px-2 py-3 text-[15px] font-semibold text-[#f7fbf3] transition hover:bg-white/10 lg:justify-between lg:border-[#b7e8c1] lg:bg-[#d9f6de] lg:px-4 lg:py-2 lg:text-[#12351d] lg:shadow-[inset_1px_0_0_#1bc36a]"
                  : "flex items-center justify-center rounded-[18px] border border-transparent bg-transparent px-2 py-3 text-[15px] font-medium text-[#f7fbf3] transition hover:bg-white/10 lg:justify-between lg:bg-[#f3f7f1] lg:px-4 lg:py-2 lg:text-[#173221] lg:hover:bg-[#edf4ea]"
              }
            >
              <span className="flex items-center gap-0 lg:gap-3">
                {item.icon}
                <span className="hidden lg:inline">{item.label}</span>
              </span>
              {item.isDemo ? <DemoBadge /> : null}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
