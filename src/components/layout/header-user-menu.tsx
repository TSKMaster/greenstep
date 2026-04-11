"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type HeaderUserMenuProps = {
  email: string;
  isAdmin: boolean;
  rating: number;
};

export function HeaderUserMenu({
  email,
  isAdmin,
  rating,
}: HeaderUserMenuProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const userBadgeInitial = email.trim().charAt(0).toLowerCase() || "g";

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      router.push("/auth/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Failed to sign out", error);
      setIsSigningOut(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex min-w-0 items-center gap-2 rounded-full bg-white/14 px-2 py-1.5 text-left text-[#f7fbf3] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:bg-white/18 sm:min-w-[220px] sm:gap-3 sm:px-3 sm:py-2"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173221] text-[16px] font-semibold lowercase text-white sm:h-10 sm:w-10 sm:text-[18px]">
          {userBadgeInitial}
        </div>
        <div className="min-w-0 flex-1 leading-none">
          <p className="hidden text-[8px] uppercase tracking-[0.14em] text-[#dceadb] sm:block sm:text-[9px]">
            {isAdmin ? "Администратор" : "Пользователь"}
          </p>
          <p className="mt-1 truncate text-[11px] font-medium text-[#f7fbf3] sm:text-[12px]">
            {email}
          </p>
          <p className="mt-1 text-[11px] text-[#e0eee0] sm:text-[12px]">
            {rating} баллов
          </p>
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 text-[#f7fbf3] transition ${isOpen ? "rotate-180" : ""}`}
          strokeWidth={2.2}
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-[1400] w-[220px] rounded-[22px] border border-[#d4e4d2] bg-white p-2 shadow-[0_24px_80px_rgba(33,72,43,0.18)]">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-sm font-medium text-[#173221] transition hover:bg-[#f3f7f1]"
          >
            <UserCircle2 size={18} className="text-[#2f8734]" strokeWidth={2.2} />
            Профиль
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-sm font-medium text-[#173221] transition hover:bg-[#f3f7f1] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LogOut size={18} className="text-[#2f8734]" strokeWidth={2.2} />
            {isSigningOut ? "Выходим..." : "Выход"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
