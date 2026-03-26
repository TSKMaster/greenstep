function normalizeMessage(message: string) {
  return message.trim().toLowerCase();
}

export function getAuthErrorMessage(message: string) {
  const normalized = normalizeMessage(message);

  if (normalized.includes("email rate limit exceeded")) {
    return "Слишком много попыток отправки. Подожди немного и попробуй снова.";
  }

  if (normalized.includes("email address not authorized")) {
    return "Этот адрес пока не разрешен для отправки писем. Проверь SMTP-настройки проекта.";
  }

  if (normalized.includes("invalid email")) {
    return "Проверь email: адрес выглядит некорректно.";
  }

  if (normalized.includes("failed to fetch") || normalized.includes("network")) {
    return "Не удалось связаться с сервером. Проверь интернет и попробуй еще раз.";
  }

  return "Не удалось отправить ссылку для входа. Попробуй еще раз.";
}

export function getReportSubmissionErrorMessage(message: string) {
  const normalized = normalizeMessage(message);

  if (
    normalized.includes("auth session missing") ||
    normalized.includes("not authenticated") ||
    normalized.includes("invalid jwt") ||
    normalized.includes("jwt")
  ) {
    return "Сессия входа не найдена или истекла. Войди в приложение заново и повтори отправку.";
  }

  if (normalized.includes("storage") || normalized.includes("photo")) {
    return "Не удалось загрузить фото. Попробуй другой файл или отправь заявку без фото.";
  }

  if (
    normalized.includes("row-level security") ||
    normalized.includes("permission denied")
  ) {
    return "Недостаточно прав для отправки заявки. Попробуй войти заново.";
  }

  if (normalized.includes("failed to fetch") || normalized.includes("network")) {
    return "Не удалось отправить заявку из-за проблемы с сетью. Попробуй еще раз.";
  }

  if (normalized.includes("randomuuid")) {
    return "Не удалось подготовить фото для отправки в этом браузере. Попробуй выбрать фото заново или отправь заявку без фото.";
  }

  return "Не удалось отправить заявку. Попробуй еще раз.";
}

export function getSupportErrorMessage(message: string) {
  const normalized = normalizeMessage(message);

  if (normalized.includes("duplicate") || normalized.includes("already")) {
    return "Ты уже поддержал это обращение.";
  }

  if (normalized.includes("own")) {
    return "Нельзя поддержать собственную заявку.";
  }

  if (normalized.includes("auth")) {
    return "Чтобы поддержать заявку, нужно войти в систему заново.";
  }

  return "Не удалось поддержать заявку. Попробуй еще раз.";
}

export function getAdminUpdateErrorMessage(message: string) {
  const normalized = normalizeMessage(message);

  if (normalized.includes("status")) {
    return "Не удалось сохранить изменения: передан неверный статус.";
  }

  if (
    normalized.includes("permission") ||
    normalized.includes("forbidden") ||
    normalized.includes("доступ")
  ) {
    return "Недостаточно прав для сохранения изменений.";
  }

  return "Не удалось сохранить изменения по заявке. Попробуй еще раз.";
}
