"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_MAP_CENTER, REPORT_CATEGORIES } from "@/lib/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ReportCategory, ReportInsert } from "@/types";

type ReportFormProps = {
  userId: string;
};

export function ReportForm({ userId }: ReportFormProps) {
  const router = useRouter();
  const [category, setCategory] = useState<ReportCategory>(REPORT_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(String(DEFAULT_MAP_CENTER.lat));
  const [longitude, setLongitude] = useState(String(DEFAULT_MAP_CENTER.lng));
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude)) {
      setErrorMessage("Координаты должны быть числами.");
      setIsSubmitting(false);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const payload: ReportInsert = {
      address: address.trim() || null,
      category,
      description: description.trim(),
      is_anonymous: isAnonymous,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      user_id: userId,
    };

    const { error } = await supabase.from("reports").insert(payload);

    if (error) {
      setErrorMessage("Не удалось сохранить заявку. Попробуй еще раз.");
      setIsSubmitting(false);
      return;
    }

    router.push("/reports/success");
    router.refresh();
  }

  return (
    <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-2 text-sm text-foreground/80">
        Категория
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as ReportCategory)}
          className="rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
        >
          {REPORT_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm text-foreground/80">
        Описание
        <textarea
          required
          rows={5}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Опиши проблему подробнее"
          className="rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-foreground/80">
        Адрес
        <input
          type="text"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Павлодар, район ТОЦ"
          className="rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-foreground/80">
          Широта
          <input
            required
            type="text"
            value={latitude}
            onChange={(event) => setLatitude(event.target.value)}
            className="rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-foreground/80">
          Долгота
          <input
            required
            type="text"
            value={longitude}
            onChange={(event) => setLongitude(event.target.value)}
            className="rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
          />
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm text-foreground/80">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(event) => setIsAnonymous(event.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        Анонимная отправка
      </label>

      {errorMessage ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Отправка..." : "Сообщить о проблеме"}
      </button>
    </form>
  );
}
