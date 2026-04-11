import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShellChrome } from "@/components/layout/app-shell-chrome";
import { ReportForm } from "@/components/reports/report-form";
import { getCurrentUserWithProfile } from "@/lib/auth";

export default async function NewReportPage() {
  const { profile, user } = await getCurrentUserWithProfile();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const email = user.email ?? profile?.email ?? "";
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#edf3ee] px-3 py-3 pb-28 sm:px-4 sm:py-4 sm:pb-32 lg:px-6 lg:py-6 lg:pb-6">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.36]"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(237,243,238,0.44),rgba(237,243,238,0.62))]" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <AppShellChrome
          displayName={profile?.full_name ?? user.user_metadata?.full_name ?? null}
          email={email}
          isAdmin={Boolean(profile?.is_admin)}
          rating={profile?.rating ?? 0}
          title="Создание заявки"
        />

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
