type AppShellProps = {
  title: string;
  description: string;
};

export function AppShell({ title, description }: AppShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-md rounded-[28px] border border-border bg-surface p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          GreenStep
        </p>
        <h1 className="mt-4 text-3xl font-bold text-primary-dark">{title}</h1>
        <p className="mt-4 text-sm leading-6 text-foreground/80">
          {description}
        </p>
      </section>
    </main>
  );
}
