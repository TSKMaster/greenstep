"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReportLocationPickerLoader } from "@/components/reports/report-location-picker-loader";
import { DEFAULT_MAP_CENTER, REPORT_CATEGORIES } from "@/lib/constants";
import { getReportSubmissionErrorMessage } from "@/lib/error-messages";
import {
  REPORT_DESCRIPTION_MAX_LENGTH,
  REPORT_DESCRIPTION_MIN_LENGTH,
  type ReportFieldErrors,
  validateReportForm,
} from "@/lib/report-validation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ReportCategory, ReportInsert } from "@/types";

const REPORT_PHOTOS_BUCKET = "report-photos";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type ReportFormProps = {
  userId: string;
};

function createUploadId() {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getFileExtension(file: File) {
  const parts = file.name.split(".");
  return parts.length > 1 ? parts.at(-1)?.toLowerCase() ?? "jpg" : "jpg";
}

export function ReportForm({ userId }: ReportFormProps) {
  const router = useRouter();
  const [category, setCategory] = useState<ReportCategory>(REPORT_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(String(DEFAULT_MAP_CENTER.lat));
  const [longitude, setLongitude] = useState(String(DEFAULT_MAP_CENTER.lng));
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ReportFieldErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(photoFile);
    setPhotoPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [photoFile]);

  function updateCoordinates(nextLatitude: number, nextLongitude: number) {
    setLatitude(nextLatitude.toFixed(6));
    setLongitude(nextLongitude.toFixed(6));
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setPhotoFile(null);
      setFieldErrors((current) => ({ ...current, photo: undefined }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFieldErrors((current) => ({
        ...current,
        photo: "Можно загрузить только изображение.",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFieldErrors((current) => ({
        ...current,
        photo: "Фото должно быть не больше 5 МБ.",
      }));
      event.target.value = "";
      return;
    }

    setErrorMessage("");
    setFieldErrors((current) => ({ ...current, photo: undefined }));
    setPhotoFile(file);
  }

  async function uploadPhoto() {
    if (!photoFile) {
      return null;
    }

    const supabase = createSupabaseBrowserClient();
    const fileExtension = getFileExtension(photoFile);
    const filePath = `${userId}/${createUploadId()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from(REPORT_PHOTOS_BUCKET)
      .upload(filePath, photoFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: photoFile.type,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(REPORT_PHOTOS_BUCKET).getPublicUrl(filePath);

    return publicUrl;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const validation = validateReportForm({
      address,
      description,
      latitude,
      longitude,
    });

    if (!validation.data) {
      setFieldErrors(validation.fieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw new Error(authError.message);
      }

      if (!user) {
        throw new Error("auth session missing");
      }

      const photoUrl = await uploadPhoto();
      const payload: ReportInsert = {
        address: validation.data.address,
        category,
        description: validation.data.description,
        is_anonymous: isAnonymous,
        latitude: validation.data.latitude,
        longitude: validation.data.longitude,
        photo_url: photoUrl,
        user_id: userId,
      };

      const { error } = await supabase.from("reports").insert(payload);

      if (error) {
        throw new Error(error.message);
      }

      router.push("/reports/success");
      router.refresh();
    } catch (error) {
      console.error("Failed to submit report", error);

      const fallbackMessage =
        error instanceof Error
          ? getReportSubmissionErrorMessage(error.message)
          : "Не удалось отправить заявку. Попробуй еще раз.";
      const detailedMessage =
        process.env.NODE_ENV !== "production" &&
        error instanceof Error &&
        fallbackMessage === "Не удалось отправить заявку. Попробуй еще раз."
          ? `${fallbackMessage} Причина: ${error.message}`
          : fallbackMessage;

      setErrorMessage(detailedMessage);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  }

  return (
    <form className="mt-6 flex flex-col gap-4 lg:mt-0 lg:gap-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch">
        <section className="rounded-[28px] border border-[#d4e4d2] bg-[#f7fbf6] p-4 shadow-sm lg:flex lg:h-full lg:flex-col lg:p-5">
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6c8770]">
              Шаг 1
            </p>
            <h2 className="mt-2 text-xl font-semibold text-primary-dark">
              Отметь точку на карте
            </h2>
            <p className="mt-2 text-sm leading-6 text-foreground/70">
              Нажми на карту, чтобы поставить точку проблемы. Координаты ниже
              обновятся автоматически.
            </p>
          </div>

          <div className="mt-4 lg:flex lg:flex-1 lg:flex-col lg:pb-4">
            <ReportLocationPickerLoader
              latitude={Number(latitude)}
              longitude={Number(longitude)}
              onChange={updateCoordinates}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-auto">
            <label className="flex flex-col gap-2 text-sm text-foreground/80">
              Широта
              <input
                required
                type="text"
                value={latitude}
                onChange={(event) => {
                  setLatitude(event.target.value);
                  setFieldErrors((current) => ({ ...current, latitude: undefined }));
                }}
                inputMode="decimal"
                className={`rounded-2xl border bg-white px-4 py-3 outline-none transition focus:border-primary ${
                  fieldErrors.latitude ? "border-red-400" : "border-border"
                }`}
              />
              {fieldErrors.latitude ? (
                <p className="text-xs text-red-700">{fieldErrors.latitude}</p>
              ) : null}
            </label>

            <label className="flex flex-col gap-2 text-sm text-foreground/80">
              Долгота
              <input
                required
                type="text"
                value={longitude}
                onChange={(event) => {
                  setLongitude(event.target.value);
                  setFieldErrors((current) => ({ ...current, longitude: undefined }));
                }}
                inputMode="decimal"
                className={`rounded-2xl border bg-white px-4 py-3 outline-none transition focus:border-primary ${
                  fieldErrors.longitude ? "border-red-400" : "border-border"
                }`}
              />
              {fieldErrors.longitude ? (
                <p className="text-xs text-red-700">{fieldErrors.longitude}</p>
              ) : null}
            </label>
          </div>
        </section>

        <div className="flex flex-col gap-4 lg:h-full">
          <section className="rounded-[28px] border border-[#d4e4d2] bg-[#f7fbf6] p-4 shadow-sm lg:h-full lg:p-5">
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6c8770]">
                Шаг 2
              </p>
              <h2 className="text-xl font-semibold text-primary-dark">
                Опиши обращение
              </h2>
              <p className="text-sm leading-6 text-foreground/70">
                Укажи тип проблемы, коротко опиши ситуацию и добавь адрес, чтобы
                модератору было проще быстро среагировать.
              </p>
            </div>

            <div className="mt-4 space-y-4">
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
                  onChange={(event) => {
                    setDescription(event.target.value);
                    setFieldErrors((current) => ({ ...current, description: undefined }));
                  }}
                  placeholder="Опиши проблему подробнее"
                  className={`rounded-2xl border bg-white px-4 py-3 outline-none transition focus:border-primary ${
                    fieldErrors.description ? "border-red-400" : "border-border"
                  }`}
                />
                <div className="flex items-start justify-between gap-3 text-xs">
                  <span className="text-red-700">{fieldErrors.description ?? ""}</span>
                  <span className="ml-auto whitespace-nowrap text-foreground/50">
                    {description.trim().length}/{REPORT_DESCRIPTION_MAX_LENGTH}
                  </span>
                </div>
                <p className="text-xs text-foreground/60">
                  Минимум {REPORT_DESCRIPTION_MIN_LENGTH} символов, чтобы было понятно,
                  что произошло.
                </p>
              </label>

              <label className="flex flex-col gap-2 text-sm text-foreground/80">
                Адрес
                <input
                  type="text"
                  value={address}
                  onChange={(event) => {
                    setAddress(event.target.value);
                    setFieldErrors((current) => ({ ...current, address: undefined }));
                  }}
                  placeholder="Павлодар, район ТД"
                  className={`rounded-2xl border bg-white px-4 py-3 outline-none transition focus:border-primary ${
                    fieldErrors.address ? "border-red-400" : "border-border"
                  }`}
                />
                {fieldErrors.address ? (
                  <p className="text-xs text-red-700">{fieldErrors.address}</p>
                ) : null}
              </label>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#d4e4d2] bg-[#f7fbf6] p-4 shadow-sm lg:p-5">
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6c8770]">
                Шаг 3
              </p>
              <h2 className="text-xl font-semibold text-primary-dark">
                Добавь фото
              </h2>
              <p className="text-sm leading-6 text-foreground/70">
                На компьютере можно выбрать файл, а на телефоне часто доступна
                сразу камера. Поддерживаются обычные изображения до 5 МБ.
              </p>
            </div>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-border bg-white px-4 py-6 text-center transition hover:bg-surface">
              <span className="text-sm font-semibold text-primary-dark">
                {photoFile ? "Заменить фото" : "Добавить фото"}
              </span>
              <span className="mt-2 text-sm text-foreground/70">
                JPG, PNG, WEBP, HEIC и другие изображения
              </span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
            {fieldErrors.photo ? (
              <p className="mt-3 text-sm text-red-700">{fieldErrors.photo}</p>
            ) : null}

            {photoPreviewUrl ? (
              <div className="mt-4 overflow-hidden rounded-[24px] border border-border bg-white">
                <div className="relative h-56 w-full bg-slate-950 sm:h-64 lg:h-52">
                  <Image
                    src={photoPreviewUrl}
                    alt="Предпросмотр фото заявки"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>

      <section className="rounded-[28px] border border-[#d4e4d2] bg-[#f7fbf6] p-4 shadow-sm lg:p-5">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-6">
          <div>
            <div className="mb-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6c8770]">
                Шаг 4
              </p>
              <h2 className="mt-2 text-xl font-semibold text-primary-dark">
                Подтверди и отправь
              </h2>
            </div>

            {errorMessage ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </p>
            ) : (
              <p className="text-sm leading-6 text-foreground/70">
                Проверь описание, точку и фото. После отправки обращение сразу
                сохранится в базе и появится в общем списке заявок.
              </p>
            )}
          </div>

          <div className="mt-4 flex w-full flex-col gap-2 lg:mt-0 lg:min-w-[240px] lg:self-start">
            <label className="flex items-center justify-start gap-3 text-sm text-foreground/80 lg:justify-center">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(event) => setIsAnonymous(event.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Анонимная отправка
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70 lg:min-w-[240px]"
            >
              {isSubmitting ? "Отправка..." : "Сообщить о проблеме"}
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}
