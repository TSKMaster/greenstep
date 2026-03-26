"use server";

import { revalidatePath } from "next/cache";
import { getAdminUpdateErrorMessage } from "@/lib/error-messages";
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
  _previousState: {
    message: string;
    status: "idle" | "success" | "error";
  },
  formData: FormData,
) {
  const reportId = formData.get("report_id");
  const { profile, supabase, user } = await getCurrentUserWithProfile();

  if (typeof reportId !== "string" || !reportId) {
    return {
      message: "Не удалось определить заявку для редактирования.",
      status: "error" as const,
    };
  }

  if (!user || !profile?.is_admin) {
    return {
      message: "Доступ к админке запрещен.",
      status: "error" as const,
    };
  }

  const status = formData.get("status");
  const adminComment = formData.get("admin_comment");

  if (
    typeof status !== "string" ||
    !ALLOWED_STATUSES.includes(status as RequestStatus)
  ) {
    return {
      message: "Передан неверный статус.",
      status: "error" as const,
    };
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
    return {
      message: getAdminUpdateErrorMessage(error.message),
      status: "error" as const,
    };
  }

  revalidatePath("/admin");
  revalidatePath("/reports");
  revalidatePath(`/reports/${reportId}`);
  revalidatePath("/statistics");
  revalidatePath("/my-reports");

  return {
    message: "Изменения по заявке сохранены.",
    status: "success" as const,
  };
}
