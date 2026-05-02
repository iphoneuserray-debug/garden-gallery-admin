import { useEffect, useRef, useState } from "react"
import { useParams, Link } from "react-router"
import { Trash2Icon, UploadIcon, ArrowLeftIcon, StarIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/lib/api"

export default function ProductImages() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    Promise.all([
      api.getProducts().then((all) => all.find((p) => p.id === productId) ?? null),
      api.getProductImages(productId),
    ])
      .then(([prod, imgs]) => {
        setProduct(prod)
        setImages(imgs)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [productId])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const created = await api.uploadProductImage(productId, file)
      setImages((prev) => [...prev, created])
    } catch (err) {
      alert(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleDelete = async (imageId) => {
    setDeletingId(null)
    setImages((prev) => prev.filter((img) => img.id !== imageId))
    try {
      await api.deleteProductImage(productId, imageId)
    } catch (err) {
      api.getProductImages(productId).then(setImages)
      alert(`Delete failed: ${err.message}`)
    }
  }

  const handleSetCover = async (imageId) => {
    const minSort = Math.min(...images.map((i) => i.sortOrder ?? 0))
    const cover = images.find((i) => i.sortOrder === minSort)
    const target = images.find((i) => i.id === imageId)
    if (!target || target.id === cover?.id) return
    setImages((prev) => prev.map((img) => {
      if (img.id === target.id) return { ...img, sortOrder: cover.sortOrder }
      if (img.id === cover.id) return { ...img, sortOrder: target.sortOrder }
      return img
    }))
    try {
      const updated = await api.setCoverImage(productId, imageId)
      setImages((prev) => prev.map((img) => {
        const u = updated.find((u) => u.id === img.id)
        return u ? { ...img, sortOrder: u.sortOrder } : img
      }))
    } catch (err) {
      api.getProductImages(productId).then(setImages)
      alert(`Failed to set cover: ${err.message}`)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/products" className="rounded p-1 text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Product Images</h1>
          {product && <p className="text-sm text-muted-foreground">{product.name}</p>}
        </div>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-50"
            >
              <UploadIcon className="size-4" />
              {uploading ? "Uploading…" : "Upload Image"}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Preview</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="w-24">Cover</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                    No images yet. Upload one to get started.
                  </TableCell>
                </TableRow>
              )}
              {(() => {
                const minSort = images.length > 0 ? Math.min(...images.map((i) => i.sortOrder ?? 0)) : null
                return images.map((img) => {
                  const isCover = img.sortOrder === minSort
                  return (
                <TableRow key={img.id}>
                  <TableCell>
                    <img
                      src={img.url}
                      alt=""
                      className="h-14 w-14 rounded object-cover border border-border"
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{img.url}</TableCell>
                  <TableCell>
                    {isCover ? (
                      <span className="flex items-center gap-1 text-xs text-yellow-600 font-medium">
                        <StarIcon className="size-3 fill-yellow-500 text-yellow-500" />
                        Cover
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetCover(img.id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-yellow-600"
                        title="Set as cover"
                      >
                        <StarIcon className="size-3" />
                        Set cover
                      </button>
                    )}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => setDeletingId(img.id)}
                      className="rounded p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </TableCell>
                </TableRow>
                  )
                })
              })()}
            </TableBody>
          </Table>
        </>
      )}

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
            <h2 className="text-base font-semibold">Delete image?</h2>
            <p className="mt-1 text-sm text-muted-foreground">This image will be permanently deleted.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setDeletingId(null)} className="rounded border px-3 py-1.5 text-sm">Cancel</button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="rounded bg-destructive px-3 py-1.5 text-sm text-destructive-foreground"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
