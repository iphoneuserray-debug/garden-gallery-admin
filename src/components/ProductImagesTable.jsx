import { XIcon, UploadIcon, StarIcon } from "lucide-react"

export function ProductImagesTable({ images = [], onUpload, onDelete, onSetCover }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file) onUpload?.(file)
    e.target.value = ""
  }

  const minSortOrder = images.length > 0
    ? Math.min(...images.map((img) => img.sortOrder ?? 0))
    : null

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((img) => {
          const isCover = img.sortOrder === minSortOrder
          return (
            <div key={img.id} className="group relative">
              <img src={img.url} alt="" className="size-24 rounded object-cover" />
              <button
                onClick={() => onDelete?.(img.id)}
                className="absolute right-1 top-1 rounded bg-black/60 p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XIcon className="size-3" />
              </button>
              {isCover ? (
                <span
                  className="absolute left-1 top-1 rounded bg-black/60 p-0.5 text-yellow-400"
                  title="Cover image"
                >
                  <StarIcon className="size-3 fill-yellow-400" />
                </span>
              ) : (
                <button
                  onClick={() => onSetCover?.(img.id)}
                  className="absolute left-1 top-1 rounded bg-black/60 p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:text-yellow-400"
                  title="Set as cover"
                >
                  <StarIcon className="size-3" />
                </button>
              )}
            </div>
          )
        })}
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
