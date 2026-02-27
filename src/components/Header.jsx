import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header
      style={{
        backgroundColor: "#333",
        color: "white",
        padding: "1rem",
        marginBottom: "1rem",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <nav>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            gap: "2rem",
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <NavLink
              to="/home"
              style={({ isActive }) => ({
                color: isActive ? "white" : "white",
                textDecoration: isActive ? "underline" : "none",
                fontWeight: isActive ? "bold" : "normal",
              })}
            >
              <h3>Бот</h3>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              style={({ isActive }) => ({
                color: isActive ? "white" : "white",
                textDecoration: isActive ? "underline" : "none",
                fontWeight: isActive ? "bold" : "normal",
              })}
            >
              <h3>Контент</h3>
            </NavLink>
          </li>
          {/* <li>
            <NavLink 
              to="/contact" 
              style={({ isActive }) => ({
                color: isActive ? 'white' : 'white',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal'
              })}
            >
              Панель управления
            </NavLink>
          </li> */}
        </ul>
      </nav>
    </header>
  );
}
export default Header;
