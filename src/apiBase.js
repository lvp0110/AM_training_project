/**
 * Базовый URL API без завершающего «/».
 * Локально без VITE_API_URL запросы идут на `/api` → прокси Vite (vite.config.js).
 * После сборки (GitHub Pages и т.д.) прокси нет: нужен абсолютный хост.
 */
const PRODUCTION_API_DEFAULT = "https://dev3.constrtodo.ru:3005";

export function getApiBase() {
  const fromEnv = (import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (import.meta.env.PROD) return PRODUCTION_API_DEFAULT;
  return "";
}

/**
 * Базовый URL для `/api/v2/techcard/...`.
 * Если задан `VITE_TECHCARD_API_URL`, используется он (например, когда общий `VITE_API_URL`
 * указывает на хост без маршрута techcard — на dev3 `/api/v2/botservice/*` есть, а techcard отдаёт 404).
 */
export function getTechcardApiBase() {
  const dedicated = (import.meta.env.VITE_TECHCARD_API_URL || "")
    .trim()
    .replace(/\/$/, "");
  if (dedicated) return dedicated;
  return getApiBase();
}
