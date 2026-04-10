import { MainRedesignPreview } from "@/components/home-preview/main-redesign-preview";
import { getCurrentUserWithProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { calculateEcoIndex, getEcoIndexLabel } from "@/lib/statistics";
import type { ReportListItem } from "@/types";

type HomePageProps = {
  searchParams?: Promise<{
    report?: string;
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const { profile, user } = await getCurrentUserWithProfile();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const reportParam = resolvedSearchParams?.report ?? null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("reports")
    .select(
      "id, address, category, created_at, description, is_anonymous, latitude, longitude, status, support_count, user_id",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить данные главной страницы.");
  }

  const reports = (data ?? []) as ReportListItem[];
  const totalReports = reports.length;
  const activeReports = reports.filter(
    (report) =>
      report.status === "new" ||
      report.status === "accepted" ||
      report.status === "in_progress",
  ).length;
  const resolvedReports = reports.filter(
    (report) => report.status === "resolved",
  ).length;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const resolvedThisMonth = reports.filter((report) => {
    if (report.status !== "resolved" || !report.created_at) {
      return false;
    }

    return new Date(report.created_at) >= thirtyDaysAgo;
  }).length;
  const myReports = reports.filter((report) => report.user_id === user?.id).length;
  const myResolvedReports = reports.filter(
    (report) => report.user_id === user?.id && report.status === "resolved",
  ).length;
  const ecoIndex = calculateEcoIndex(reports);
  const ecoLabel = getEcoIndexLabel(ecoIndex);

  return (
    <MainRedesignPreview
      activeReports={activeReports}
      basePath="/"
      currentUserId={user?.id ?? null}
      ecoIndex={ecoIndex}
      ecoLabel={ecoLabel}
      email={user?.email ?? profile?.email ?? "guest@greenstep.local"}
      initialSelectedReportId={reportParam}
      isAdmin={Boolean(profile?.is_admin)}
      myReports={myReports}
      myResolvedReports={myResolvedReports}
      previewModeEnabled={false}
      rating={profile?.rating ?? 0}
      reports={reports}
      resolvedReports={resolvedReports}
      resolvedThisMonth={resolvedThisMonth}
      totalReports={totalReports}
      viewerMode={user ? "authorized" : "guest"}
    />
  );
}
