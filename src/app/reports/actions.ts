"use server";

import { revalidatePath } from "next/cache";
import { getSupportErrorMessage } from "@/lib/error-messages";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SupportReportActionState = {
  message: string;
  status: "idle" | "success" | "error";
};

export async function supportReportAction(
  _previousState: SupportReportActionState,
  formData: FormData,
) {
  const supabase = await createSupabaseServerClient();
  const reportId = formData.get("report_id");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (typeof reportId !== "string" || !reportId) {
    return {
      message: "Не удалось определить заявку для поддержки.",
      status: "error" as const,
    };
  }

  if (!user) {
    return {
      message: "Для поддержки заявки нужно войти в систему.",
      status: "error" as const,
    };
  }

  const { data: report } = await supabase
    .from("reports")
    .select("user_id")
    .eq("id", reportId)
    .maybeSingle();

  if (report?.user_id === user.id) {
    return {
      message: "Нельзя поддержать собственную заявку.",
      status: "error" as const,
    };
  }

  const { error } = await supabase.from("report_supports").insert({
    report_id: reportId,
    user_id: user.id,
  });

  if (error?.code === "23505") {
    return {
      message: "Ты уже поддержал это обращение.",
      status: "success" as const,
    };
  }

  if (error) {
    return {
      message: getSupportErrorMessage(error.message),
      status: "error" as const,
    };
  }

  revalidatePath("/");
  revalidatePath("/reports");
  revalidatePath(`/reports/${reportId}`);
  revalidatePath("/my-reports");
  revalidatePath("/map");
  revalidatePath("/statistics");

  return {
    message: "Спасибо, твоя поддержка учтена.",
    status: "success" as const,
  };
}
