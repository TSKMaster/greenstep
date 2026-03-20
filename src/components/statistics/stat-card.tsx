type StatCardProps = {
  label: string;
  value: number;
  accent?: "green" | "blue" | "orange";
};

const ACCENT_STYLES = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  blue: "bg-sky-50 text-sky-700 border-sky-200",
  orange: "bg-amber-50 text-amber-700 border-amber-200",
};

export function StatCard({
  label,
  value,
  accent = "green",
}: StatCardProps) {
  return (
    <article
      className={`rounded-3xl border p-5 shadow-sm ${ACCENT_STYLES[accent]}`}
    >
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </article>
  );
}
