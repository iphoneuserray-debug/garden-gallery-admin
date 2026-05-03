import { useEffect, useState } from "react"
import { CouponsTable } from "@/components/CouponsTable"
import { api } from "@/lib/api"

export default function Coupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getCoupons()
      .then(setCoupons)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (values) => {
    const tempId = `temp_${Date.now()}`
    setCoupons((prev) => [...prev, { ...values, id: tempId }])
    try {
      const created = await api.createCoupon(values)
      setCoupons((prev) => prev.map((c) => (c.id === tempId ? created : c)))
    } catch (e) {
      setCoupons((prev) => prev.filter((c) => c.id !== tempId))
      alert(`Failed to create coupon: ${e.message}`)
    }
  }

  const handleUpdate = async (id, values) => {
    const original = coupons.find((c) => c.id === id)
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...values } : c)))
    try {
      const updated = await api.updateCoupon(id, values)
      setCoupons((prev) => prev.map((c) => (c.id === id ? updated : c)))
    } catch (e) {
      setCoupons((prev) => prev.map((c) => (c.id === id ? original : c)))
      alert(`Failed to update coupon: ${e.message}`)
    }
  }

  const handleDelete = async (id) => {
    const index = coupons.findIndex((c) => c.id === id)
    const removed = coupons[index]
    setCoupons((prev) => prev.filter((c) => c.id !== id))
    try {
      await api.deleteCoupon(id)
    } catch (e) {
      setCoupons((prev) => {
        const next = [...prev]
        next.splice(index, 0, removed)
        return next
      })
      alert(`Failed to delete coupon: ${e.message}`)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">优惠券</h1>
      {loading && <p className="text-sm text-muted-foreground">加载中…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!loading && !error && (
        <CouponsTable
          coupons={coupons}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
