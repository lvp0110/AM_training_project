import { Link } from 'react-router-dom'

function Header() {
  return (
    <header style={{
      backgroundColor: '#333',
      color: 'white',
      padding: '1rem',
      marginBottom: '2rem'
    }}>
      <nav>
        <ul style={{
          listStyle: 'none',
          display: 'flex',
          gap: '2rem',
          margin: 0,
          padding: 0
        }}>
          <li>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              Главная
            </Link>
          </li>
          <li>
            <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>
              Материалы
            </Link>
          </li>
          <li>
            <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>
              Контакты
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
export default Header