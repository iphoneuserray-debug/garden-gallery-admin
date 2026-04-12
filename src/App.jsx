import { BrowserRouter, Routes, Route } from "react-router"
import AdminLayout from "./layouts/AdminLayout"
import Login from "./pages/login"
import Dashboard from "./pages/dashboard"
import Orders from "./pages/orders"
import Customers from "./pages/customers"
import Products from "./pages/products"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
