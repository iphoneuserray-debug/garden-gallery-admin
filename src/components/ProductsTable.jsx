import { useState } from "react"
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, PlusIcon, Trash2Icon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SearchForm } from "@/components/search-form"

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

const EMPTY_PRODUCT = { name: "", description: "", priceAud: "", availability: true }

export function ProductsTable({ products = [], onUpdate, onAdd, onDelete }) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState({ field: null, dir: "asc" })
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [adding, setAdding] = useState(false)
  const [newValues, setNewValues] = useState(EMPTY_PRODUCT)
  const [deletingProduct, setDeletingProduct] = useState(null)

  const handleSort = (field) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    )
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setEditValues({
      name: product.name,
      description: product.description ?? "",
      priceAud: product.priceAud,
      availability: product.availability,
    })
  }

  const cancelEdit = () => setEditingId(null)

  const saveEdit = (id) => {
    onUpdate?.(id, editValues)
    setEditingId(null)
  }

  const set = (key) => (e) =>
    setEditValues((v) => ({ ...v, [key]: e.target.value }))

  const setNew = (key) => (e) =>
    setNewValues((v) => ({ ...v, [key]: e.target.value }))

  const saveNew = () => {
    onAdd?.(newValues)
    setNewValues(EMPTY_PRODUCT)
    setAdding(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchForm value={search} onChange={setSearch} placeholder="Search products..." />
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground"
        >
          <PlusIcon className="size-4" />
          Add New
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <SortableHead label="Name" field="name" sort={sort} onSort={handleSort} />
            <SortableHead label="Description" field="description" sort={sort} onSort={handleSort} />
            <SortableHead label="Price" field="priceAud" sort={sort} onSort={handleSort} />
            <TableHead>Tags</TableHead>
            <SortableHead label="Available" field="availability" sort={sort} onSort={handleSort} />
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {adding && (
            <TableRow>
              <TableCell>—</TableCell>
              <TableCell>
                <input value={newValues.name} onChange={setNew("name")} placeholder="Name" className="w-full rounded border border-input bg-background px-2 py-1 text-sm" />
              </TableCell>
              <TableCell>
                <input value={newValues.description} onChange={setNew("description")} placeholder="Description" className="w-full rounded border border-input bg-background px-2 py-1 text-sm" />
              </TableCell>
              <TableCell>
                <input type="number" value={newValues.priceAud} onChange={setNew("priceAud")} placeholder="0.00" className="w-24 rounded border border-input bg-background px-2 py-1 text-sm" />
              </TableCell>
              <TableCell>—</TableCell>
              <TableCell>
                <select value={newValues.availability ? "yes" : "no"} onChange={(e) => setNewValues((v) => ({ ...v, availability: e.target.value === "yes" }))} className="rounded border border-input bg-background px-2 py-1 text-sm">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button onClick={saveNew} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">Save</button>
                  <button onClick={() => setAdding(false)} className="rounded border px-2 py-1 text-xs">Cancel</button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {products.map((product) => {
            const isEditing = editingId === product.id
            return (
              <TableRow
                key={product.id}
                className={isEditing ? "" : "cursor-pointer"}
                onClick={() => { if (!isEditing) startEdit(product) }}
              >
                <TableCell>
                  {product.imageUrl
                    ? <img src={product.imageUrl} alt={product.name} className="size-10 rounded object-cover" />
                    : "—"}
                </TableCell>
                <TableCell>
                  {isEditing
                    ? <input value={editValues.name} onChange={set("name")} onClick={(e) => e.stopPropagation()} className="w-full rounded border border-input bg-background px-2 py-1 text-sm" />
                    : product.name}
                </TableCell>
                <TableCell className={isEditing ? "" : "max-w-xs truncate text-muted-foreground"}>
                  {isEditing
                    ? <input value={editValues.description} onChange={set("description")} onClick={(e) => e.stopPropagation()} className="w-full rounded border border-input bg-background px-2 py-1 text-sm" />
                    : (product.description ?? "—")}
                </TableCell>
                <TableCell>
                  {isEditing
                    ? <input type="number" value={editValues.priceAud} onChange={set("priceAud")} onClick={(e) => e.stopPropagation()} className="w-24 rounded border border-input bg-background px-2 py-1 text-sm" />
                    : `$${Number(product.priceAud).toFixed(2)}`}
                </TableCell>
                <TableCell>
                  {product.tags?.length
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
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    : (product.availability ? "Yes" : "No")}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(product.id)} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">Save</button>
                      <button onClick={cancelEdit} className="rounded border px-2 py-1 text-xs">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingProduct(product)}
                      className="rounded p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
            <h2 className="text-base font-semibold">Delete product?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{deletingProduct.name}</span> will be permanently deleted. This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setDeletingProduct(null)} className="rounded border px-3 py-1.5 text-sm">
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete?.(deletingProduct.id)
                  setDeletingProduct(null)
                }}
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
