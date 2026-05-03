import { useState } from "react"
import { Link } from "react-router"
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, PlusIcon, Trash2Icon, PencilIcon, XIcon, ImagesIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SearchForm } from "@/components/search-form"
import { ProductImagesTable } from "@/components/ProductImagesTable"
import { Pagination } from "@/components/Pagination"

const PAGE_SIZE = 10

function TagEditor({ value = [], onChange, allTags = [] }) {
  const [input, setInput] = useState("")
  const [open, setOpen] = useState(false)

  const suggestions = allTags.filter((t) => !value.includes(t) && t.toLowerCase().includes(input.toLowerCase()))

  const addTag = (tag) => {
    const trimmed = tag.trim()
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed])
    setInput("")
    setOpen(false)
  }

  const removeTag = (tag) => onChange(value.filter((t) => t !== tag))

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-wrap gap-1 rounded border border-input bg-background px-2 py-1 min-w-[160px]">
        {value.map((tag) => (
          <span key={tag} className="flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 text-xs">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="ml-0.5 hover:text-destructive">
              <XIcon className="size-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) { e.preventDefault(); addTag(input) }
            if (e.key === "Backspace" && !input && value.length) removeTag(value[value.length - 1])
          }}
          placeholder={value.length ? "" : "Add tag…"}
          className="flex-1 min-w-[70px] bg-transparent text-sm outline-none"
        />
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded border border-input bg-background shadow-md">
          {suggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              onMouseDown={() => addTag(tag)}
              className="block w-full px-3 py-1.5 text-left text-sm hover:bg-muted"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SortableHead({ label, field, sort, onSort }) {
  const active = sort.field === field
  const Icon = !active ? ChevronsUpDownIcon : sort.dir === "asc" ? ChevronUpIcon : ChevronDownIcon
  return (
    <TableHead className="cursor-pointer select-none" onClick={() => onSort(field)}>
      <div className="flex items-center gap-1">
        {label}
        <Icon className="size-3.5 opacity-50" />
      </div>
    </TableHead>
  )
}

const EMPTY_PRODUCT = { name: "", description: "", priceAud: "", availability: true, tags: [] }

export function ProductsTable({ products = [], onUpdate, onAdd, onDelete, onImageUpload, onImageDelete, onSetCover, onLoadImages }) {
  const allTags = [...new Set(products.flatMap((p) => p.tags ?? []))]
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState({ field: null, dir: "asc" })
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [adding, setAdding] = useState(false)
  const [newValues, setNewValues] = useState(EMPTY_PRODUCT)
  const [deletingProduct, setDeletingProduct] = useState(null)

  const handleSearch = (v) => { setSearch(v); setPage(1) }

  const handleSort = (field) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    )
    setPage(1)
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setEditValues({
      name: product.name,
      description: product.description ?? "",
      priceAud: product.priceAud,
      availability: product.availability,
      tags: product.tags ?? [],
    })
  }

  const cancelEdit = () => setEditingId(null)

  const saveEdit = (id) => {
    onUpdate?.(id, editValues)
    setEditingId(null)
  }

  const set = (key) => (e) => setEditValues((v) => ({ ...v, [key]: e.target.value }))
  const setNew = (key) => (e) => setNewValues((v) => ({ ...v, [key]: e.target.value }))

  const saveNew = () => {
    onAdd?.(newValues)
    setNewValues(EMPTY_PRODUCT)
    setAdding(false)
  }

  const toggleExpand = (id) => {
    setExpandedId((prev) => {
      if (prev !== id) onLoadImages?.(id)
      return prev === id ? null : id
    })
  }

  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    return (
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    )
  })

  const sorted = [...filtered].sort((a, b) => {
    if (!sort.field) return 0
    let av = a[sort.field] ?? ""
    let bv = b[sort.field] ?? ""
    if (sort.field === "priceAud") { av = Number(av); bv = Number(bv) }
    if (av < bv) return sort.dir === "asc" ? -1 : 1
    if (av > bv) return sort.dir === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchForm value={search} onChange={handleSearch} placeholder="搜索商品…" />
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground"
        >
          <PlusIcon className="size-4" />
          新增
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHead label="名称" field="name" sort={sort} onSort={handleSort} />
            <SortableHead label="描述" field="description" sort={sort} onSort={handleSort} />
            <SortableHead label="价格" field="priceAud" sort={sort} onSort={handleSort} />
            <TableHead>标签</TableHead>
            <SortableHead label="上架" field="availability" sort={sort} onSort={handleSort} />
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {adding && (
            <TableRow>
              <TableCell>
                <input value={newValues.name} onChange={setNew("name")} placeholder="名称" className="w-full rounded border border-input bg-background px-2 py-1 text-sm" />
              </TableCell>
              <TableCell>
                <input value={newValues.description} onChange={setNew("description")} placeholder="描述" className="w-full rounded border border-input bg-background px-2 py-1 text-sm" />
              </TableCell>
              <TableCell>
                <input type="number" value={newValues.priceAud} onChange={setNew("priceAud")} placeholder="0.00" className="w-24 rounded border border-input bg-background px-2 py-1 text-sm" />
              </TableCell>
              <TableCell>
                <TagEditor value={newValues.tags} onChange={(tags) => setNewValues((v) => ({ ...v, tags }))} allTags={allTags} />
              </TableCell>
              <TableCell>
                <select value={newValues.availability ? "yes" : "no"} onChange={(e) => setNewValues((v) => ({ ...v, availability: e.target.value === "yes" }))} className="rounded border border-input bg-background px-2 py-1 text-sm">
                  <option value="yes">是</option>
                  <option value="no">否</option>
                </select>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button onClick={saveNew} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">保存</button>
                  <button onClick={() => setAdding(false)} className="rounded border px-2 py-1 text-xs">取消</button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {paginated.map((product) => {
            const isEditing = editingId === product.id
            const isExpanded = expandedId === product.id
            const isPending = product.id.startsWith("temp_")
            return (
              <>
                <TableRow
                  key={product.id}
                  className={isPending ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                  onClick={() => { if (!isEditing && !isPending) toggleExpand(product.id) }}
                >
                  <TableCell>
                    {isEditing
                      ? <input value={editValues.name} onChange={set("name")} onClick={(e) => e.stopPropagation()} placeholder="名称" className="w-full rounded border border-input bg-background px-2 py-1 text-sm" />
                      : product.name}
                  </TableCell>
                  <TableCell className={isEditing ? "" : "max-w-xs truncate text-muted-foreground"}>
                    {isEditing
                      ? <input value={editValues.description} onChange={set("description")} onClick={(e) => e.stopPropagation()} placeholder="描述" className="w-full rounded border border-input bg-background px-2 py-1 text-sm" />
                      : (product.description ?? "—")}
                  </TableCell>
                  <TableCell>
                    {isEditing
                      ? <input type="number" value={editValues.priceAud} onChange={set("priceAud")} onClick={(e) => e.stopPropagation()} className="w-24 rounded border border-input bg-background px-2 py-1 text-sm" />
                      : `$${Number(product.priceAud).toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    {isEditing
                      ? <TagEditor value={editValues.tags} onChange={(tags) => setEditValues((v) => ({ ...v, tags }))} allTags={allTags} />
                      : product.tags?.length
                        ? <div className="flex flex-wrap gap-1">
                            {product.tags.map((tag) => (
                              <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-xs">{tag}</span>
                            ))}
                          </div>
                        : "—"}
                  </TableCell>
                  <TableCell>
                    {isEditing
                      ? <select value={editValues.availability ? "yes" : "no"} onChange={(e) => setEditValues((v) => ({ ...v, availability: e.target.value === "yes" }))} onClick={(e) => e.stopPropagation()} className="rounded border border-input bg-background px-2 py-1 text-sm">
                          <option value="yes">是</option>
                          <option value="no">否</option>
                        </select>
                      : (product.availability ? "是" : "否")}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(product.id)} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">保存</button>
                        <button onClick={cancelEdit} className="rounded border px-2 py-1 text-xs">取消</button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <Link to={`/products/${product.id}/images`} className="rounded p-1 text-muted-foreground hover:text-foreground" title="管理图片">
                          <ImagesIcon className="size-4" />
                        </Link>
                        <button onClick={() => startEdit(product)} className="rounded p-1 text-muted-foreground hover:text-foreground">
                          <PencilIcon className="size-4" />
                        </button>
                        <button onClick={() => setDeletingProduct(product)} className="rounded p-1 text-muted-foreground hover:text-destructive">
                          <Trash2Icon className="size-4" />
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow key={`${product.id}-images`}>
                    <TableCell colSpan={6} className="bg-muted/30 p-4">
                      <ProductImagesTable
                        images={product.images ?? []}
                        onUpload={(file) => onImageUpload?.(product.id, file)}
                        onDelete={(imgId) => onImageDelete?.(product.id, imgId)}
                        onSetCover={(imgId) => onSetCover?.(product.id, imgId)}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </>
            )
          })}
        </TableBody>
      </Table>
      <Pagination page={page} totalPages={totalPages} total={sorted.length} pageSize={PAGE_SIZE} onChange={setPage} />

      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
            <h2 className="text-base font-semibold">删除商品？</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{deletingProduct.name}</span> 将被永久删除，此操作不可撤销。
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setDeletingProduct(null)} className="rounded border px-3 py-1.5 text-sm">取消</button>
              <button
                onClick={() => { onDelete?.(deletingProduct.id); setDeletingProduct(null) }}
                className="rounded bg-destructive px-3 py-1.5 text-sm text-destructive-foreground"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
