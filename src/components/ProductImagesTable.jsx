import { XIcon, UploadIcon } from "lucide-react"

export function ProductImagesTable({ images = [], onUpload, onDelete }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file) onUpload?.(file)
    e.target.value = ""
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((img) => (
          <div key={img.id} className="group relative">
            <img src={img.url} alt={img.name} className="size-24 rounded object-cover" />
            <button
              onClick={() => onDelete?.(img.id)}
              className="absolute right-1 top-1 hidden rounded bg-black/60 p-0.5 text-white group-hover:flex"
            >
              <XIcon className="size-3" />
            </button>
            <p className="mt-1 max-w-24 truncate text-xs text-muted-foreground">{img.name}</p>
          </div>
        ))}
        {images.length === 0 && (
          <p className="text-sm text-muted-foreground">No images yet.</p>
        )}
      </div>
      <label className="flex w-fit cursor-pointer items-center gap-1.5 rounded border border-dashed px-3 py-1.5 text-sm text-muted-foreground hover:border-primary hover:text-primary">
        <UploadIcon className="size-4" />
        Upload image
        <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
      </label>
    </div>
  )
}
