import Image from "next/image";
import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#edf3ee] px-3 py-3 pb-10 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.36]"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(237,243,238,0.44),rgba(237,243,238,0.62))]" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <div className="flex min-h-[calc(100vh-32px)] items-center justify-center sm:min-h-[calc(100vh-40px)] lg:min-h-[calc(100vh-48px)]">
          <section className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#d4e4d2] bg-white shadow-[0_14px_30px_rgba(59,94,57,0.08)]">
            <div className="flex items-center justify-center gap-0 border-b border-[#c9ddc7] bg-[#4f9663] px-4 py-3 shadow-[0_12px_24px_rgba(52,102,65,0.14)]">
              <div className="flex h-[44px] w-[44px] items-center justify-center overflow-hidden">
                <Image
                  src="/GreenStepLogo.svg"
                  alt="GreenStep logo"
                  width={56}
                  height={56}
                  className="h-[3.1rem] w-auto object-contain"
                />
              </div>
              <p className="-ml-1 text-[23px] font-semibold tracking-[-0.04em] text-[#f7fbf3]">
                GreenStep
              </p>
            </div>

            <div className="p-8">
              <h1 className="text-3xl font-bold text-primary-dark">Вход</h1>
              <p className="mt-4 text-sm leading-6 text-foreground/80">
                Введи email. На почту придет ссылка, по которой можно войти в
                приложение.
              </p>
              <SignInForm />
              <Link
                href="/"
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-[#d4e4d2] bg-white px-4 py-3 text-sm font-semibold text-[#28452e] transition hover:bg-[#f6faf5]"
              >
                На главную
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
