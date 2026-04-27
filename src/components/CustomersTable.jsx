import { useState } from "react"
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, PlusIcon, Trash2Icon, PencilIcon } from "lucide-react"
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

const EMPTY_CUSTOMER = { name: "", email: "", phone: "", stripeCustomerId: "" }

export function CustomersTable({ customers = [], onUpdate, onAdd, onDelete }) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState({ field: null, dir: "asc" })
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [adding, setAdding] = useState(false)
  const [newValues, setNewValues] = useState(EMPTY_CUSTOMER)
  const [deletingCustomer, setDeletingCustomer] = useState(null)

  const handleSort = (field) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    )
  }

  const startEdit = (customer) => {
    setEditingId(customer.id)
    setEditValues({
      name: customer.name,
      email: customer.email,
      phone: customer.phone ?? "",
      stripeCustomerId: customer.stripeCustomerId ?? "",
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
    setNewValues(EMPTY_CUSTOMER)
    setAdding(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchForm value={search} onChange={setSearch} placeholder="Search customers..." />
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
            <SortableHead label="ID" field="id" sort={sort} onSort={handleSort} />
            <SortableHead label="Name" field="name" sort={sort} onSort={handleSort} />
            <SortableHead label="Email" field="email" sort={sort} onSort={handleSort} />
            <SortableHead label="Phone" field="phone" sort={sort} onSort={handleSort} />
            <SortableHead label="Stripe ID" field="stripeCustomerId" sort={sort} onSort={handleSort} />
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
                <input value={newValues.email} onChange={setNew("email")} placeholder="Email" className="w-full rounded border border-input bg-background px-2 py-1 text-sm" />
              </TableCell>
              <TableCell>
                <input value={newValues.phone} onChange={setNew("phone")} placeholder="Phone" className="w-full rounded border border-input bg-background px-2 py-1 text-sm" />
              </TableCell>
              <TableCell>
                <input value={newValues.stripeCustomerId} onChange={setNew("stripeCustomerId")} placeholder="Stripe ID" className="w-full rounded border border-input bg-background px-2 py-1 text-sm font-mono text-xs" />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button onClick={saveNew} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">Save</button>
                  <button onClick={() => setAdding(false)} className="rounded border px-2 py-1 text-xs">Cancel</button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {customers.map((customer) => {
            const isEditing = editingId === customer.id
            return (
              <TableRow
                key={customer.id}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">{customer.id}</TableCell>
                <TableCell>
                  {isEditing
                    ? <input value={editValues.name} onChange={set("name")}className="w-full rounded border border-input bg-background px-2 py-1 text-sm" />
                    : customer.name}
                </TableCell>
                <TableCell>
                  {isEditing
                    ? <input value={editValues.email} onChange={set("email")}className="w-full rounded border border-input bg-background px-2 py-1 text-sm" />
                    : customer.email}
                </TableCell>
                <TableCell>
                  {isEditing
                    ? <input value={editValues.phone} onChange={set("phone")}className="w-full rounded border border-input bg-background px-2 py-1 text-sm" />
                    : (customer.phone ?? "—")}
                </TableCell>
                <TableCell className={isEditing ? "" : "font-mono text-xs text-muted-foreground"}>
                  {isEditing
                    ? <input value={editValues.stripeCustomerId} onChange={set("stripeCustomerId")}className="w-full rounded border border-input bg-background px-2 py-1 font-mono text-xs" />
                    : (customer.stripeCustomerId ?? "—")}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(customer.id)} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">Save</button>
                      <button onClick={cancelEdit} className="rounded border px-2 py-1 text-xs">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(customer)}
                        className="rounded p-1 text-muted-foreground hover:text-foreground"
                      >
                        <PencilIcon className="size-4" />
                      </button>
                      <button
                        onClick={() => setDeletingCustomer(customer)}
                        className="rounded p-1 text-muted-foreground hover:text-destructive"
                      >
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

      {deletingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
            <h2 className="text-base font-semibold">Delete customer?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{deletingCustomer.name}</span> will be permanently deleted. This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setDeletingCustomer(null)} className="rounded border px-3 py-1.5 text-sm">
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete?.(deletingCustomer.id)
                  setDeletingCustomer(null)
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
