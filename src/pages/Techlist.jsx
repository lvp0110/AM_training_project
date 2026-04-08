import { useState, useEffect, useMemo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getApiBase } from "../apiBase.js";
import styles from "./Techlist.module.css";
import productPhoto from "../assets/techlist-product.png";
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
      <div className={styles.iconBox}>{icon}</div>
      <div className={styles.sectionBody}>
        <div className={styles.sectionTitle}>{title}</div>
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

const TECHCARD_MODEL_SLUG = "100gidro";

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

function Techlist() {
  const [productTitle, setProductTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [toCode, setToCode] = useState("");
  const [description, setDescription] = useState("");
  const [techcardContent, setTechcardContent] = useState([]);

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

  const mid = Math.ceil(contentSections.length / 2);
  const leftSections = contentSections.slice(0, mid);
  const rightSections = contentSections.slice(mid);

  useEffect(() => {
    let cancelled = false;
    const fetchTechcard = async () => {
      const base = getApiBase();
      /** Dev: пустой base → `/api` и прокси Vite. Production (в т.ч. GitHub Pages): абсолютный URL из env или src/apiBase.js. */
      const url = base
        ? `${base}/api/v2/techcard/model/${TECHCARD_MODEL_SLUG}`
        : `/api/v2/techcard/model/${TECHCARD_MODEL_SLUG}`;
      try {
        const response = await fetch(url, {
          headers: { accept: "application/json" },
          mode: "cors",
        });
        const json = await response.json().catch(() => null);
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
        if (!cancelled && title) {
          setProductTitle(title);
        }
        if (!cancelled && code) {
          setToCode(code);
        }
        if (!cancelled && desc) {
          setDescription(desc);
        }
        if (!cancelled) {
          setSubtitle(sub);
          setTechcardContent(sectionsList);
        }
        if (import.meta.env.DEV && !cancelled && !response.ok) {
          console.warn(
            "[Techlist] techcard API:",
            response.status,
            url,
            json
          );
        }
      } catch (e) {
        if (import.meta.env.DEV) {
          console.warn("[Techlist] techcard fetch failed:", url, e);
        }
      }
    };
    fetchTechcard();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.page}>
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
              aria-label="Акустика помещений, QR-код"
            >
              <div className={styles.sideBarBottomStack}>
                <div className={styles.sideFooter}>АКУСТИКА ПОМЕЩЕНИЙ</div>
               
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
              <img
                className={styles.productImg}
                src={productPhoto}
                alt="Панели Акуфон НГ Стандарт"
              />
            </div>

            <div className={styles.grid}>
              <div className={`${styles.col} ${styles.colLeft}`}>
                {leftSections.map((s) => (
                  <Section
                    key={s.key}
                    icon={iconForTechcardCode(s.code)}
                    title={s.title}
                    text={s.text}
                    markdownComponents={techIntroMarkdownComponents}
                  />
                ))}
              </div>

              <div className={`${styles.col} ${styles.colRight}`}>
                {rightSections.map((s) => (
                  <Section
                    key={s.key}
                    icon={iconForTechcardCode(s.code)}
                    title={s.title}
                    text={s.text}
                    markdownComponents={techIntroMarkdownComponents}
                  />
                ))}
              </div>
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
  );
}

export default Techlist;
