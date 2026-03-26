"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateReportAdminDetails } from "@/app/admin/actions";
import type { RequestStatus } from "@/types";

type AdminReportFormProps = {
  adminComment: string;
  reportId: string;
  status: RequestStatus;
  statusOptions: { label: string; value: RequestStatus }[];
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-2xl bg-primary px-4 py-3 font-semibold !text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70 sm:flex-1"
    >
      {pending ? "Сохранение..." : "Сохранить изменения"}
    </button>
  );
}

const initialState = {
  message: "",
  status: "idle" as "idle" | "success" | "error",
};

export function AdminReportForm({
  adminComment,
  reportId,
  status,
  statusOptions,
}: AdminReportFormProps) {
  const [state, action] = useActionState(updateReportAdminDetails, initialState);

  return (
    <form action={action} className="mt-6 grid gap-4 rounded-3xl border border-border bg-white p-5">
      <input type="hidden" name="report_id" value={reportId} />

      <label className="flex flex-col gap-2 text-sm text-foreground/80">
        Статус
        <select
          name="status"
          defaultValue={status}
          className="rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
        >
          {statusOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm text-foreground/80">
        Комментарий администратора
        <textarea
          name="admin_comment"
          rows={4}
          defaultValue={adminComment}
          placeholder="Напиши комментарий по заявке"
          className="rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
        />
      </label>

      {state.message ? (
        <p
          className={`rounded-2xl px-4 py-3 text-sm ${
            state.status === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <SubmitButton />
      </div>
    </form>
  );
}
