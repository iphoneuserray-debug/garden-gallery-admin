import { useEffect, useState } from "react"
import { ProductsTable } from "@/components/ProductsTable"
import { api } from "@/lib/api"

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getProducts()
      .then((data) => setProducts(data.map((p) => ({ ...p, images: [] }))))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (values) => {
    try {
      const created = await api.createProduct(values)
      setProducts((prev) => [...prev, { ...created, images: [] }])
    } catch (e) {
      alert(`Failed to create product: ${e.message}`)
    }
  }

  const handleUpdate = async (id, values) => {
    try {
      const updated = await api.updateProduct(id, values)
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...updated, images: p.images } : p)))
    } catch (e) {
      alert(`Failed to update product: ${e.message}`)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      alert(`Failed to delete product: ${e.message}`)
    }
  }

  const handleImageUpload = (productId, file) => {
    const url = URL.createObjectURL(file)
    setProducts((prev) => prev.map((p) =>
      p.id === productId
        ? { ...p, images: [...p.images, { id: crypto.randomUUID(), url, name: file.name }] }
        : p
    ))
  }

  const handleImageDelete = (productId, imgId) => {
    setProducts((prev) => prev.map((p) =>
      p.id === productId
        ? { ...p, images: p.images.filter((img) => img.id !== imgId) }
        : p
    ))
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Products</h1>
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!loading && !error && (
        <ProductsTable
          products={products}
          onUpdate={handleUpdate}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onImageUpload={handleImageUpload}
          onImageDelete={handleImageDelete}
        />
      )}
    </div>
  )
}
