import { useEffect, useState } from "react"
import { OrdersTable } from "@/components/OrdersTable"
import { api } from "@/lib/api"

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getOrders()
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusUpdate = async (id, status) => {
    const original = orders.find((o) => o.id === id)
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    try {
      const updated = await api.updateOrderStatus(id, status)
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: updated?.status ?? status } : o)))
    } catch (e) {
      setOrders((prev) => prev.map((o) => (o.id === id ? original : o)))
      alert(`Failed to update order status: ${e.message}`)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Orders</h1>
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!loading && !error && <OrdersTable orders={orders} onStatusUpdate={handleStatusUpdate} />}
    </div>
  )
}
