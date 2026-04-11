"use client";

import { useEffect, useState } from "react";
import { getAuthErrorMessage } from "@/lib/error-messages";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const PENDING_NAME_COOKIE = "gs_pending_name";
const MAX_FULL_NAME_LENGTH = 80;

function normalizeFullName(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, MAX_FULL_NAME_LENGTH);
}

export function SignInForm() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setIsAuthorized(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthorized(Boolean(session));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isAuthorized) {
    return (
      <div className="rounded-[24px] border border-[#d4e4d2] bg-[#f7fbf6] p-5">
        <h2 className="text-xl font-semibold text-primary-dark">
          Вы успешно авторизовались
        </h2>
        <p className="mt-3 text-sm leading-6 text-foreground/75">
          Вход уже подтверждён. Эту вкладку можно закрыть.
        </p>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const supabase = createSupabaseBrowserClient();
    const origin = window.location.origin;
    const redirectTo = `${origin}/auth/confirm`;
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedFullName = normalizeFullName(fullName);

    document.cookie = `${PENDING_NAME_COOKIE}=${encodeURIComponent(
      normalizedFullName,
    )}; Path=/; Max-Age=600; SameSite=Lax`;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: normalizedFullName,
          },
        },
      });

      if (error) {
        setErrorMessage(getAuthErrorMessage(error.message));
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(
        `Ссылка для входа отправлена на ${normalizedEmail}. Если письма нет, проверь папки "Спам" и "Промоакции".`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? getAuthErrorMessage(error.message)
          : "Не удалось отправить ссылку для входа. Попробуй еще раз.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-primary-dark">Вход</h1>
      <p className="mt-4 text-sm leading-6 text-foreground/80">
        Введи имя и email. На почту придет ссылка, по которой можно войти в
        приложение.
      </p>

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-left text-sm text-foreground/80">
          Имя
          <input
            required
            type="text"
            value={fullName}
            maxLength={MAX_FULL_NAME_LENGTH}
            onChange={(event) => {
              setFullName(event.target.value);
              setErrorMessage("");
            }}
            placeholder="Как к тебе обращаться"
            className="rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-2 text-left text-sm text-foreground/80">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrorMessage("");
            }}
            placeholder="example@mail.com"
            className="rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Отправка..." : "Войти по magic link"}
        </button>

        {errorMessage ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
            {successMessage}
          </p>
        ) : null}
      </form>
    </>
  );
}
