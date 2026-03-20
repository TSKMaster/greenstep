"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function supportReport(reportId: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Для поддержки заявки нужно войти в систему.");
  }

  const { data: report, error: selectError } = await supabase
    .from("reports")
    .select("support_count")
    .eq("id", reportId)
    .single();

  if (selectError || !report) {
    throw new Error("Не удалось найти заявку.");
  }

  const { error: updateError } = await supabase
    .from("reports")
    .update({ support_count: report.support_count + 1 })
    .eq("id", reportId);

  if (updateError) {
    throw new Error("Не удалось поддержать заявку.");
  }

  revalidatePath("/reports");
  revalidatePath(`/reports/${reportId}`);
  revalidatePath("/my-reports");
}
