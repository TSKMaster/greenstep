import { redirect } from "next/navigation";
import { AppShellChrome } from "@/components/layout/app-shell-chrome";
import { getCurrentUserWithProfile } from "@/lib/auth";

export default async function ProfilePage() {
  const { profile, user } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const email = user.email ?? profile?.email ?? "";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#edf3ee] px-3 py-3 pb-28 sm:px-4 sm:py-4 sm:pb-32 lg:px-6 lg:py-5 lg:pb-6">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.36]"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(237,243,238,0.44),rgba(237,243,238,0.62))]" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <AppShellChrome
          email={email}
          isAdmin={Boolean(profile?.is_admin)}
          rating={profile?.rating ?? 0}
          title="Профиль"
        />

        <section className="mt-3 rounded-[28px] border border-[#d4e4d2] bg-white p-6 shadow-[0_14px_30px_rgba(59,94,57,0.08)] lg:rounded-[32px] lg:p-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              ["Email", email],
              ["Роль", profile?.is_admin ? "Администратор" : "Пользователь"],
              ["Баллы", String(profile?.rating ?? 0)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[24px] border border-[#d4e4d2] bg-[#f7fbf6] px-5 py-5"
              >
                <p className="text-[12px] uppercase tracking-[0.12em] text-[#6c8770]">
                  {label}
                </p>
                <p className="mt-3 text-lg font-semibold text-[#12351d]">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
