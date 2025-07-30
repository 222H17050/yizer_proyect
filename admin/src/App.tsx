import { Route, Routes, useLocation } from "react-router-dom"
import NavBar from "./components/NavBar.tsx"
import ProductsPage from "./pages/CreateProductPage.tsx"
import NotFoundPage from "./pages/NotFoundPage.tsx"
import OrdersPage from "./pages/OrdersPage.tsx"
import InventoryPage from "./pages/InvetoryPage.tsx"
import EditProductPage from "./pages/EditProductPage.tsx"
import LoginAdminPage from "./pages/LogingAdminPage.tsx"


function App() {
  const location = useLocation();
  
  // Excluir NavBar en la ruta de login
  const showNavBar = location.pathname !== "/";

  return (
    <>
      {showNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<LoginAdminPage />} />
        <Route path="/Inventory" element={<InventoryPage />} />
        <Route path="/CreateProduct" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/EditProduct/:id" element={<EditProductPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App
