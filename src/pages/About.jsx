import { useState, useEffect } from "react";
import Markdown from "react-markdown";

function About() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brandContent, setBrandContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [contentError, setContentError] = useState(null);
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("");

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
      if (!selectedBrand || !selectedTopic) {
        setBrandContent(null);
        return;
      }

      try {
        setLoadingContent(true);
        setContentError(null);

        // Находим выбранный бренд
        const selected = brands.find((brand) => {
          const brandValue =
            brand?.id || brand?.Id || brand?.name_rus || brand?.name;
          return String(brandValue) === String(selectedBrand);
        });

        if (!selected) {
          throw new Error("Выбранный бренд не найден");
        }

        // Получаем код бренда для URL (code, code_en, или преобразуем name_rus в lowercase)
        const brandCode =
          selected?.code ||
          selected?.code_en ||
          selected?.code_ru ||
          (selected?.name_rus || selected?.name || "")
            .toLowerCase()
            .replace(/\s+/g, "_");

        console.log("Brand code:", brandCode); // Для отладки

        // Находим выбранный раздел (topic)
        const selectedTopicObj = topics.find((topic) => {
          const topicValue =
            topic?.id ||
            topic?.Id ||
            topic?.code ||
            topic?.Code ||
            topic?.description ||
            topic?.Description ||
            "";
          return String(topicValue) === String(selectedTopic);
        });

        if (!selectedTopicObj) {
          throw new Error("Выбранный раздел не найден");
        }

        // Получаем code раздела для URL
        const topicCode =
          selectedTopicObj?.code ||
          selectedTopicObj?.Code ||
          selectedTopicObj?.id ||
          selectedTopicObj?.Id ||
          "brand_line_info"; // Fallback на brand_line_info

        console.log("Topic code:", topicCode); // Для отладки

        // Получаем информацию о бренде для выбранного раздела
        const apiBaseUrl = import.meta.env.VITE_API_URL || "";
        const cleanBaseUrl = apiBaseUrl.replace(/\/$/, "");
        const brandInfoUrl = cleanBaseUrl
          ? `${cleanBaseUrl}/api/v2/botservice/brandinfo/${brandCode}/topic/${topicCode}`
          : `/api/v2/botservice/brandinfo/${brandCode}/topic/${topicCode}`;
        
        const brandInfoResponse = await fetch(brandInfoUrl, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });

        if (!brandInfoResponse.ok) {
          throw new Error(`HTTP error! status: ${brandInfoResponse.status}`);
        }

        const brandInfoData = await brandInfoResponse.json();
        console.log("Brand Info Response:", brandInfoData); // Для отладки

        // Извлекаем content
        const content =
          brandInfoData?.content ||
          brandInfoData?.Content ||
          brandInfoData?.data?.content ||
          "";
        setBrandContent(content);
      } catch (err) {
        setContentError(err.message);
        console.error("Error fetching brand content:", err);
        setBrandContent(null);
      } finally {
        setLoadingContent(false);
      }
    };

    fetchBrandContent();
  }, [selectedBrand, selectedTopic, brands, topics]);

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
          setSelectedTopic(""); // Сбрасываем выбранный раздел при смене бренда
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
            onChange={(e) => setSelectedTopic(e.target.value)}
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
            <option value="">Выберите раздел</option>
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
      {selectedBrand && selectedTopic && (
        <div
          style={{
            marginTop: "1rem",
            padding: "2rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {/* <h3 style={{ marginTop: 0, marginBottom: '0.5rem',color: '#333'}}>
            {(() => {
              const selected = brands.find((brand) => {
                const brandValue = brand?.id || brand?.Id || brand?.name_rus || brand?.name
                return String(brandValue) === String(selectedBrand)
              })
              return selected?.name_rus || selected?.name || 'Выбранный бренд'
            })()}
          </h3> */}
          {loadingContent && (
            <p>
              {(() => {
                const currentTopic = topics.find(
                  (topic) => {
                    const topicValue =
                      topic?.id ||
                      topic?.Id ||
                      topic?.code ||
                      topic?.Code ||
                      topic?.description ||
                      topic?.Description ||
                      "";
                    return String(topicValue) === String(selectedTopic);
                  }
                );
                if (currentTopic) {
                  const topicName = 
                    currentTopic?.description ||
                    currentTopic?.Description ||
                    currentTopic?.name ||
                    currentTopic?.Name ||
                    "раздела";
                  return `Загрузка ${topicName}...`;
                }
                return "Загрузка информации...";
              })()}
            </p>
          )}
          {contentError && (
            <div style={{ color: "red", marginTop: "0.5rem" }}>
              <p>Ошибка загрузки информации: {contentError}</p>
            </div>
          )}
          {!loadingContent && !contentError && brandContent && (
            <div
              style={{
                color: "#333333",
                marginTop: "0.5rem",
                lineHeight: "1.6",
              }}
            >
              <Markdown>{brandContent}</Markdown>
            </div>
          )}
          {!loadingContent && !contentError && !brandContent && (
            <div style={{ color: "#666", marginTop: "0.5rem" }}>
              <p>Информация о разделе не найдена.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default About;
