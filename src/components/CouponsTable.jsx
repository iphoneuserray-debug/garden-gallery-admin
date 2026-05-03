import { useState } from "react"
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, PlusIcon, Trash2Icon, PencilIcon } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { SearchForm } from "@/components/search-form"

function SortableHead({ label, field, sort, onSort }) {
  const active = sort.field === field
  const Icon = !active ? ChevronsUpDownIcon : sort.dir === "asc" ? ChevronUpIcon : ChevronDownIcon
  return (
    <TableHead className="cursor-pointer select-none" onClick={() => onSort(field)}>
      <div className="flex items-center gap-1">{label}<Icon className="size-3.5 opacity-50" /></div>
    </TableHead>
  )
}

const EMPTY = { code: "", type: "percent", value: "", minOrderAud: "", active: true }

export function CouponsTable({ coupons = [], onUpdate, onAdd, onDelete }) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState({ field: null, dir: "asc" })
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [adding, setAdding] = useState(false)
  const [newValues, setNewValues] = useState(EMPTY)
  const [deletingCoupon, setDeletingCoupon] = useState(null)

  const handleSort = (field) => setSort((prev) =>
    prev.field === field ? { field, dir: prev.dir === "asc" ? "desc" : "asc" } : { field, dir: "asc" }
  )

  const filtered = coupons.filter((c) => c.code?.toLowerCase().includes(search.toLowerCase()))
  const sorted = sort.field
    ? [...filtered].sort((a, b) => sort.dir === "asc"
        ? String(a[sort.field] ?? "").localeCompare(String(b[sort.field] ?? ""))
        : String(b[sort.field] ?? "").localeCompare(String(a[sort.field] ?? "")))
    : filtered

  const startEdit = (c) => { setEditingId(c.id); setEditValues({ code: c.code, type: c.type, value: String(c.value), minOrderAud: c.minOrderAud ?? "", active: c.active }) }
  const cancelEdit = () => setEditingId(null)
  const saveEdit = (id) => { onUpdate?.(id, { ...editValues, value: parseFloat(editValues.value), minOrderAud: editValues.minOrderAud !== "" ? parseFloat(editValues.minOrderAud) : null }); setEditingId(null) }
  const set = (key) => (e) => setEditValues((v) => ({ ...v, [key]: key === "active" ? e.target.checked : e.target.value }))
  const setNew = (key) => (e) => setNewValues((v) => ({ ...v, [key]: key === "active" ? e.target.checked : e.target.value }))
  const saveNew = () => { onAdd?.({ ...newValues, value: parseFloat(newValues.value), minOrderAud: newValues.minOrderAud !== "" ? parseFloat(newValues.minOrderAud) : undefined }); setNewValues(EMPTY); setAdding(false) }

  const inputCls = "w-full rounded border border-input bg-background px-2 py-1 text-sm"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchForm value={search} onChange={setSearch} placeholder="搜索优惠券…" />
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground">
          <PlusIcon className="size-4" /> 新增
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHead label="券码" field="code" sort={sort} onSort={handleSort} />
            <SortableHead label="类型" field="type" sort={sort} onSort={handleSort} />
            <SortableHead label="面值" field="value" sort={sort} onSort={handleSort} />
            <TableHead>最低消费</TableHead>
            <TableHead>启用</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {adding && (
            <TableRow>
              <TableCell><input value={newValues.code} onChange={setNew("code")} placeholder="SAVE10" className={`${inputCls} uppercase`} /></TableCell>
              <TableCell>
                <select value={newValues.type} onChange={setNew("type")} className={inputCls}>
                  <option value="percent">百分比</option>
                  <option value="fixed">固定金额</option>
                </select>
              </TableCell>
              <TableCell><input type="number" value={newValues.value} onChange={setNew("value")} placeholder={newValues.type === "percent" ? "10" : "5.00"} className={inputCls} /></TableCell>
              <TableCell><input type="number" value={newValues.minOrderAud} onChange={setNew("minOrderAud")} placeholder="0.00" className={inputCls} /></TableCell>
              <TableCell><input type="checkbox" checked={newValues.active} onChange={setNew("active")} className="size-4" /></TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button onClick={saveNew} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">Save</button>
                  <button onClick={() => setAdding(false)} className="rounded border px-2 py-1 text-xs">Cancel</button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {sorted.map((coupon) => {
            const isEditing = editingId === coupon.id
            const isPending = coupon.id.startsWith("temp_")
            return (
              <TableRow key={coupon.id} className={isPending ? "opacity-50 pointer-events-none" : ""}>
                <TableCell className="font-mono font-semibold">
                  {isEditing ? <input value={editValues.code} onChange={set("code")} className={`${inputCls} uppercase`} /> : coupon.code}
                </TableCell>
                <TableCell>
                  {isEditing
                    ? <select value={editValues.type} onChange={set("type")} className={inputCls}><option value="percent">百分比</option><option value="fixed">固定金额</option></select>
                    : coupon.type}
                </TableCell>
                <TableCell>
                  {isEditing
                    ? <input type="number" value={editValues.value} onChange={set("value")} className={inputCls} />
                    : coupon.type === "percent" ? `${coupon.value}%` : `$${Number(coupon.value).toFixed(2)}`}
                </TableCell>
                <TableCell>
                  {isEditing
                    ? <input type="number" value={editValues.minOrderAud} onChange={set("minOrderAud")} placeholder="—" className={inputCls} />
                    : coupon.minOrderAud ? `$${Number(coupon.minOrderAud).toFixed(2)}` : "—"}
                </TableCell>
                <TableCell>
                  {isEditing
                    ? <input type="checkbox" checked={editValues.active} onChange={set("active")} className="size-4" />
                    : <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${coupon.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>{coupon.active ? "启用" : "停用"}</span>}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(coupon.id)} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">保存</button>
                      <button onClick={cancelEdit} className="rounded border px-2 py-1 text-xs">取消</button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(coupon)} className="rounded p-1 text-muted-foreground hover:text-foreground"><PencilIcon className="size-4" /></button>
                      <button onClick={() => setDeletingCoupon(coupon)} className="rounded p-1 text-muted-foreground hover:text-destructive"><Trash2Icon className="size-4" /></button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {deletingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
            <h2 className="text-base font-semibold">删除优惠券？</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-mono font-semibold text-foreground">{deletingCoupon.code}</span> 将被永久删除。
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setDeletingCoupon(null)} className="rounded border px-3 py-1.5 text-sm">取消</button>
              <button onClick={() => { onDelete?.(deletingCoupon.id); setDeletingCoupon(null) }} className="rounded bg-destructive px-3 py-1.5 text-sm text-destructive-foreground">删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
