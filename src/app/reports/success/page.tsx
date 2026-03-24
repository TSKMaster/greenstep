import Link from "next/link";

export default function ReportSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-md rounded-[28px] border border-border bg-surface p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          GreenStep
        </p>
        <h1 className="mt-4 text-3xl font-bold text-primary-dark">
          Заявка отправлена
        </h1>
        <p className="mt-4 text-sm leading-6 text-foreground/80">
          Заявка успешно сохранена. Описание, точка на карте и прикрепленное
          фото уже переданы в систему. Дальше ты можешь посмотреть ее в списке
          заявок или создать еще одно обращение.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/reports/new"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 font-semibold !text-white transition hover:bg-primary-dark"
          >
            Создать еще одну заявку
          </Link>
          <Link
            href="/reports"
            className="inline-flex items-center justify-center rounded-2xl border border-border px-4 py-3 font-semibold text-primary-dark transition hover:bg-surface-muted"
          >
            Перейти к списку заявок
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-border px-4 py-3 font-semibold text-primary-dark transition hover:bg-surface-muted"
          >
            Вернуться на главную
          </Link>
        </div>
      </section>
    </main>
  );
}
