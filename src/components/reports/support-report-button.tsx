"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { SupportReportActionState } from "@/app/reports/actions";
import { supportReportAction } from "@/app/reports/actions";

const initialState: SupportReportActionState = {
  message: "",
  status: "idle",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Отправка..." : "Поддержать обращение"}
    </button>
  );
}

type SupportReportButtonProps = {
  reportId: string;
};

export function SupportReportButton({ reportId }: SupportReportButtonProps) {
  const [state, action] = useActionState(supportReportAction, initialState);

  return (
    <form action={action} className="sm:flex-1">
      <input type="hidden" name="report_id" value={reportId} />
      <SubmitButton />
      {state.message ? (
        <p
          className={`mt-3 rounded-2xl px-4 py-3 text-sm ${
            state.status === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
