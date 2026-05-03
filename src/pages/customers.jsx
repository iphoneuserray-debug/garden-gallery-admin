import { useEffect, useState } from "react"
import { CustomersTable } from "@/components/CustomersTable"
import { api } from "@/lib/api"

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getCustomers()
      .then(setCustomers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (values) => {
    const tempId = `temp_${Date.now()}`
    setCustomers((prev) => [...prev, { ...values, id: tempId, stripeCustomerId: values.stripeCustomerId || null }])
    try {
      const created = await api.createCustomer(values)
      setCustomers((prev) => prev.map((c) => (c.id === tempId ? created : c)))
    } catch (e) {
      setCustomers((prev) => prev.filter((c) => c.id !== tempId))
      alert(`Failed to create customer: ${e.message}`)
    }
  }

  const handleUpdate = async (id, values) => {
    const original = customers.find((c) => c.id === id)
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...values } : c)))
    try {
      const updated = await api.updateCustomer(id, values)
      setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)))
    } catch (e) {
      setCustomers((prev) => prev.map((c) => (c.id === id ? original : c)))
      alert(`Failed to update customer: ${e.message}`)
    }
  }

  const handleDelete = async (id) => {
    const index = customers.findIndex((c) => c.id === id)
    const removed = customers[index]
    setCustomers((prev) => prev.filter((c) => c.id !== id))
    try {
      await api.deleteCustomer(id)
    } catch (e) {
      setCustomers((prev) => {
        const next = [...prev]
        next.splice(index, 0, removed)
        return next
      })
      alert(`Failed to delete customer: ${e.message}`)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">客户</h1>
      {loading && <p className="text-sm text-muted-foreground">加载中…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!loading && !error && (
        <CustomersTable
          customers={customers}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
