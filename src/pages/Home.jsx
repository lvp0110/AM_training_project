import { useState, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownListTableComponents = {
  ul: ({ node, ...props }) => (
    <ul
      style={{ margin: "0.5em 0", paddingLeft: "1.5em", listStyleType: "disc" }}
      {...props}
    />
  ),
  ol: ({ node, ...props }) => (
    <ol
      style={{
        margin: "0.5em 0",
        paddingLeft: "1.5em",
        listStyleType: "decimal",
      }}
      {...props}
    />
  ),
  li: ({ node, ...props }) => <li style={{ margin: "0.25em 0" }} {...props} />,
  table: ({ node, ...props }) => (
    <div style={{ overflowX: "auto", margin: "1em 0" }}>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          border: "1px solid #ddd",
        }}
        {...props}
      />
    </div>
  ),
  thead: ({ node, ...props }) => (
    <thead style={{ backgroundColor: "#f5f5f5" }} {...props} />
  ),
  tbody: ({ node, ...props }) => <tbody {...props} />,
  tr: ({ node, ...props }) => <tr {...props} />,
  th: ({ node, ...props }) => (
    <th
      style={{
        border: "1px solid #ddd",
        padding: "0.5em 0.75em",
        textAlign: "left",
        fontWeight: 600,
      }}
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <td
      style={{ border: "1px solid #ddd", padding: "0.5em 0.75em" }}
      {...props}
    />
  ),
};

const getApiBase = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "";
  return apiBaseUrl.replace(/\/$/, "");
};

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && typeof data === "object") return Object.values(data);
  return [];
};

function Home() {
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandsError, setBrandsError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicsError, setTopicsError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [brandInfo, setBrandInfo] = useState(null);
  const [brandInfoLoading, setBrandInfoLoading] = useState(false);
  const [brandInfoError, setBrandInfoError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setBrandsLoading(true);
        setBrandsError(null);
        const base = getApiBase();
        const url = base
          ? `${base}/api/v2/botservice/brands`
          : "/api/v2/botservice/brands";
        const response = await fetch(url, {
          method: "GET",
          headers: { accept: "application/json" },
          mode: "cors",
        });
        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(`HTTP ${response.status}${text ? `: ${text}` : ""}`);
        }
        const data = await response.json();
        setBrands(normalizeList(data));
      } catch (err) {
        const msg =
          err.name === "TypeError" && err.message.includes("Failed to fetch")
            ? "Ошибка подключения к API. Проверьте, что сервер запущен и доступен."
            : err.message;
        setBrandsError(msg);
        setBrands([]);
      } finally {
        setBrandsLoading(false);
      }
    };
    fetchBrands();
  }, []);

  // Загрузка списка тем (topics) после выбора бренда
  useEffect(() => {
    if (!selectedBrand) {
      setTopics([]);
      setTopicsError(null);
      return;
    }
    const fetchTopics = async () => {
      try {
        setTopicsLoading(true);
        setTopicsError(null);
        const base = getApiBase();
        const url = base
          ? `${base}/api/v2/botservice/topics`
          : "/api/v2/botservice/topics";
        const response = await fetch(url, {
          method: "GET",
          headers: { accept: "application/json" },
          mode: "cors",
        });
        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(`HTTP ${response.status}${text ? `: ${text}` : ""}`);
        }
        const data = await response.json();
        const list = normalizeList(data);
        setTopics(list);
        // Автовыбор первой категории, если ещё не выбрана
        if (!selectedTopic && list.length > 0) {
          const first = list[0];
          const value = first?.code ?? first?.id ?? 0;
          setSelectedTopic(String(value));
        }
      } catch (err) {
        const msg =
          err.name === "TypeError" && err.message.includes("Failed to fetch")
            ? "Ошибка подключения к API при загрузке тем."
            : err.message;
        setTopicsError(msg);
        setTopics([]);
      } finally {
        setTopicsLoading(false);
      }
    };
    fetchTopics();
  }, [selectedBrand, selectedTopic]);

  // Загрузка информации о бренде и выбранной категории
  useEffect(() => {
    if (!selectedBrand || !selectedTopic) {
      setBrandInfo(null);
      setBrandInfoError(null);
      return;
    }

    const fetchBrandInfo = async () => {
      try {
        setBrandInfoLoading(true);
        setBrandInfoError(null);
        const base = getApiBase();
        // URL формируем из выбранного бренда (code) и выбранной категории (code)
        const url = base
          ? `${base}/api/v2/botservice/brandinfo/${selectedBrand}/topic/${selectedTopic}`
          : `/api/v2/botservice/brandinfo/${selectedBrand}/topic/${selectedTopic}`;

        const response = await fetch(url, {
          method: "GET",
          headers: { accept: "application/json" },
          mode: "cors",
        });

        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(`HTTP ${response.status}${text ? `: ${text}` : ""}`);
        }

        const data = await response.json();
        setBrandInfo(data);
      } catch (err) {
        const msg =
          err.name === "TypeError" && err.message.includes("Failed to fetch")
            ? "Ошибка подключения к API при загрузке информации о бренде."
            : err.message;
        setBrandInfoError(msg);
        setBrandInfo(null);
      } finally {
        setBrandInfoLoading(false);
      }
    };

    fetchBrandInfo();
  }, [selectedBrand, selectedTopic]);

  const getBrandLabel = (brand) =>
    (brand?.name_rus || brand?.name || brand?.title || brand?.id) ?? "—";
  const getBrandValue = (brand) =>
    String(brand?.code ?? brand?.id ?? brand?.name_rus ?? brand?.name ?? "");

  const getTopicLabel = (topic) =>
    topic?.name_rus ||
    topic?.name ||
    topic?.title ||
    topic?.description ||
    "Тема";

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Добро пожаловать!</h2>
      <p>В данном проекте находится информация о наших материалах</p>

      <section style={{ marginTop: "2rem" }}>
        <h3>Бренды</h3>
        {brandsLoading && <p style={{ color: "#666" }}>Загрузка брендов…</p>}
        {brandsError && <p style={{ color: "#c00" }}>Ошибка: {brandsError}</p>}
        {!brandsLoading && !brandsError && (
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedTopic("");
            }}
            style={{
              minWidth: "200px",
              padding: "0.5rem 0.75rem",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value=""> Выберите бренд </option>
            {brands.map((brand, i) => (
              <option key={i} value={getBrandValue(brand)}>
                {getBrandLabel(brand)}
              </option>
            ))}
          </select>
        )}
      </section>

      {selectedBrand && (
        <>
          <section style={{ marginTop: "2rem" }}>
            <h3>Категории</h3>
            {topicsLoading && (
              <p style={{ color: "#666" }}>Загрузка категорий…</p>
            )}
            {topicsError && (
              <p style={{ color: "#c00" }}>Ошибка: {topicsError}</p>
            )}
            {!topicsLoading && !topicsError && (
              <>
                {topics.length === 0 ? (
                  <p style={{ color: "#666" }}>Категории не найдены.</p>
                ) : (
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    style={{
                      minWidth: "240px",
                      padding: "0.5rem 0.75rem",
                      fontSize: "1rem",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      marginTop: "0.5rem",
                    }}
                  >
                    <option value="">Выберите категорию</option>
                    {topics.map((topic, index) => {
                      const value = topic?.code ?? topic?.id ?? index;
                      return (
                        <option key={index} value={value}>
                          {getTopicLabel(topic)}
                        </option>
                      );
                    })}
                  </select>
                )}
              </>
            )}
          </section>

          <section style={{ marginTop: "2rem" }}>
            <h3>Информация по выбранному бренду</h3>
            {brandInfoLoading && (
              <p style={{ color: "#666" }}>Загрузка информации о бренде…</p>
            )}
            {brandInfoError && (
              <p style={{ color: "#c00" }}>Ошибка: {brandInfoError}</p>
            )}
            {!brandInfoLoading && !brandInfoError && brandInfo && (
              <div
                style={{
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#fafafa",
                  whiteSpace: "pre-wrap",
                  fontFamily: "monospace",
                  fontSize: "1.1rem",
                  overflow: "auto",
                  color: "black",
                }}
              >
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    ...markdownListTableComponents,
                    h2: ({ node, ...props }) => (
                      <h2
                        style={{
                          color: "#1565c0",
                          marginTop: "0.9rem",
                        }}
                        {...props}
                      />),
                    h3: ({ node, ...props }) => (
                      <h3
                        style={{
                          color: "#1565c0",
                          marginTop: "0.75rem",
                        }}
                        {...props}
                      />),
                  }}
                  style={{ margin: 0}}
                >
                  {brandInfo?.data?.content ??
                    JSON.stringify(brandInfo, null, 2)}
                </Markdown>
              </div>
            )}
          </section>
        </>
      )}

      {/* <div style={{ marginTop: "2rem" }}>
        <h3>Возможности проекта:</h3>
        <ul>
          <li>Больше узнать о нашей продукции на странице "Материалы"</li>
          <li>Узнать о ее технических характеристиках</li>
          <li>Посмотреть цветовую гамму</li>
          <li>Задать вопросы о нашей продукции в разделе "Контакты"</li>
        </ul>
      </div> */}
    </div>
  );
}

export default Home;
