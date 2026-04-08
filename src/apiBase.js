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
