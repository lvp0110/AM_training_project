import { useState, useEffect, useRef, useCallback } from "react";
import Markdown from "react-markdown";

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
  const sectionRefs = useRef({});

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);

        // Определяем базовый URL API
        // В development используем относительный путь (проксируется через Vite)
        // В production используем переменную окружения VITE_API_URL
        const apiBaseUrl = import.meta.env.VITE_API_URL || "";
        // Убираем завершающий слэш, если есть
        const cleanBaseUrl = apiBaseUrl.replace(/\/$/, "");
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
      try {
        setTopicsLoading(true);
        setTopicsError(null);

        const apiBaseUrl = import.meta.env.VITE_API_URL || "";
        const cleanBaseUrl = apiBaseUrl.replace(/\/$/, "");
        const topicsUrl = cleanBaseUrl
          ? `${cleanBaseUrl}/api/v2/botservice/topics`
          : "/api/v2/botservice/topics";

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
      if (!selectedBrand || !brands.length || !topics.length) {
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

        const apiBaseUrl = import.meta.env.VITE_API_URL || "";
        const cleanBaseUrl = apiBaseUrl.replace(/\/$/, "");

        // Загружаем контент по всем разделам
        const fetchPromises = topics.map((topic, index) => {
          const topicCode =
            topic?.code ||
            topic?.Code ||
            topic?.id ||
            topic?.Id ||
            "brand_line_info";
          const topicName =
            topic?.description ||
            topic?.Description ||
            topic?.name ||
            topic?.Name ||
            topicCode;
          const topicValue =
            topic?.id ??
            topic?.Id ??
            topic?.code ??
            topic?.Code ??
            topic?.description ??
            topic?.Description ??
            String(index);
          const brandInfoUrl = cleanBaseUrl
            ? `${cleanBaseUrl}/api/v2/botservice/brandinfo/${brandCode}/topic/${topicCode}`
            : `/api/v2/botservice/brandinfo/${brandCode}/topic/${topicCode}`;
          return fetch(brandInfoUrl, {
            method: "GET",
            headers: { accept: "application/json" },
          })
            .then((r) => (r.ok ? r.json() : null))
            .then((brandInfoData) => {
              if (!brandInfoData) return null;
              const content =
                brandInfoData?.content ||
                brandInfoData?.Content ||
                brandInfoData?.data?.content ||
                "";
              return content.trim()
                ? { topicValue, topicName, content }
                : null;
            })
            .catch(() => null);
        });

        const results = await Promise.all(fetchPromises);
        const sectionsList = (results.filter(Boolean));
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
  }, [selectedBrand, brands, topics]);

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
    <div style={{ padding: " 0 2rem" }}>
      {/* <h2>Материалы</h2> */}
      <div style={{  textAlign: 'right' }}>
        <a
          href="https://content.constrtodo.ru:3444/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            textDecoration: 'none'
          }}
        >
          <img 
            src="./Panel.png" 
            alt="Перейти в панель управления"
            style={{
              maxWidth: '70px',
              height: 'auto',
              cursor: 'pointer',
              transition: 'opacity 0.3s, transform 0.3s',
              transform: 'scale(1)',
              background: "radial-gradient(circle 65px at center, rgba(227, 228, 230, 0.1), rgba(227, 228, 230, 0.6))",
              borderRadius: 6,
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.8';
              e.target.style.transform = 'scale(1.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1';
              e.target.style.transform = 'scale(1)';
            }}
          />
        </a>
      </div>
      <p>Список наших материалов и информация о них</p>
      {loading && <p>Загрузка...</p>}
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          <p>Ошибка: {error}</p>
          {import.meta.env.PROD ? (
            <div
              style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}
            >
              <p>
                Для работы API необходимо настроить переменную окружения
                VITE_API_URL.
              </p>
              <p>Создайте файл .env.production с содержимым:</p>
              <code
                style={{
                  display: "block",
                  padding: "0.5rem",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  marginTop: "0.5rem",
                }}
              >
                VITE_API_URL=https://your-api-server.com
              </code>
            </div>
          ) : (
            <p style={{ fontSize: "0.9rem", color: "#666" }}>
              Проверьте, что API сервер запущен на http://localhost:3005
            </p>
          )}
        </div>
      )}
      {!loading && !error && brands.length === 0 && (
        <p style={{ color: "#666" }}>Бренды не найдены</p>
      )}
      <div style={{display: "flex", flexWrap: "wrap", flexDirection: "column"}}>
      <select
        name="brand"
        id="brand"
        value={selectedBrand}
        onChange={(e) => {
          setSelectedBrand(e.target.value);
          setSelectedTopic("");
          setExpandedSections(new Set());
        }}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "0.5rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "1rem",
          marginTop: "1rem",
        }}
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
            <p style={{ marginTop: "0.5rem", color: "#666" }}>
              {(() => {
                // Если выбран раздел, показываем его название
                if (selectedTopic) {
                  const currentTopic = topics.find(
                    (topic) =>
                      String(topic?.id || topic?.Id || topic?.code || topic?.Code || "") === String(selectedTopic) ||
                      String(topic?.description || topic?.Description || topic?.name || topic?.Name || "") === String(selectedTopic)
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
            <div
              style={{ color: "red", marginTop: "0.5rem", fontSize: "0.9rem" }}
            >
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
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "1rem",
              marginTop: "1rem",
            }}
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
        <div
          style={{
            marginTop: "1rem",
            padding: "2rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {loadingContent && (
            <p>Загрузка всех разделов...</p>
          )}
          {contentError && (
            <div style={{ color: "red", marginTop: "0.5rem" }}>
              <p>Ошибка загрузки информации: {contentError}</p>
            </div>
          )}
          {!loadingContent && !contentError && !selectedTopic && brandContent && (
            <div
              style={{
                color: "#333",
                marginTop: "0.5rem",
                lineHeight: "1.6",
              }}
            >
              <Markdown
                components={{
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
                        style={{
                          color: "#0d47a1",
                          marginTop: "1.25rem",
                          marginBottom: "0.5rem",
                          paddingBottom: "0.25rem",
                          borderBottom: "2px solid #0d47a1",
                          cursor: "pointer",
                        }}
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
                    <h3 style={{ color: "#1565c0", marginTop: "0.75rem" }} {...props} />
                  ),
                }}
              >
                {brandContent}
              </Markdown>
            </div>
          )}
          {!loadingContent && !contentError && selectedTopic && sections.length > 0 && (
            <>
              <div style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setSectionsViewMode((prev) => {
                      const next = prev === "vertical" ? "horizontal" : "vertical";
                      if (next === "horizontal") {
                        setExpandedSections(new Set(sections.map((s) => String(s.topicValue))));
                      } else {
                        setExpandedSections(new Set([String(selectedTopic)]));
                      }
                      return next;
                    });
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    border: "1px solid #0d47a1",
                    borderRadius: "4px",
                    backgroundColor: sectionsViewMode === "horizontal" ? "#0d47a1" : "#fff",
                    color: sectionsViewMode === "horizontal" ? "#fff" : "#0d47a1",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label={sectionsViewMode === "vertical" ? "Переключить на вид сеткой" : "Переключить на вид списком"}
                  title={sectionsViewMode === "vertical" ? "Сетка" : "Список"}
                >
                  {sectionsViewMode === "vertical" ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="2" y="2" width="8" height="8" rx="1" />
                      <rect x="14" y="2" width="8" height="8" rx="1" />
                      <rect x="2" y="14" width="8" height="8" rx="1" />
                      <rect x="14" y="14" width="8" height="8" rx="1" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                  )}
                </button>
              </div>
              <div
                style={{
                  color: "#333",
                  marginTop: "0.5rem",
                  lineHeight: "1.6",
                  ...(sectionsViewMode === "horizontal"
                    ? {
                        display: "grid",
                        gridTemplateColumns: `repeat(${sections.length}, minmax(280px, 1fr))`,
                        gap: "1rem",
                        overflowX: "auto",
                      }
                    : {}),
                }}
              >
                {sections.map((section) => {
                  const key = String(section.topicValue);
                  const isVertical = sectionsViewMode === "vertical";
                  const isExpanded = isVertical ? expandedSections.has(key) : true;
                  return (
                    <section
                      key={key}
                      ref={(el) => {
                        sectionRefs.current[key] = el;
                      }}
                      style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: isExpanded ? "#fff" : "#fafafa",
                        ...(sectionsViewMode === "vertical"
                          ? { marginBottom: "1.5rem" }
                          : {
                              minWidth: 0,
                              display: "flex",
                              flexDirection: "column",
                            }),
                      }}
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
                        style={{
                          margin: 0,
                          padding: "1rem 1.25rem",
                          color: "#0d47a1",
                          borderBottom: isExpanded ? "2px solid #0d47a1" : "none",
                          cursor: isVertical ? "pointer" : "default",
                          fontSize: "1.25rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexShrink: 0,
                        }}
                      >
                        <span>{section.topicName}</span>
                        {isVertical && (
                          <span style={{ fontSize: "1rem", opacity: 0.8 }}>
                            {isExpanded ? "▼" : "▶"}
                          </span>
                        )}
                      </h2>
                      {isExpanded && (
                        <div
                          style={{
                            padding: "1rem 1.25rem",
                            borderTop: "1px solid #eee",
                            ...(sectionsViewMode === "horizontal"
                              ? { overflowY: "auto", flex: 1, minHeight: 0 }
                              : {}),
                          }}
                        >
                          <Markdown
                            components={{
                              h3: ({ node, ...props }) => (
                                <h3 style={{ color: "#1565c0", marginTop: "0.75rem" }} {...props} />
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
            </>
          )}
          {!loadingContent && !contentError && !brandContent && sections.length === 0 && (
            <div style={{ color: "#666", marginTop: "0.5rem" }}>
              <p>Информация по разделам не найдена.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default About;
