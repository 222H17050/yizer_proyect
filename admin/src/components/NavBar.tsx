import { Link } from "react-router-dom"

function NavBar() {
  return (
    <div className="navbar">
      <h1 className="navbar-title">YIZER Administración</h1>
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/Inventory" className="nav-link">
            {/* Icono para Inventario (Caja/Paquete) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
              <path d="M3 9h18v6H3V9Z"/><path d="M12 3v6"/><path d="M12 15v6"/><path d="M8 12H3"/><path d="M21 12h-5"/>
            </svg>
            <span>Inventario</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/CreateProduct" className="nav-link">
            {/* Icono para Crear Producto (Signo de más) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
              <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
            <span>Crear Producto</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/Orders" className="nav-link">
            {/* Icono para Pedidos (Portapapeles con lista) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
              <rect width="8" height="4" x="8" y="2"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 12h4"/><path d="M12 16h4"/><path d="M8 8h.01"/>
            </svg>
            <span>Pedidos</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default NavBar;
