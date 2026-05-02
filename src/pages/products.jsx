import { useEffect, useState } from "react"
import { ProductsTable } from "@/components/ProductsTable"
import { api } from "@/lib/api"

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loadedImageIds, setLoadedImageIds] = useState(new Set())

  useEffect(() => {
    api.getProducts()
      .then((data) => {
        setProducts(data)
        setLoadedImageIds(new Set(data.map((p) => p.id)))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (values) => {
    const tempId = `temp_${Date.now()}`
    setProducts((prev) => [...prev, { ...values, id: tempId, images: [] }])
    try {
      const created = await api.createProduct(values)
      setProducts((prev) => prev.map((p) => (p.id === tempId ? { ...created, images: [] } : p)))
      setLoadedImageIds((prev) => new Set([...prev, created.id]))
    } catch (e) {
      setProducts((prev) => prev.filter((p) => p.id !== tempId))
      alert(`Failed to create product: ${e.message}`)
    }
  }

  const handleUpdate = async (id, values) => {
    const original = products.find((p) => p.id === id)
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...values } : p)))
    try {
      const updated = await api.updateProduct(id, values)
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...updated, images: p.images } : p)))
    } catch (e) {
      setProducts((prev) => prev.map((p) => (p.id === id ? original : p)))
      alert(`Failed to update product: ${e.message}`)
    }
  }

  const handleDelete = async (id) => {
    const index = products.findIndex((p) => p.id === id)
    const removed = products[index]
    setProducts((prev) => prev.filter((p) => p.id !== id))
    try {
      await api.deleteProduct(id)
    } catch (e) {
      setProducts((prev) => {
        const next = [...prev]
        next.splice(index, 0, removed)
        return next
      })
      alert(`Failed to delete product: ${e.message}`)
    }
  }

  const handleImageUpload = async (productId, file) => {
    try {
      const created = await api.uploadProductImage(productId, file)
      setProducts((prev) => prev.map((p) =>
        p.id === productId ? { ...p, images: [...p.images, created] } : p
      ))
    } catch (e) {
      alert(`Failed to upload image: ${e.message}`)
    }
  }

  const handleImageDelete = async (productId, imgId) => {
    setProducts((prev) => prev.map((p) =>
      p.id === productId ? { ...p, images: p.images.filter((img) => img.id !== imgId) } : p
    ))
    try {
      await api.deleteProductImage(productId, imgId)
    } catch (e) {
      api.getProductImages(productId).then((images) =>
        setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, images } : p)))
      )
      alert(`Failed to delete image: ${e.message}`)
    }
  }

  const handleSetCover = async (productId, imageId) => {
    setProducts((prev) => prev.map((p) => {
      if (p.id !== productId) return p
      const cover = p.images.reduce((min, i) => i.sortOrder < min.sortOrder ? i : min, p.images[0])
      const target = p.images.find((i) => i.id === imageId)
      if (!target || target.id === cover?.id) return p
      return {
        ...p,
        images: p.images.map((img) => {
          if (img.id === target.id) return { ...img, sortOrder: cover.sortOrder }
          if (img.id === cover.id) return { ...img, sortOrder: target.sortOrder }
          return img
        }),
      }
    }))
    try {
      const updated = await api.setCoverImage(productId, imageId)
      setProducts((prev) => prev.map((p) => {
        if (p.id !== productId) return p
        return {
          ...p,
          images: p.images.map((img) => {
            const u = updated.find((u) => u.id === img.id)
            return u ? { ...img, sortOrder: u.sortOrder } : img
          }),
        }
      }))
    } catch (e) {
      api.getProductImages(productId).then((images) =>
        setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, images } : p)))
      )
      alert(`Failed to set cover: ${e.message}`)
    }
  }

  const handleLoadImages = async (productId) => {
    if (loadedImageIds.has(productId)) return
    try {
      const images = await api.getProductImages(productId)
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, images } : p)))
      setLoadedImageIds((prev) => new Set([...prev, productId]))
    } catch (e) {
      alert(`Failed to load images: ${e.message}`)
    }
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
          onSetCover={handleSetCover}
          onLoadImages={handleLoadImages}
        />
      )}
    </div>
  )
}
