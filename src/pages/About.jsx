import { useState, useEffect } from 'react'

function About() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/v1/AcousticCategories', {
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
        let categoriesArray = []
        if (Array.isArray(data)) {
          categoriesArray = data
        } else if (data && Array.isArray(data.data)) {
          categoriesArray = data.data
        } else if (data && Array.isArray(data.items)) {
          categoriesArray = data.items
        } else if (data && typeof data === 'object') {
          // Если это объект с ключами, преобразуем в массив
          categoriesArray = Object.values(data)
        } else {
          throw new Error('Неожиданный формат данных от API')
        }
        
        setCategories(categoriesArray)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching categories:', err)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
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
      {!loading && !error && categories.length === 0 && (
        <p style={{ color: '#666' }}>Категории не найдены</p>
      )}
      <select 
        name="category" 
        id="category"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '1rem',
          marginTop: '1rem'
        }}
        disabled={loading || error || categories.length === 0}
      >
        <option value="">Выберите категорию</option>
        {categories.map((category, index) => {
          const categoryName = category?.Name || category?.name || category?.NameRu || category?.nameRu || `Категория ${index + 1}`
          const categoryValue = category?.Id || category?.id || category?.Name || category?.name || categoryName
          
          return (
            <option key={index} value={categoryValue}>
              {categoryName}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default About