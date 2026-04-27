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
    try {
      const created = await api.createCustomer(values)
      setCustomers((prev) => [...prev, created])
    } catch (e) {
      alert(`Failed to create customer: ${e.message}`)
    }
  }

  const handleUpdate = async (id, values) => {
    try {
      const updated = await api.updateCustomer(id, values)
      setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)))
    } catch (e) {
      alert(`Failed to update customer: ${e.message}`)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteCustomer(id)
      setCustomers((prev) => prev.filter((c) => c.id !== id))
    } catch (e) {
      alert(`Failed to delete customer: ${e.message}`)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Customers</h1>
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
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
