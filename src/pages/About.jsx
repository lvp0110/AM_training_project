import { useState, useEffect } from 'react'

function About() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBrand, setSelectedBrand] = useState('')

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
          <div style={{ color: '#666' }}>
            <p>Здесь будет отображаться информация о выбранном бренде.</p>
            <p>Вы можете добавить дополнительную информацию о бренде в этом блоке.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default About