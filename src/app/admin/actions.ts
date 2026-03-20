"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserWithProfile } from "@/lib/auth";
import type { RequestStatus } from "@/types";

const ALLOWED_STATUSES: RequestStatus[] = [
  "new",
  "accepted",
  "in_progress",
  "resolved",
  "rejected",
];

export async function updateReportAdminDetails(
  reportId: string,
  formData: FormData,
) {
  const { profile, supabase, user } = await getCurrentUserWithProfile();

  if (!user || !profile?.is_admin) {
    throw new Error("Доступ к админке запрещен.");
  }

  const status = formData.get("status");
  const adminComment = formData.get("admin_comment");

  if (
    typeof status !== "string" ||
    !ALLOWED_STATUSES.includes(status as RequestStatus)
  ) {
    throw new Error("Передан неверный статус.");
  }

  const { error } = await supabase
    .from("reports")
    .update({
      admin_comment:
        typeof adminComment === "string" ? adminComment.trim() || null : null,
      status,
    })
    .eq("id", reportId);

  if (error) {
    throw new Error("Не удалось обновить заявку из админки.");
  }

  revalidatePath("/admin");
  revalidatePath("/reports");
  revalidatePath(`/reports/${reportId}`);
  revalidatePath("/statistics");
  revalidatePath("/my-reports");
}
