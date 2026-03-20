import Link from "next/link";
import { redirect } from "next/navigation";
import { ReportForm } from "@/components/reports/report-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function NewReportPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-xl rounded-[28px] border border-border bg-surface p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          GreenStep
        </p>
        <h1 className="mt-4 text-3xl font-bold text-primary-dark">
          Создание заявки
        </h1>
        <p className="mt-4 text-sm leading-6 text-foreground/80">
          Это первая рабочая версия формы. Она уже сохраняет заявку в базу
          данных Supabase.
        </p>
        <ReportForm userId={user.id} />
        <Link
          href="/"
          className="mt-6 inline-flex text-sm font-medium text-primary"
        >
          Вернуться на главную
        </Link>
      </section>
    </main>
  );
}
