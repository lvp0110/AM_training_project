import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

function About() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBrand, setSelectedBrand] = useState('')
  const [brandContent, setBrandContent] = useState(null)
  const [loadingContent, setLoadingContent] = useState(false)
  const [contentError, setContentError] = useState(null)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/v2/botservice/brands', {
          method: 'GET',
          headers: {
            'accept': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('API Response:', data) // Для отладки
        
        // Обработка разных форматов ответа
        let brandsArray = []
        if (Array.isArray(data)) {
          brandsArray = data
        } else if (data && Array.isArray(data.data)) {
          brandsArray = data.data
        } else if (data && Array.isArray(data.items)) {
          brandsArray = data.items
        } else if (data && typeof data === 'object') {
          // Если это объект с ключами, преобразуем в массив
          brandsArray = Object.values(data)
        } else {
          throw new Error('Неожиданный формат данных от API')
        }
        
        setBrands(brandsArray)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching brands:', err)
        setBrands([])
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  useEffect(() => {
    const fetchBrandContent = async () => {
      if (!selectedBrand) {
        setBrandContent(null)
        return
      }

      try {
        setLoadingContent(true)
        setContentError(null)
        
        // Находим выбранный бренд
        const selected = brands.find((brand) => {
          const brandValue = brand?.id || brand?.Id || brand?.name_rus || brand?.name
          return String(brandValue) === String(selectedBrand)
        })

        if (!selected) {
          throw new Error('Выбранный бренд не найден')
        }

        // Получаем код бренда для URL (code, code_en, или преобразуем name_rus в lowercase)
        const brandCode = selected?.code || selected?.code_en || selected?.code_ru || 
                         (selected?.name_rus || selected?.name || '').toLowerCase().replace(/\s+/g, '_')
        
        console.log('Brand code:', brandCode) // Для отладки

        // Сначала получаем topics и находим topic с code === "brand_line_info"
        const topicsResponse = await fetch('/api/v2/botservice/topics', {
          method: 'GET',
          headers: {
            'accept': 'application/json'
          }
        })

        if (!topicsResponse.ok) {
          throw new Error(`HTTP error! status: ${topicsResponse.status}`)
        }

        const topicsData = await topicsResponse.json()
        console.log('Topics Response:', topicsData) // Для отладки

        // Обработка формата topics
        let topicsArray = []
        if (Array.isArray(topicsData)) {
          topicsArray = topicsData
        } else if (topicsData && Array.isArray(topicsData.data)) {
          topicsArray = topicsData.data
        } else if (topicsData && Array.isArray(topicsData.items)) {
          topicsArray = topicsData.items
        } else if (topicsData && typeof topicsData === 'object') {
          topicsArray = Object.values(topicsData)
        }

        // Находим topic с code === "brand_line_info"
        const brandLineInfoTopic = topicsArray.find(topic => 
          topic?.code === 'brand_line_info' || topic?.Code === 'brand_line_info'
        )

        if (!brandLineInfoTopic) {
          throw new Error('Topic "brand_line_info" не найден')
        }

        // Получаем информацию о бренде
        const brandInfoResponse = await fetch(`/api/v2/botservice/brandinfo/${brandCode}/topic/brand_line_info`, {
          method: 'GET',
          headers: {
            'accept': 'application/json'
          }
        })

        if (!brandInfoResponse.ok) {
          throw new Error(`HTTP error! status: ${brandInfoResponse.status}`)
        }

        const brandInfoData = await brandInfoResponse.json()
        console.log('Brand Info Response:', brandInfoData) // Для отладки

        // Извлекаем content
        const content = brandInfoData?.content || brandInfoData?.Content || brandInfoData?.data?.content || ''
        setBrandContent(content)
      } catch (err) {
        setContentError(err.message)
        console.error('Error fetching brand content:', err)
        setBrandContent(null)
      } finally {
        setLoadingContent(false)
      }
    }

    fetchBrandContent()
  }, [selectedBrand, brands])

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Материалы</h2>
      <p>Список наших материалов и информация о них</p>
      {loading && <p>Загрузка...</p>}
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          <p>Ошибка: {error}</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Проверьте, что API сервер запущен на http://localhost:3005
          </p>
        </div>
      )}
      {!loading && !error && brands.length === 0 && (
        <p style={{ color: '#666' }}>Бренды не найдены</p>
      )}
      <select 
        name="brand" 
        id="brand"
        value={selectedBrand}
        onChange={(e) => setSelectedBrand(e.target.value)}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '1rem',
          marginTop: '1rem'
        }}
        disabled={loading || error || brands.length === 0}
      >
        <option value="">Выберите бренд</option>
        {brands.map((brand, index) => {
          const brandName = brand?.name_rus || brand?.name || brand?.Name || `Бренд ${index + 1}`
          const brandValue = brand?.id || brand?.Id || brand?.name_rus || brand?.name || brandName
          
          return (
            <option key={index} value={brandValue}>
              {brandName}
            </option>
          )
        })}
      </select>
      {selectedBrand && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
            {(() => {
              const selected = brands.find((brand) => {
                const brandValue = brand?.id || brand?.Id || brand?.name_rus || brand?.name
                return String(brandValue) === String(selectedBrand)
              })
              return selected?.name_rus || selected?.name || 'Выбранный бренд'
            })()}
          </h3>
          {loadingContent && <p>Загрузка информации...</p>}
          {contentError && (
            <div style={{ color: 'red', marginTop: '0.5rem' }}>
              <p>Ошибка загрузки информации: {contentError}</p>
            </div>
          )}
          {!loadingContent && !contentError && brandContent && (
            <div 
              style={{ 
                color: '#333',
                marginTop: '0.5rem',
                lineHeight: '1.6'
              }}
            >
              <ReactMarkdown>{brandContent}</ReactMarkdown>
            </div>
          )}
          {!loadingContent && !contentError && !brandContent && (
            <div style={{ color: '#666', marginTop: '0.5rem' }}>
              <p>Информация о бренде не найдена.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default About