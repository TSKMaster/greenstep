import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-md rounded-[28px] border border-border bg-surface p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          GreenStep
        </p>
        <h1 className="mt-4 text-3xl font-bold text-primary-dark">Вход</h1>
        <p className="mt-4 text-sm leading-6 text-foreground/80">
          Введи email. На почту придет ссылка, по которой можно войти в
          приложение.
        </p>
        <SignInForm />
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
