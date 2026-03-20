import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-md rounded-[28px] border border-red-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-600">
          GreenStep
        </p>
        <h1 className="mt-4 text-3xl font-bold text-red-700">
          Ошибка входа
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-700">
          Не удалось подтвердить вход по ссылке. Попробуй отправить magic link
          еще раз.
        </p>
        <Link
          href="/auth/sign-in"
          className="mt-6 inline-flex rounded-2xl bg-primary px-4 py-3 font-semibold text-white"
        >
          Вернуться ко входу
        </Link>
      </section>
    </main>
  );
}
