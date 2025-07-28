import { Route, Routes } from "react-router-dom"
import NavBar from "./components/NavBar.tsx"
import ProductsPage from "./pages/CreateProductPage.tsx"
import NotFoundPage from "./pages/NotFoundPage.tsx"
import OrdersPage from "./pages/OrdersPage.tsx"
import InventoryPage from "./pages/InvetoryPage.tsx"
import EditProductPage from "./pages/EditProductPage.tsx"


function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/Inventory" element={<InventoryPage></InventoryPage>}></Route>
        <Route path="/CreateProduct" element={<ProductsPage></ProductsPage>}></Route>
        <Route path="/orders" element={<OrdersPage></OrdersPage>}></Route>
        <Route path="/EditProduct/:id" element={<EditProductPage></EditProductPage>}></Route>
        <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
      </Routes>
    </>
  )
}

export default App
