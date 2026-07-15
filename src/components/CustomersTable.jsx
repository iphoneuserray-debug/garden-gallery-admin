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
import { Pagination } from "@/components/Pagination"
import { SortableHead } from "@/components/SortableHead"
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal"
import { inputCls, PAGE_SIZE } from "@/lib/table-utils"

const EMPTY_CUSTOMER = { name: "", email: "", phone: "", gender: "", wechatNumber: "", stripeCustomerId: "" }

export function CustomersTable({ customers = [], onUpdate, onAdd, onDelete }) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState({ field: null, dir: "asc" })
  const [page, setPage] = useState(1)
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [adding, setAdding] = useState(false)
  const [newValues, setNewValues] = useState(EMPTY_CUSTOMER)
  const [deletingCustomer, setDeletingCustomer] = useState(null)

  const handleSearch = (v) => { setSearch(v); setPage(1) }

  const handleSort = (field) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    )
    setPage(1)
  }

  const startEdit = (customer) => {
    setEditingId(customer.id)
    setEditValues({
      name: customer.name,
      email: customer.email,
      phone: customer.phone ?? "",
      gender: customer.gender ?? "",
      wechatNumber: customer.wechatNumber ?? "",
      stripeCustomerId: customer.stripeCustomerId ?? "",
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
    setNewValues(EMPTY_CUSTOMER)
    setAdding(false)
  }

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    return (
      !q ||
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.wechatNumber?.toLowerCase().includes(q)
    )
  })

  const sorted = [...filtered].sort((a, b) => {
    if (!sort.field) return 0
    const av = a[sort.field] ?? ""
    const bv = b[sort.field] ?? ""
    if (av < bv) return sort.dir === "asc" ? -1 : 1
    if (av > bv) return sort.dir === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchForm value={search} onChange={handleSearch} placeholder="搜索客户…" />
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
            <SortableHead label="编号" field="id" sort={sort} onSort={handleSort} />
            <SortableHead label="姓名" field="name" sort={sort} onSort={handleSort} />
            <SortableHead label="邮箱" field="email" sort={sort} onSort={handleSort} />
            <SortableHead label="电话" field="phone" sort={sort} onSort={handleSort} />
            <SortableHead label="性别" field="gender" sort={sort} onSort={handleSort} />
            <SortableHead label="微信" field="wechatNumber" sort={sort} onSort={handleSort} />
            <SortableHead label="Stripe编号" field="stripeCustomerId" sort={sort} onSort={handleSort} />
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {adding && (
            <TableRow>
              <TableCell>—</TableCell>
              <TableCell><input value={newValues.name} onChange={setNew("name")} placeholder="姓名" className={inputCls} /></TableCell>
              <TableCell><input value={newValues.email} onChange={setNew("email")} placeholder="邮箱" className={inputCls} /></TableCell>
              <TableCell><input value={newValues.phone} onChange={setNew("phone")} placeholder="电话" className={inputCls} /></TableCell>
              <TableCell>
                <select value={newValues.gender} onChange={setNew("gender")} className={inputCls}>
                  <option value="">—</option>
                  <option value="Male">男</option>
                  <option value="Female">女</option>
                  <option value="Other">其他</option>
                </select>
              </TableCell>
              <TableCell><input value={newValues.wechatNumber} onChange={setNew("wechatNumber")} placeholder="微信号" className={inputCls} /></TableCell>
              <TableCell><input value={newValues.stripeCustomerId} onChange={setNew("stripeCustomerId")} placeholder="Stripe ID" className={`${inputCls} font-mono text-xs`} /></TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button onClick={saveNew} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">保存</button>
                  <button onClick={() => setAdding(false)} className="rounded border px-2 py-1 text-xs">取消</button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {paginated.map((customer) => {
            const isEditing = editingId === customer.id
            const isPending = customer.id.startsWith("temp_")
            return (
              <TableRow key={customer.id} className={isPending ? "opacity-50 pointer-events-none" : ""}>
                <TableCell className="font-mono text-xs text-muted-foreground">{customer.id.slice(0, 8)}…</TableCell>
                <TableCell>
                  {isEditing
                    ? <input value={editValues.name} onChange={set("name")} className={inputCls} />
                    : customer.name}
                </TableCell>
                <TableCell>
                  {isEditing
                    ? <input value={editValues.email} onChange={set("email")} className={inputCls} />
                    : customer.email}
                </TableCell>
                <TableCell>
                  {isEditing
                    ? <input value={editValues.phone} onChange={set("phone")} className={inputCls} />
                    : (customer.phone ?? "—")}
                </TableCell>
                <TableCell>
                  {isEditing
                    ? (
                      <select value={editValues.gender} onChange={set("gender")} className={inputCls}>
                        <option value="">—</option>
                        <option value="Male">男</option>
                        <option value="Female">女</option>
                        <option value="Other">其他</option>
                      </select>
                    )
                    : (customer.gender ?? "—")}
                </TableCell>
                <TableCell>
                  {isEditing
                    ? <input value={editValues.wechatNumber} onChange={set("wechatNumber")} placeholder="WeChat" className={inputCls} />
                    : (customer.wechatNumber ?? "—")}
                </TableCell>
                <TableCell className={isEditing ? "" : "font-mono text-xs text-muted-foreground"}>
                  {isEditing
                    ? <input value={editValues.stripeCustomerId} onChange={set("stripeCustomerId")} className={`${inputCls} font-mono text-xs`} />
                    : (customer.stripeCustomerId ?? "—")}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(customer.id)} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">保存</button>
                      <button onClick={cancelEdit} className="rounded border px-2 py-1 text-xs">取消</button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(customer)} className="rounded p-1 text-muted-foreground hover:text-foreground">
                        <PencilIcon className="size-4" />
                      </button>
                      <button onClick={() => setDeletingCustomer(customer)} className="rounded p-1 text-muted-foreground hover:text-destructive">
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
      <Pagination page={page} totalPages={totalPages} total={sorted.length} pageSize={PAGE_SIZE} onChange={setPage} />

      {deletingCustomer && (
        <DeleteConfirmModal
          title="删除客户？"
          description={<><span className="font-medium text-foreground">{deletingCustomer.name}</span> 将被永久删除，此操作不可撤销。</>}
          onConfirm={() => { onDelete?.(deletingCustomer.id); setDeletingCustomer(null) }}
          onCancel={() => setDeletingCustomer(null)}
        />
      )}
    </div>
  )
}
