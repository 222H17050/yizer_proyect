import { Link } from "react-router-dom"

function NavBar() {
  return (
    <div className="navbar">
      <h1 className="navbar-title">YIZER Administración</h1>
      <ul className="nav-list">
        <li className="nav-item"><Link to="/Inventory" className="nav-link">Inventario</Link></li>
        <li className="nav-item"><Link to="/CreateProduct" className="nav-link">Crear Producto</Link></li>
        <li className="nav-item"><Link to="/Orders" className="nav-link">Pedidos</Link></li>
      </ul>
    </div>
  )
}

export default NavBar