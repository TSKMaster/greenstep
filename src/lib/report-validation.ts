type ReportValidationInput = {
  address: string;
  description: string;
  latitude: string;
  longitude: string;
};

export type ReportFieldErrors = Partial<
  Record<"description" | "address" | "latitude" | "longitude" | "photo", string>
>;

export type ValidatedReportForm = {
  address: string | null;
  description: string;
  latitude: number;
  longitude: number;
};

export const REPORT_DESCRIPTION_MIN_LENGTH = 10;
export const REPORT_DESCRIPTION_MAX_LENGTH = 1000;
export const REPORT_ADDRESS_MAX_LENGTH = 200;

function normalizeCoordinate(value: string) {
  return value.trim().replace(",", ".");
}

function parseCoordinate(value: string) {
  return Number(normalizeCoordinate(value));
}

export function validateReportForm(input: ReportValidationInput): {
  fieldErrors: ReportFieldErrors;
  data: ValidatedReportForm | null;
} {
  const fieldErrors: ReportFieldErrors = {};
  const description = input.description.trim();
  const address = input.address.trim();
  const latitude = parseCoordinate(input.latitude);
  const longitude = parseCoordinate(input.longitude);

  if (!description) {
    fieldErrors.description = "Опиши проблему, чтобы заявку можно было проверить.";
  } else if (description.length < REPORT_DESCRIPTION_MIN_LENGTH) {
    fieldErrors.description = `Добавь чуть больше деталей: минимум ${REPORT_DESCRIPTION_MIN_LENGTH} символов.`;
  } else if (description.length > REPORT_DESCRIPTION_MAX_LENGTH) {
    fieldErrors.description = `Слишком длинное описание. Максимум ${REPORT_DESCRIPTION_MAX_LENGTH} символов.`;
  }

  if (address.length > REPORT_ADDRESS_MAX_LENGTH) {
    fieldErrors.address = `Адрес должен быть короче ${REPORT_ADDRESS_MAX_LENGTH} символов.`;
  }

  if (input.latitude.trim().length === 0) {
    fieldErrors.latitude = "Укажи широту.";
  } else if (Number.isNaN(latitude)) {
    fieldErrors.latitude = "Широта должна быть числом.";
  } else if (latitude < -90 || latitude > 90) {
    fieldErrors.latitude = "Широта должна быть в диапазоне от -90 до 90.";
  }

  if (input.longitude.trim().length === 0) {
    fieldErrors.longitude = "Укажи долготу.";
  } else if (Number.isNaN(longitude)) {
    fieldErrors.longitude = "Долгота должна быть числом.";
  } else if (longitude < -180 || longitude > 180) {
    fieldErrors.longitude = "Долгота должна быть в диапазоне от -180 до 180.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      data: null,
    };
  }

  return {
    fieldErrors,
    data: {
      address: address || null,
      description,
      latitude,
      longitude,
    },
  };
}
