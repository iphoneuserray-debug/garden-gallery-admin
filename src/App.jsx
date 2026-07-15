import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import AdminLayout from "./layouts/AdminLayout"
import Login from "./pages/login"
import Dashboard from "./pages/dashboard"
import Orders from "./pages/orders"
import Customers from "./pages/customers"
import Products from "./pages/products"
import ProductImages from "./pages/product-images"
import PickupLocations from "./pages/pickup-locations"
import Coupons from "./pages/coupons"
import Transactions from "./pages/transactions"
import { getToken } from "./lib/api"

function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId/images" element={<ProductImages />} />
          <Route path="/pickup-locations" element={<PickupLocations />} />
          <Route path="/coupons" element={<Coupons />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
