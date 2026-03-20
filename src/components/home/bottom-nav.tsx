import Link from "next/link";

type BottomNavProps = {
  isAdmin: boolean;
};

const baseItemClassName =
  "flex flex-col items-center justify-center rounded-2xl px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition";

export function BottomNav({ isAdmin }: BottomNavProps) {
  return (
    <nav className="sticky bottom-0 mt-8 grid grid-cols-5 gap-2 rounded-[26px] bg-primary p-2 text-white shadow-lg">
      <Link href="/" className={`${baseItemClassName} bg-white/15`}>
        Главная
      </Link>
      <Link href="/reports/new" className={`${baseItemClassName} hover:bg-white/10`}>
        Заявка
      </Link>
      <Link href="/map" className={`${baseItemClassName} hover:bg-white/10`}>
        Карта
      </Link>
      <Link
        href="/statistics"
        className={`${baseItemClassName} hover:bg-white/10`}
      >
        Статистика
      </Link>
      <Link
        href={isAdmin ? "/admin" : "/my-reports"}
        className={`${baseItemClassName} hover:bg-white/10`}
      >
        {isAdmin ? "Админ" : "Профиль"}
      </Link>
    </nav>
  );
}
