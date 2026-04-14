import { useState, useEffect, useRef, useCallback } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getApiBase } from "../apiBase.js";
import styles from "./About.module.css";

const markdownListTableComponents = {
  ul: ({ node, ...props }) => (
    <ul className={styles.mdUl} {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className={styles.mdOl} {...props} />
  ),
  li: ({ node, ...props }) => <li className={styles.mdLi} {...props} />,
  table: ({ node, ...props }) => (
    <div className={styles.mdTableWrap}>
      <table className={styles.mdTable} {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => (
    <thead className={styles.mdThead} {...props} />
  ),
  tbody: ({ node, ...props }) => <tbody {...props} />,
  tr: ({ node, ...props }) => <tr {...props} />,
  th: ({ node, ...props }) => (
    <th className={styles.mdTh} {...props} />
  ),
  td: ({ node, ...props }) => (
    <td className={styles.mdTd} {...props} />
  ),
};

function About() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brandContent, setBrandContent] = useState(null);
  const [sections, setSections] = useState([]); // все загруженные разделы { topicValue, topicName, content }
  const [loadingContent, setLoadingContent] = useState(false);
  const [contentError, setContentError] = useState(null);
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [sectionsViewMode, setSectionsViewMode] = useState("vertical"); // "vertical" | "horizontal"
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);

        const cleanBaseUrl = getApiBase();
        const apiUrl = cleanBaseUrl
          ? `${cleanBaseUrl}/api/v2/botservice/brands`
          : "/api/v2/botservice/brands";

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
          mode: "cors", // Явно указываем CORS режим
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          throw new Error(
            `HTTP error! status: ${response.status}${
              errorText ? `: ${errorText}` : ""
            }`
          );
        }

        const data = await response.json();
        console.log("API Response:", data); // Для отладки

        // Обработка разных форматов ответа
        let brandsArray = [];
        if (Array.isArray(data)) {
          brandsArray = data;
        } else if (data && Array.isArray(data.data)) {
          brandsArray = data.data;
        } else if (data && Array.isArray(data.items)) {
          brandsArray = data.items;
        } else if (data && typeof data === "object") {
          // Если это объект с ключами, преобразуем в массив
          brandsArray = Object.values(data);
        } else {
          throw new Error("Неожиданный формат данных от API");
        }

        setBrands(brandsArray);
      } catch (err) {
        // Улучшенная обработка ошибок
        let errorMessage = err.message;
        if (
          err.name === "TypeError" &&
          err.message.includes("Failed to fetch")
        ) {
          errorMessage =
            "Ошибка подключения к API серверу. Возможные причины: CORS проблема, сервер недоступен или неправильный URL.";
        } else if (err.message.includes("404")) {
          errorMessage = `API endpoint не найден (404). Проверьте URL API: ${apiUrl}`;
        }
        setError(errorMessage);
        console.error("Error fetching brands:", err);
        console.error("API URL was:", apiUrl);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      const cleanBaseUrl = getApiBase();
      const topicsUrl = cleanBaseUrl
        ? `${cleanBaseUrl}/api/v2/text/categories`
        : "/api/v2/text/categories";

      try {
        setTopicsLoading(true);
        setTopicsError(null);

        const response = await fetch(topicsUrl, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
          mode: "cors",
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          throw new Error(
            `HTTP error! status: ${response.status}${
              errorText ? `: ${errorText}` : ""
            }`
          );
        }

        const data = await response.json();
        console.log("Topics API Response:", data);

        // Обработка разных форматов ответа
        let topicsArray = [];
        if (Array.isArray(data)) {
          topicsArray = data;
        } else if (data && Array.isArray(data.data)) {
          topicsArray = data.data;
        } else if (data && Array.isArray(data.items)) {
          topicsArray = data.items;
        } else if (data && typeof data === "object") {
          topicsArray = Object.values(data);
        } else {
          throw new Error("Неожиданный формат данных от API");
        }

        setTopics(topicsArray);
      } catch (err) {
        let errorMessage = err.message;
        if (
          err.name === "TypeError" &&
          err.message.includes("Failed to fetch")
        ) {
          errorMessage =
            "Ошибка подключения к API серверу. Возможные причины: CORS проблема, сервер недоступен или неправильный URL.";
        } else if (err.message.includes("404")) {
          errorMessage = `API endpoint не найден (404). Проверьте URL API: ${topicsUrl}`;
        }
        setTopicsError(errorMessage);
        console.error("Error fetching topics:", err);
        setTopics([]);
      } finally {
        setTopicsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchBrandContent = async () => {
      if (!selectedBrand || !brands.length) {
        setBrandContent(null);
        setSections([]);
        return;
      }

      try {
        setLoadingContent(true);
        setContentError(null);

        const selected = brands.find((brand) => {
          const brandValue =
            brand?.id || brand?.Id || brand?.name_rus || brand?.name;
          return String(brandValue) === String(selectedBrand);
        });

        if (!selected) {
          throw new Error("Выбранный бренд не найден");
        }

        const brandCode =
          selected?.code ||
          selected?.code_en ||
          selected?.code_ru ||
          (selected?.name_rus || selected?.name || "")
            .toLowerCase()
            .replace(/\s+/g, "_");

        const cleanBaseUrl = getApiBase();
        const infodataUrl = cleanBaseUrl
          ? `${cleanBaseUrl}/api/v2/infodata/brand`
          : "/api/v2/infodata/brand";

        const response = await fetch(infodataUrl, {
          method: "GET",
          headers: { accept: "application/json" },
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          throw new Error(
            `HTTP error! status: ${response.status}${
              errorText ? `: ${errorText}` : ""
            }`
          );
        }

        const data = await response.json();

        // data.data — массив брендов: { entity: { Code, Name, Type: "brand" }, categories: [ { code, name, content: [...], children: [...] } ] }
        // Поддержка и camelCase, и PascalCase (бэкенд может отдавать по-разному в dev/prod)
        const brandsData = Array.isArray(data?.data) ? data.data : [];
        const brandItem = brandsData.find(
          (b) =>
            (b?.entity?.Code ?? b?.entity?.code ?? "")
              .toString()
              .toLowerCase() === brandCode.toString().toLowerCase()
        );
        const categories = Array.isArray(brandItem?.categories)
          ? brandItem.categories
          : Array.isArray(brandItem?.Categories)
          ? brandItem.Categories
          : [];

        const sectionsList = categories
          .map((cat) => {
            const topicValue = cat?.code ?? cat?.Code ?? "";
            const topicName = cat?.name ?? cat?.Name ?? topicValue;
            const contentParts = [];

            // Контент уровня категории (бренд)
            const catContent = cat?.content ?? cat?.Content ?? [];
            if (Array.isArray(catContent)) {
              catContent.forEach((item) => {
                const name = (item?.name ?? item?.Name ?? "").trim();
                const text = (item?.text ?? item?.Text ?? "").trim();
                if (text)
                  contentParts.push(name ? `### ${name}\n\n${text}` : text);
              });
            }

            // Дочерние элементы (модели) — поддержка children и Children (PascalCase с продакшн-API)
            const children = cat?.children ?? cat?.Children ?? [];
            if (Array.isArray(children)) {
              children.forEach((child) => {
                const modelName =
                  child?.Entity?.Name ??
                  child?.entity?.Name ??
                  child?.entity?.name ??
                  "";
                const childContent = child?.content ?? child?.Content ?? [];
                if (Array.isArray(childContent) && childContent.length > 0) {
                  if (modelName) contentParts.push(`#### ${modelName}`);
                  childContent.forEach((item) => {
                    const name = (item?.name ?? item?.Name ?? "").trim();
                    const text = (item?.text ?? item?.Text ?? "").trim();
                    if (text)
                      contentParts.push(name ? `**${name}**\n\n${text}` : text);
                  });
                }
              });
            }

            const content = contentParts.join("\n\n");
            return content ? { topicValue, topicName, content } : null;
          })
          .filter(Boolean);
        setSections(sectionsList);

        const fullContent = sectionsList
          .map(({ topicName, content }) => `## ${topicName}\n\n${content}`)
          .join("\n\n");
        setBrandContent(fullContent || null);
      } catch (err) {
        setContentError(err.message);
        console.error("Error fetching brand content:", err);
        setBrandContent(null);
        setSections([]);
      } finally {
        setLoadingContent(false);
      }
    };

    fetchBrandContent();
  }, [selectedBrand, brands]);

  const openSection = useCallback((topicValue) => {
    const key = String(topicValue);
    setExpandedSections((prev) => new Set(prev).add(key));
    setTimeout(() => {
      const el = sectionRefs.current[key];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  const toggleSection = useCallback((topicValue) => {
    const key = String(topicValue);
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1440);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isSmallScreen && sectionsViewMode !== "vertical") {
      setSectionsViewMode("vertical");
      if (selectedTopic) {
        setExpandedSections(new Set([String(selectedTopic)]));
      }
    }
  }, [isSmallScreen, sectionsViewMode, selectedTopic]);

  useEffect(() => {
    if (selectedTopic && sections.length > 0) {
      setExpandedSections(
        sectionsViewMode === "horizontal"
          ? new Set(sections.map((s) => String(s.topicValue)))
          : new Set([String(selectedTopic)])
      );
      const key = String(selectedTopic);
      setTimeout(() => {
        const el = sectionRefs.current[key];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [selectedTopic, sections, sectionsViewMode]);

  return (
    <div className={styles.page}>
      {/* <h2>Материалы</h2> */}
      <div className={styles.panelLinkWrap}>
        <a
          href="https://content.constrtodo.ru:3444/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.panelLink}
        >
          <img
            src="./Panel.png"
            alt="Перейти в панель управления"
            className={styles.panelImg}
          />
        </a>
      </div>
      <p>Список наших материалов и информация о них</p>
      {loading && <p>Загрузка...</p>}
      {error && (
        <div className={styles.errorBox}>
          <p>Ошибка: {error}</p>
          {import.meta.env.PROD ? (
            <div className={styles.errorHint}>
              <p>
                Для работы API необходимо настроить переменную окружения
                VITE_API_URL.
              </p>
              <p>Создайте файл .env.production с содержимым:</p>
              <code className={styles.errorCode}>
                VITE_API_URL=https://your-api-server.com
              </code>
            </div>
          ) : (
            <p className={styles.errorHintPlain}>
              Проверьте, что API сервер запущен на http://localhost:3005
            </p>
          )}
        </div>
      )}
      {!loading && !error && brands.length === 0 && (
        <p className={styles.muted}>Бренды не найдены</p>
      )}
      <div className={styles.controlsRow}>
        <select
          name="brand"
          id="brand"
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            setSelectedTopic("");
            setExpandedSections(new Set());
          }}
          className={styles.select}
          disabled={loading || error || brands.length === 0}
        >
          <option value="">Выберите бренд</option>
          {brands.map((brand, index) => {
            const brandName =
              brand?.name_rus ||
              brand?.name ||
              brand?.Name ||
              `Бренд ${index + 1}`;
            const brandValue =
              brand?.id ||
              brand?.Id ||
              brand?.name_rus ||
              brand?.name ||
              brandName;

            return (
              <option key={index} value={brandValue}>
                {brandName}
              </option>
            );
          })}
        </select>

        {selectedBrand && (
          <>
            {topicsLoading && (
              <p className={styles.topicsLoading}>
                {(() => {
                  // Если выбран раздел, показываем его название
                  if (selectedTopic) {
                    const currentTopic = topics.find(
                      (topic) =>
                        String(
                          topic?.id ||
                            topic?.Id ||
                            topic?.code ||
                            topic?.Code ||
                            ""
                        ) === String(selectedTopic) ||
                        String(
                          topic?.description ||
                            topic?.Description ||
                            topic?.name ||
                            topic?.Name ||
                            ""
                        ) === String(selectedTopic)
                    );
                    if (currentTopic) {
                      const topicName =
                        currentTopic?.description ||
                        currentTopic?.Description ||
                        currentTopic?.name ||
                        currentTopic?.Name ||
                        currentTopic?.code ||
                        currentTopic?.Code ||
                        "раздела";
                      return `Загрузка ${topicName}...`;
                    }
                  }
                  // Если загружается раздел с code === "brand_line_info"
                  const brandLineInfoTopic = topics.find(
                    (topic) =>
                      topic?.code === "brand_line_info" ||
                      topic?.Code === "brand_line_info"
                  );
                  if (brandLineInfoTopic) {
                    const topicName =
                      brandLineInfoTopic?.description ||
                      brandLineInfoTopic?.Description ||
                      brandLineInfoTopic?.name ||
                      brandLineInfoTopic?.Name ||
                      "раздела";
                    return `Загрузка ${topicName}...`;
                  }
                  // По умолчанию
                  return "Загрузка разделов...";
                })()}
              </p>
            )}
            {topicsError && (
              <div className={styles.topicsError}>
                Ошибка загрузки разделов: {topicsError}
              </div>
            )}
            <select
              value={selectedTopic}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedTopic(val);
                if (val) openSection(val);
              }}
              className={styles.select}
              disabled={topicsLoading || topicsError || topics.length === 0}
            >
              <option value="">Все разделы</option>
              {topics.map((topic, index) => {
                const topicDescription =
                  topic?.description ||
                  topic?.Description ||
                  topic?.name ||
                  topic?.Name ||
                  `Раздел ${index + 1}`;
                const topicValue =
                  topic?.id ||
                  topic?.Id ||
                  topic?.code ||
                  topic?.Code ||
                  topic?.description ||
                  String(index);

                return (
                  <option key={index} value={topicValue}>
                    {topicDescription}
                  </option>
                );
              })}
            </select>
          </>
        )}
      </div>
      {selectedBrand && (
        <div className={styles.contentPanel}>
          {loadingContent && <p>Загрузка всех разделов...</p>}
          {contentError && (
            <div className={styles.contentError}>
              <p>Ошибка загрузки информации: {contentError}</p>
            </div>
          )}
          {!loadingContent &&
            !contentError &&
            !selectedTopic &&
            brandContent && (
              <div className={styles.markdownBody}>
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    ...markdownListTableComponents,
                    h2: ({ node, ...props }) => {
                      const handleClick = (e) => {
                        const text = e.currentTarget.textContent?.trim() ?? "";
                        const section = sections.find(
                          (s) => (s.topicName?.trim() ?? "") === text
                        );
                        if (section) {
                          setSelectedTopic(String(section.topicValue));
                          openSection(section.topicValue);
                        }
                      };
                      return (
                        <h2
                          role="button"
                          tabIndex={0}
                          className={styles.mdH2}
                          onClick={handleClick}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.currentTarget.click();
                            }
                          }}
                          {...props}
                        />
                      );
                    },
                    h3: ({ node, ...props }) => (
                      <h3 className={styles.mdH3} {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                      <h4 className={styles.mdH4} {...props} />
                    ),
                  }}
                >
                  {brandContent}
                </Markdown>
              </div>
            )}
          {!loadingContent &&
            !contentError &&
            selectedTopic &&
            sections.length > 0 && (
              <div
                className={`${styles.contentPanelSections} ${
                  sectionsViewMode === "horizontal"
                    ? styles.contentPanelSectionsGrid
                    : styles.contentPanelSectionsVertical
                }`}
              >
                <div className={styles.viewToggleWrap}>
                  <button
                    type="button"
                    disabled={isSmallScreen}
                    onClick={() => {
                      if (isSmallScreen) return;
                      setSectionsViewMode((prev) => {
                        const next =
                          prev === "vertical" ? "horizontal" : "vertical";
                        if (next === "horizontal") {
                          setExpandedSections(
                            new Set(sections.map((s) => String(s.topicValue)))
                          );
                        } else {
                          setExpandedSections(new Set([String(selectedTopic)]));
                        }
                        return next;
                      });
                    }}
                    className={`${styles.viewToggle} ${
                      isSmallScreen
                        ? styles.viewToggleDisabled
                        : sectionsViewMode === "horizontal"
                          ? styles.viewToggleActive
                          : styles.viewToggleInactive
                    }`}
                    aria-label={
                      isSmallScreen
                        ? "На этом экране доступен только вид списком"
                        : sectionsViewMode === "vertical"
                        ? "Переключить на вид сеткой"
                        : "Переключить на вид списком"
                    }
                    title={
                      isSmallScreen
                        ? "На этом экране доступен только вид списком"
                        : sectionsViewMode === "vertical"
                        ? "Сетка"
                        : "Список"
                    }
                  >
                    {sectionsViewMode === "vertical" ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <rect x="2" y="2" width="8" height="8" rx="1" />
                        <rect x="14" y="2" width="8" height="8" rx="1" />
                        <rect x="2" y="14" width="8" height="8" rx="1" />
                        <rect x="14" y="14" width="8" height="8" rx="1" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="4" y1="12" x2="20" y2="12" />
                        <line x1="4" y1="18" x2="20" y2="18" />
                      </svg>
                    )}
                  </button>
                </div>
                <div
                  className={`${styles.sectionsRoot} ${
                    sectionsViewMode === "horizontal"
                      ? styles.sectionsRootGrid
                      : ""
                  }`}
                >
                  {sections.map((section) => {
                    const key = String(section.topicValue);
                    const isVertical = sectionsViewMode === "vertical";
                    const isExpanded = isVertical
                      ? expandedSections.has(key)
                      : true;
                    return (
                      <section
                        key={key}
                        ref={(el) => {
                          sectionRefs.current[key] = el;
                        }}
                        className={`${styles.sectionCard} ${
                          isExpanded
                            ? styles.sectionCardExpanded
                            : styles.sectionCardCollapsed
                        } ${
                          sectionsViewMode === "vertical"
                            ? styles.sectionCardVertical
                            : styles.sectionCardHorizontal
                        }`}
                      >
                        <h2
                          role={isVertical ? "button" : undefined}
                          tabIndex={isVertical ? 0 : undefined}
                          onClick={() => {
                            if (isVertical) toggleSection(section.topicValue);
                            setSelectedTopic(key);
                          }}
                          onKeyDown={
                            isVertical
                              ? (e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    toggleSection(section.topicValue);
                                    setSelectedTopic(key);
                                  }
                                }
                              : undefined
                          }
                          className={`${styles.sectionTitle} ${
                            isVertical
                              ? styles.sectionTitleClickable
                              : styles.sectionTitleStatic
                          } ${
                            isExpanded
                              ? styles.sectionTitleBorderOn
                              : styles.sectionTitleBorderOff
                          }`}
                        >
                          <span>{section.topicName}</span>
                          {isVertical && (
                            <span className={styles.sectionChevron}>
                              {isExpanded ? "▼" : "▶"}
                            </span>
                          )}
                        </h2>
                        {isExpanded && (
                          <div
                            className={`${styles.sectionBody} ${
                              sectionsViewMode === "horizontal"
                                ? styles.sectionBodyHorizontal
                                : ""
                            }`}
                          >
                            <Markdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                ...markdownListTableComponents,
                                h3: ({ node, ...props }) => (
                                  <h3 className={styles.mdH3} {...props} />
                                ),
                                h4: ({ node, ...props }) => (
                                  <h4 className={styles.mdH4} {...props} />
                                ),
                              }}
                            >
                              {section.content}
                            </Markdown>
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>
              </div>
            )}
          {!loadingContent &&
            !contentError &&
            !brandContent &&
            sections.length === 0 && (
              <div className={styles.emptyState}>
                <p>Информация по разделам не найдена.</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default About;
