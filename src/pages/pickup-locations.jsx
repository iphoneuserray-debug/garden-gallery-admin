import { useEffect, useState } from "react"
import { PickupLocationsTable } from "@/components/PickupLocationsTable"
import { api } from "@/lib/api"

export default function PickupLocations() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getPickupLocations()
      .then(setLocations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (values) => {
    const tempId = `temp_${Date.now()}`
    setLocations((prev) => [...prev, { ...values, id: tempId }])
    try {
      const created = await api.createPickupLocation(values)
      setLocations((prev) => prev.map((l) => (l.id === tempId ? created : l)))
    } catch (e) {
      setLocations((prev) => prev.filter((l) => l.id !== tempId))
      alert(`Failed to create location: ${e.message}`)
    }
  }

  const handleUpdate = async (id, values) => {
    const original = locations.find((l) => l.id === id)
    setLocations((prev) => prev.map((l) => (l.id === id ? { ...l, ...values } : l)))
    try {
      const updated = await api.updatePickupLocation(id, values)
      setLocations((prev) => prev.map((l) => (l.id === id ? updated : l)))
    } catch (e) {
      setLocations((prev) => prev.map((l) => (l.id === id ? original : l)))
      alert(`Failed to update location: ${e.message}`)
    }
  }

  const handleDelete = async (id) => {
    const index = locations.findIndex((l) => l.id === id)
    const removed = locations[index]
    setLocations((prev) => prev.filter((l) => l.id !== id))
    try {
      await api.deletePickupLocation(id)
    } catch (e) {
      setLocations((prev) => {
        const next = [...prev]
        next.splice(index, 0, removed)
        return next
      })
      alert(`Failed to delete location: ${e.message}`)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">取货点</h1>
      {loading && <p className="text-sm text-muted-foreground">加载中…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!loading && !error && (
        <PickupLocationsTable
          locations={locations}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
