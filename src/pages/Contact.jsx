function Contact() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Панель управления контентом</h2>
      <div style={{ marginTop: '2rem' }}>
        <a
          href="https://content.constrtodo.ru:3444/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            backgroundColor: '#007bff',
            color: 'white',
            padding: '1rem 2rem',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1.1rem',
            fontWeight: '500',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Перейти в панель
        </a>
      </div>
    </div>
  )
}

export default Contact
