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

  const { error } = await supabase.from("report_supports").insert({
    report_id: reportId,
    user_id: user.id,
  });

  if (error?.code === "42P01") {
    throw new Error(
      "Для защиты поддержек нужно сначала применить SQL-обновление базы данных.",
    );
  }

  if (error && error.code !== "23505") {
    throw new Error("Не удалось поддержать заявку.");
  }

  revalidatePath("/");
  revalidatePath("/reports");
  revalidatePath(`/reports/${reportId}`);
  revalidatePath("/my-reports");
  revalidatePath("/map");
  revalidatePath("/statistics");
}
