import { useState, useEffect, useMemo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTechcardApiBase, getApiBase } from "../apiBase.js";
import styles from "./Techlist.module.css";
import headerLogo from "../assets/acoustic-group-logo.png";

function IconBuilding() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M4 21V9l8-5 8 5v12h-5v-7H9v7H4zm2-2h3v-7h8v7h3v-8.35L12 6.55 6 10.65V19zm5-9h2v2h-2v-2zm0 4h2v2h-2v-2z" />
    </svg>
  );
}

function IconRuler() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M3 21V5a2 2 0 012-2h14v2H5v14h14v2H5a2 2 0 01-2-2zm4-2h2v-3H7v3zm4-5h2v-3h-2v3zm4 2h2V9h-2v7z" />
    </svg>
  );
}

function IconTools() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M22.7 19.3l-7.4-7.4 2.1-2.1-1.4-1.4-2.8 2.8-4.3-4.3a4 4 0 00-5.6 0L2 8.6l1.4 1.4 1.8-1.8a2 2 0 012.8 0L12 13l-4 4 1.4 1.4 4-4 7.4 7.4 2.1-2.1zM4 20l4.9-4.9 1.4 1.4L5.4 21 4 20z" />
    </svg>
  );
}

function IconFlame() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2s4 4 4 9a4 4 0 11-8 0c0-3 2-5.5 2-5.5S8 9 8 12a2 2 0 104 0c0-2.5-1.5-6-1.5-6s3 3 3 7a5 5 0 11-10 0c0-4 3-8 3-8s2 3 2 6z" />
    </svg>
  );
}

function IconLeaf() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.44A9.59 9.59 0 0012 21c4.5-.11 8.59-3.09 9.94-8C23.42 4.22 17.28.51 12 2.93 12 5.52 8.67 7.9 4 11.2c.58-2 2-3.83 4-5.2 3.17-2.27 6.62-2.4 9-.37z" />
    </svg>
  );
}

function IconThumb() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M9 21h9a2 2 0 002-2v-6.3a2 2 0 00-.9-1.7l-3-2a2 2 0 00-.9-.3H14V9a2 2 0 00-2-2H9v14zm-6 0V8h4v13H3z" />
    </svg>
  );
}

function IconGears() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M12 15.5A3.5 3.5 0 018.5 12 3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.4-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0014 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z" />
    </svg>
  );
}

function IconWave() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0v2c-2-4-4-4-6 0s-4 4-6 0-4-4-6 0v-2z" />
    </svg>
  );
}

function Section({ icon, title, text, markdownComponents }) {
  const body = text?.replace(/\r\n/g, "\n").trim();
  if (!body) return null;
  return (
    <div className={`${styles.section} ${styles.block}`}>
      <div className={styles.sectionHeader}>
        <div className={styles.iconBox}>{icon}</div>
        <div className={styles.sectionTitle}>{title}</div>
      </div>
      <div className={styles.sectionBody}>
        <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {body}
        </Markdown>
      </div>
    </div>
  );
}

/** Упрощённый QR (ч/б как на макете); при необходимости заменить на экспорт из Figma */
function QrInSidebar() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        fill="#1a1a1a"
        d="M8 8h16v16H8V8zm4 4v8h8v-8h-8zm20-4h16v16H32V8zm4 4v8h8v-8h-8zM8 40h16v16H8V40zm4 4v8h8v-8h-8zm24-4h4v4h-4v-4zm8 0h4v4h-4v-4zm-8 8h4v4h-4v-4zm8 4h12v12H48v-8h-4v-4h4v-4zm4 8v4h4v-4h-4zm-20-20h4v4h-4v-4zm8 0h12v12H40v-8h-4v-4h4zm4 4v4h4v-4h-4z"
      />
    </svg>
  );
}

/** URL картинки из API: строка, массив, объект с url/src или относительный путь. */
function resolveTechcardTitleImageUrl(raw, apiBase) {
  if (raw == null) return "";
  if (Array.isArray(raw) && raw.length > 0) {
    return resolveTechcardTitleImageUrl(raw[0], apiBase);
  }
  let path = "";
  if (typeof raw === "string") {
    path = raw.trim();
  } else if (typeof raw === "object") {
    const v = raw.url ?? raw.src ?? raw.URL ?? raw.Src;
    path = typeof v === "string" ? v.trim() : "";
  }
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = (apiBase || "").replace(/\/$/, "");
  return base ? `${base}${normalized}` : normalized;
}

const techIntroMarkdownComponents = {
  p: ({ node, ...props }) => <p {...props} />,
  strong: ({ node, ...props }) => <strong {...props} />,
  em: ({ node, ...props }) => <em {...props} />,
  ul: ({ node, ...props }) => <ul {...props} />,
  ol: ({ node, ...props }) => <ol {...props} />,
  li: ({ node, ...props }) => <li {...props} />,
};

/** Иконка колонки по полю Code из API (неизвестные коды — нейтральная иконка). */
const TECHCARD_CODE_ICONS = {
  area_application: IconBuilding,
  pack_info: IconRuler,
  installation: IconTools,
  ecology: IconLeaf,
  features: IconThumb,
  fire_safety: IconFlame,
  acoustic: IconWave,
  edge_variants: IconGears,
};

function iconForTechcardCode(code) {
  const IconCmp = TECHCARD_CODE_ICONS[code] ?? IconGears;
  return <IconCmp />;
}

/** Ответ GET /api/v2/infodata/brand → плоский список { code, name }. */
function parseInfodataBrandRows(json) {
  const raw = Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json?.items)
      ? json.items
      : [];
  const rows = [];
  for (const item of raw) {
    const ent = item?.entity ?? item?.Entity ?? item;
    if (!ent || typeof ent !== "object") continue;
    const code = String(ent?.Code ?? ent?.code ?? "").trim();
    const name = String(ent?.Name ?? ent?.name ?? "").trim();
    const typ = String(ent?.Type ?? ent?.type ?? "brand").toLowerCase();
    if (typ && typ !== "brand") continue;
    if (!code || !name) continue;
    rows.push({ code, name });
  }
  rows.sort((a, b) => a.name.localeCompare(b.name, "ru"));
  return rows;
}

/** Обход дерева categories/children бренда — все Entity с Type model. */
function collectModelCodesFromInfodataNode(node, outSet) {
  if (!node || typeof node !== "object") return;
  const ent = node.Entity ?? node.entity;
  if (ent) {
    const typ = String(ent.Type ?? ent.type ?? "").toLowerCase();
    if (typ === "model") {
      const c = String(ent.Code ?? ent.code ?? "").trim();
      if (c) outSet.add(c);
    }
  }
  const ch = node.children ?? node.Children;
  if (Array.isArray(ch)) {
    for (const x of ch) collectModelCodesFromInfodataNode(x, outSet);
  }
}

/** Код бренда → уникальные Code моделей из вложенности infodata/brand. */
function buildBrandToModelCodesMap(json) {
  const raw = Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json?.items)
      ? json.items
      : [];
  /** @type {Record<string, string[]>} */
  const map = {};
  for (const item of raw) {
    const ent = item?.entity ?? item?.Entity;
    if (!ent || typeof ent !== "object") continue;
    const typ = String(ent.Type ?? ent.type ?? "brand").toLowerCase();
    if (typ !== "brand") continue;
    const brandCode = String(ent.Code ?? ent.code ?? "").trim();
    if (!brandCode) continue;
    const set = new Set();
    const cats = item.categories ?? item.Categories ?? [];
    for (const cat of cats) collectModelCodesFromInfodataNode(cat, set);
    map[brandCode] = Array.from(set).sort();
  }
  return map;
}

/** Ответ GET /api/v2/infodata/model → плоский список { code, name }, только Type model. */
function parseInfodataModelRows(json) {
  const raw = Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json?.items)
      ? json.items
      : [];
  const rows = [];
  for (const item of raw) {
    const ent = item?.entity ?? item?.Entity ?? item;
    if (!ent || typeof ent !== "object") continue;
    const code = String(ent?.Code ?? ent?.code ?? "").trim();
    const name = String(ent?.Name ?? ent?.name ?? "").trim();
    const typ = String(ent?.Type ?? ent?.type ?? "model").toLowerCase();
    if (typ && typ !== "model") continue;
    if (!code || !name) continue;
    rows.push({ code, name });
  }
  rows.sort((a, b) => a.name.localeCompare(b.name, "ru"));
  return rows;
}

function Techlist() {
  const [productTitle, setProductTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [toCode, setToCode] = useState("");
  const [description, setDescription] = useState("");
  const [techcardContent, setTechcardContent] = useState([]);
  const [titleImageSrc, setTitleImageSrc] = useState("");
  /** Бренды из infodata: Code → ключ, Name в списке */
  const [infodataBrands, setInfodataBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandsError, setBrandsError] = useState(null);
  const [selectedBrandCode, setSelectedBrandCode] = useState("");
  /** Коды моделей по коду бренда (из дерева infodata/brand) */
  const [brandToModelCodes, setBrandToModelCodes] = useState({});
  const [infodataModels, setInfodataModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsError, setModelsError] = useState(null);
  const [selectedModelCode, setSelectedModelCode] = useState("");
  /** Загрузка GET /api/v2/techcard/model/{slug} для активного листа */
  const [techcardLoading, setTechcardLoading] = useState(false);
  const [techcardError, setTechcardError] = useState(null);

  const contentSections = useMemo(() => {
    if (!Array.isArray(techcardContent)) return [];
    return techcardContent
      .map((item, index) => {
        const rawText = item?.Text ?? item?.text;
        if (typeof rawText !== "string") return null;
        const text = rawText.replace(/\r\n/g, "\n").trim();
        if (!text) return null;
        const title = String(item?.Name ?? item?.name ?? "").trim();
        if (!title) return null;
        const code = String(item?.Code ?? item?.code ?? "");
        const key = code || `${title}-${index}`;
        return { key, title, text, code };
      })
      .filter(Boolean);
  }, [techcardContent]);

  /** Заголовок сайдбара: Name блока с code area_application (независимо от наличия текста в колонках). */
  const areaApplicationTitle = useMemo(() => {
    if (!Array.isArray(techcardContent)) return "";
    for (const item of techcardContent) {
      const code = String(item?.Code ?? item?.code ?? "").toLowerCase();
      if (code !== "area_application") continue;
      const title = String(item?.Name ?? item?.name ?? "").trim();
      if (title) return title;
    }
    return "";
  }, [techcardContent]);

  const modelsForBrand = useMemo(() => {
    if (!selectedBrandCode) return [];
    const allowed = brandToModelCodes[selectedBrandCode];
    if (!allowed?.length) return [];
    const allow = new Set(allowed);
    return infodataModels.filter((m) => allow.has(m.code));
  }, [selectedBrandCode, brandToModelCodes, infodataModels]);

  useEffect(() => {
    setSelectedModelCode("");
  }, [selectedBrandCode]);

  useEffect(() => {
    const slug = String(selectedModelCode || "").trim();
    if (!slug) {
      setProductTitle("");
      setSubtitle("");
      setToCode("");
      setDescription("");
      setTechcardContent([]);
      setTitleImageSrc("");
      setTechcardError(null);
      setTechcardLoading(false);
      return;
    }

    const ac = new AbortController();
    const fetchTechcard = async () => {
      const base = getTechcardApiBase();
      /** Dev: пустой base → `/api` + прокси Vite. Prod: см. `VITE_TECHCARD_API_URL` / `getTechcardApiBase` в apiBase.js. */
      const pathSlug = encodeURIComponent(slug);
      const url = base
        ? `${base}/api/v2/techcard/model/${pathSlug}`
        : `/api/v2/techcard/model/${pathSlug}`;
      setTechcardLoading(true);
      setTechcardError(null);
      try {
        const response = await fetch(url, {
          headers: { accept: "application/json" },
          mode: "cors",
          signal: ac.signal,
        });
        const json = await response.json().catch(() => null);
        if (!response.ok) {
          const msg =
            (typeof json?.message === "string" && json.message) ||
            `Техлист: ошибка ${response.status}`;
          setTechcardError(msg);
          if (import.meta.env.DEV) {
            console.warn("[Techlist] techcard API:", response.status, url, json);
          }
          return;
        }
        const data = json?.data && typeof json.data === "object" ? json.data : json;
        const rawTitle = data?.title ?? json?.title ?? "";
        const title =
          typeof rawTitle === "string" ? rawTitle.trim() : "";
        const rawCode = data?.to_code ?? json?.to_code ?? "";
        const code =
          typeof rawCode === "string" ? rawCode.trim() : "";
        const rawDesc = data?.description ?? json?.description ?? "";
        const desc =
          typeof rawDesc === "string" ? rawDesc.trim() : "";
        const rawSubtitle =
          data?.subtitle ??
          data?.Subtitle ??
          json?.subtitle ??
          json?.Subtitle ??
          "";
        const sub =
          typeof rawSubtitle === "string" ? rawSubtitle.trim() : "";
        const rawSections = data?.content ?? json?.content;
        const sectionsList = Array.isArray(rawSections) ? rawSections : [];
        const rawTitleImage =
          data?.titleImage ??
          data?.TitleImage ??
          data?.title_image ??
          json?.titleImage ??
          json?.TitleImage ??
          json?.title_image;
        const resolvedImage = resolveTechcardTitleImageUrl(rawTitleImage, base);
        setProductTitle(title);
        setToCode(code);
        setDescription(desc);
        setSubtitle(sub);
        setTechcardContent(sectionsList);
        setTitleImageSrc(resolvedImage);
      } catch (e) {
        if (e?.name === "AbortError") return;
        setTechcardError(
          e?.message || "Не удалось загрузить техлист для модели"
        );
        if (import.meta.env.DEV) {
          console.warn("[Techlist] techcard fetch failed:", url, e);
        }
      } finally {
        if (!ac.signal.aborted) setTechcardLoading(false);
      }
    };
    fetchTechcard();
    return () => ac.abort();
  }, [selectedModelCode]);

  useEffect(() => {
    let cancelled = false;
    const fetchBrands = async () => {
      const base = getApiBase();
      const url = base
        ? `${base}/api/v2/infodata/brand`
        : "/api/v2/infodata/brand";
      try {
        setBrandsLoading(true);
        setBrandsError(null);
        const response = await fetch(url, {
          headers: { accept: "application/json" },
          mode: "cors",
        });
        const json = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(
            json?.message || `HTTP ${response.status}`
          );
        }
        const rows = parseInfodataBrandRows(json);
        const brandModelsMap = buildBrandToModelCodesMap(json);
        if (!cancelled) {
          setInfodataBrands(rows);
          setBrandToModelCodes(brandModelsMap);
        }
      } catch (e) {
        if (!cancelled) {
          setInfodataBrands([]);
          setBrandToModelCodes({});
          setBrandsError(
            e?.message || "Не удалось загрузить список брендов"
          );
        }
        if (import.meta.env.DEV) {
          console.warn("[Techlist] infodata/brand:", url, e);
        }
      } finally {
        if (!cancelled) setBrandsLoading(false);
      }
    };
    fetchBrands();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchModels = async () => {
      const base = getApiBase();
      const url = base
        ? `${base}/api/v2/infodata/model`
        : "/api/v2/infodata/model";
      try {
        setModelsLoading(true);
        setModelsError(null);
        const response = await fetch(url, {
          headers: { accept: "application/json" },
          mode: "cors",
        });
        const json = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(json?.message || `HTTP ${response.status}`);
        }
        const rows = parseInfodataModelRows(json);
        if (!cancelled) setInfodataModels(rows);
      } catch (e) {
        if (!cancelled) {
          setInfodataModels([]);
          setModelsError(
            e?.message || "Не удалось загрузить список моделей"
          );
        }
        if (import.meta.env.DEV) {
          console.warn("[Techlist] infodata/model:", url, e);
        }
      } finally {
        if (!cancelled) setModelsLoading(false);
      }
    };
    fetchModels();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.page}>
      {/* Вне макета листа (.sheet): бренды и модели по infodata */}
      <div className={styles.brandsBar}>
        <div className={styles.brandsBarGroup}>
          <label
            htmlFor="techlist-brand-select"
            className={styles.brandsBarLabel}
          >
            Бренд
          </label>
          {brandsLoading && (
            <span className={styles.brandsMeta}>Загрузка…</span>
          )}
          {!brandsLoading && brandsError && (
            <span className={styles.brandsError} role="alert">
              {brandsError}
            </span>
          )}
          {!brandsLoading && !brandsError && (
            <select
              id="techlist-brand-select"
              className={styles.brandsSelect}
              value={selectedBrandCode}
              onChange={(e) => setSelectedBrandCode(e.target.value)}
            >
              <option value="">Выберите бренд</option>
              {infodataBrands.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className={styles.brandsBarGroup}>
          <label
            htmlFor="techlist-model-select"
            className={styles.brandsBarLabel}
          >
            Модель
          </label>
          {!selectedBrandCode ? (
            <span className={styles.brandsMeta}>Сначала выберите бренд</span>
          ) : modelsLoading ? (
            <span className={styles.brandsMeta}>Загрузка моделей…</span>
          ) : modelsError ? (
            <span className={styles.brandsError} role="alert">
              {modelsError}
            </span>
          ) : (
            <select
              id="techlist-model-select"
              className={styles.brandsSelect}
              value={selectedModelCode}
              onChange={(e) => setSelectedModelCode(e.target.value)}
              disabled={modelsForBrand.length === 0}
            >
              <option value="">
                {modelsForBrand.length === 0
                  ? "Нет моделей для этого бренда"
                  : "Выберите модель"}
              </option>
              {modelsForBrand.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.name}
                </option>
              ))}
            </select>
          )}
          {techcardLoading && (
            <span className={styles.brandsMeta}>Загрузка техлиста…</span>
          )}
          {techcardError && (
            <span className={styles.brandsError} role="alert">
              {techcardError}
            </span>
          )}
        </div>
      </div>

      <div className={styles.sheetScroll}>
        <div className={styles.sheetScaleSlot}>
          <div className={styles.sheetWrapOuter}>
            <div className={styles.sheetWrap}>
              <article
                className={styles.sheet}
                aria-label={
                  productTitle
                    ? `Технический лист ${productTitle}`
                    : "Технический лист"
                }
              >
                <div className={`${styles.sideBarColumn} ${styles.block}`}>
                <div className={`${styles.sideBarTop} ${styles.block}`}>
                  <div className={styles.sideTitle}>{productTitle || "\u00A0"}</div>
                </div>
                <aside
                  className={`${styles.sideBar} ${styles.block}`}
                  aria-label={
                    areaApplicationTitle
                      ? `${areaApplicationTitle}, QR-код`
                      : "Акустика помещений, QR-код"
                  }
                >
                  <div className={styles.sideBarBottomStack}>
                    <div className={styles.sideFooter}>
                      {(areaApplicationTitle || "Акустика помещений").toUpperCase()}
                    </div>
                  </div>
                  <div className={styles.sideQr} title="QR-код">
                    <QrInSidebar />
                  </div>
                </aside>
              </div>

              <div className={styles.body}>
                <header className={`${styles.headerRow} ${styles.block}`}>
                  <div className={styles.logoBlock}>
                    <img
                      className={styles.logoImg}
                      src={headerLogo}
                      alt="Acoustic Group"
                      decoding="async"
                    />
                  </div>
                  <div className={styles.meta}>
                    Технический лист № 1.1&nbsp;&nbsp;Версия от 15.11.2021
                  </div>
                </header>

                <div className={`${styles.topBand} ${styles.block}`}>
                  <div className={styles.topBandLeft}>
                    <h1 className={styles.productName}>{productTitle || "\u00A0"}</h1>
                    <p className={styles.subtitle}>{subtitle || "\u00A0"}</p>
                    <p className={styles.tu}>{toCode || "\u00A0"}</p>
                    <div className={styles.intro}>
                      {description ? (
                        <Markdown
                          remarkPlugins={[remarkGfm]}
                          components={techIntroMarkdownComponents}
                        >
                          {description}
                        </Markdown>
                      ) : (
                        "\u00A0"
                      )}
                    </div>
                  </div>
                  {titleImageSrc ? (
                    <img
                      className={styles.productImg}
                      src={titleImageSrc}
                      alt={productTitle || "Панели Акуфон НГ Стандарт"}
                      decoding="async"
                    />
                  ) : (
                    <div className={styles.productImgPlaceholder} aria-hidden />
                  )}
                </div>

                <div className={styles.grid}>
                  {contentSections.map((s) => (
                    <Section
                      key={s.key}
                      icon={iconForTechcardCode(s.code)}
                      title={s.title}
                      text={s.text}
                      markdownComponents={techIntroMarkdownComponents}
                    />
                  ))}
                </div>

                <footer className={`${styles.footer} ${styles.block}`}>
                  <div className={styles.footerLine}>Группа компаний «Акустик Групп».</div>
                  <div className={styles.footerLine}>Техподдержка: 8 (800) 222-08-77</div>
                  <div className={styles.footerLine}>support@acoustic.ru, www.acoustic.ru</div>
                </footer>
              </div>
            </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Techlist;
