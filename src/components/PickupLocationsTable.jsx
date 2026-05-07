import { useState } from "react"
import { PlusIcon, Trash2Icon, PencilIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SearchForm } from "@/components/search-form"
import { SortableHead } from "@/components/SortableHead"
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal"
import { inputCls } from "@/lib/table-utils"

const EMPTY = { name: "", address: "", active: true }

export function PickupLocationsTable({ locations = [], onUpdate, onAdd, onDelete }) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState({ field: null, dir: "asc" })
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [adding, setAdding] = useState(false)
  const [newValues, setNewValues] = useState(EMPTY)
  const [deletingLocation, setDeletingLocation] = useState(null)

  const handleSort = (field) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    )
  }

  const filtered = locations.filter((l) =>
    [l.name, l.address].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  )

  const sorted = sort.field
    ? [...filtered].sort((a, b) => {
        const av = a[sort.field] ?? ""
        const bv = b[sort.field] ?? ""
        return sort.dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
      })
    : filtered

  const startEdit = (location) => {
    setEditingId(location.id)
    setEditValues({ name: location.name, address: location.address, active: location.active })
  }

  const cancelEdit = () => setEditingId(null)

  const saveEdit = (id) => {
    onUpdate?.(id, editValues)
    setEditingId(null)
  }

  const set = (key) => (e) =>
    setEditValues((v) => ({ ...v, [key]: key === "active" ? e.target.checked : e.target.value }))

  const setNew = (key) => (e) =>
    setNewValues((v) => ({ ...v, [key]: key === "active" ? e.target.checked : e.target.value }))

  const saveNew = () => {
    onAdd?.(newValues)
    setNewValues(EMPTY)
    setAdding(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchForm value={search} onChange={setSearch} placeholder="搜索取货点…" />
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
            <SortableHead label="地址" field="address" sort={sort} onSort={handleSort} />
            <TableHead>启用</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {adding && (
            <TableRow>
              <TableCell><input value={newValues.name} onChange={setNew("name")} placeholder="名称" className={inputCls} /></TableCell>
              <TableCell><input value={newValues.address} onChange={setNew("address")} placeholder="地址" className={inputCls} /></TableCell>
              <TableCell>
                <input type="checkbox" checked={newValues.active} onChange={setNew("active")} className="size-4" />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button onClick={saveNew} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">保存</button>
                  <button onClick={() => setAdding(false)} className="rounded border px-2 py-1 text-xs">取消</button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {sorted.map((location) => {
            const isEditing = editingId === location.id
            const isPending = location.id.startsWith("temp_")
            return (
              <TableRow key={location.id} className={isPending ? "opacity-50 pointer-events-none" : ""}>
                <TableCell>
                  {isEditing
                    ? <input value={editValues.name} onChange={set("name")} className={inputCls} />
                    : location.name}
                </TableCell>
                <TableCell>
                  {isEditing
                    ? <input value={editValues.address} onChange={set("address")} className={inputCls} />
                    : location.address}
                </TableCell>
                <TableCell>
                  {isEditing
                    ? <input type="checkbox" checked={editValues.active} onChange={set("active")} className="size-4" />
                    : (
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${location.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                        {location.active ? "启用" : "停用"}
                      </span>
                    )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(location.id)} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">保存</button>
                      <button onClick={cancelEdit} className="rounded border px-2 py-1 text-xs">取消</button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(location)} className="rounded p-1 text-muted-foreground hover:text-foreground">
                        <PencilIcon className="size-4" />
                      </button>
                      <button onClick={() => setDeletingLocation(location)} className="rounded p-1 text-muted-foreground hover:text-destructive">
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {deletingLocation && (
        <DeleteConfirmModal
          title="删除取货点？"
          description={<><span className="font-medium text-foreground">{deletingLocation.name}</span> 将被永久删除，此操作不可撤销。</>}
          onConfirm={() => { onDelete?.(deletingLocation.id); setDeletingLocation(null) }}
          onCancel={() => setDeletingLocation(null)}
        />
      )}
    </div>
  )
}
