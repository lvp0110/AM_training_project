import { useState } from 'react'

function Contact() {
  const [showPanel, setShowPanel] = useState(false)
  const [iframeError, setIframeError] = useState(false)

  const handleIframeLoad = () => {
    setIframeError(false)
    // Ошибки 404 в консоли - это нормально, если API эндпоинты не существуют
    // или требуют аутентификации. Они не влияют на отображение iframe.
  }

  const handleIframeError = () => {
    setIframeError(true)
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Панель управления контентом</h2>
      {!showPanel ? (
        <div style={{ marginTop: '2rem' }}>
          <button
            onClick={() => setShowPanel(true)}
            style={{
              display: 'inline-block',
              backgroundColor: '#007bff',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1.1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            Перейти в панель...
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '2rem', width: '100%', height: 'calc(100vh - 200px)', position: 'relative' }}>
          {iframeError ? (
            <div style={{ 
              padding: '2rem', 
              backgroundColor: '#f8d7da', 
              color: '#721c24', 
              borderRadius: '4px',
              border: '1px solid #f5c6cb'
            }}>
              <p>Не удалось загрузить панель управления.</p>
              <button
                onClick={() => {
                  setIframeError(false)
                  setShowPanel(false)
                }}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Попробовать снова
              </button>
            </div>
          ) : (
            <iframe
              src="https://content.constrtodo.ru:3444/"
              style={{
                width: '100%',
                height: '100%',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              title="Панель управления"
              allowFullScreen
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          )}
          <div style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.875rem', 
            color: '#666',
            textAlign: 'left'
          }}>
            <p style={{ margin: 0 }}>
              <small>
                Примечание: Ошибки 404 в консоли могут появляться, если некоторые API эндпоинты требуют аутентификации или не настроены. 
                Это не влияет на работу панели управления.
              </small>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Contact
