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
import { OrderItemsTable } from "@/components/OrderItemsTable"
import { SearchForm } from "@/components/search-form"

const statusStyles = {
  pending: "text-yellow-600",
  paid: "text-green-600",
  failed: "text-red-600",
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

const EMPTY_ORDER = { customer: "", status: "pending", paymentMethod: "", totalAud: "" }

export function OrdersTable({ orders = [], onAdd, onDelete }) {
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState({ field: null, dir: "asc" })
  const [adding, setAdding] = useState(false)
  const [newValues, setNewValues] = useState(EMPTY_ORDER)
  const [deletingOrder, setDeletingOrder] = useState(null)

  const handleSort = (field) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    )
  }

  const setNew = (key) => (e) =>
    setNewValues((v) => ({ ...v, [key]: e.target.value }))

  const saveNew = () => {
    onAdd?.(newValues)
    setNewValues(EMPTY_ORDER)
    setAdding(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchForm value={search} onChange={setSearch} placeholder="Search orders..." />
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
            <SortableHead label="Customer" field="customer" sort={sort} onSort={handleSort} />
            <SortableHead label="Status" field="status" sort={sort} onSort={handleSort} />
            <SortableHead label="Payment Method" field="paymentMethod" sort={sort} onSort={handleSort} />
            <SortableHead label="Total" field="total" sort={sort} onSort={handleSort} />
            <SortableHead label="Date" field="date" sort={sort} onSort={handleSort} />
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {adding && (
            <TableRow>
              <TableCell>—</TableCell>
              <TableCell>
                <input value={newValues.customer} onChange={setNew("customer")} placeholder="Customer ID" className="w-full rounded border border-input bg-background px-2 py-1 text-sm" />
              </TableCell>
              <TableCell>
                <select value={newValues.status} onChange={setNew("status")} className="rounded border border-input bg-background px-2 py-1 text-sm">
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </TableCell>
              <TableCell>
                <input value={newValues.paymentMethod} onChange={setNew("paymentMethod")} placeholder="Payment method" className="w-full rounded border border-input bg-background px-2 py-1 text-sm" />
              </TableCell>
              <TableCell>
                <input type="number" value={newValues.totalAud} onChange={setNew("totalAud")} placeholder="0.00" className="w-24 rounded border border-input bg-background px-2 py-1 text-sm" />
              </TableCell>
              <TableCell>—</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button onClick={saveNew} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">Save</button>
                  <button onClick={() => setAdding(false)} className="rounded border px-2 py-1 text-xs">Cancel</button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {orders.map((order) => (
            <>
              <TableRow
                key={order.id}
                className="cursor-pointer"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">{order.id}</TableCell>
                <TableCell>{order.customer?.name ?? order.customer?.email ?? order.customer?.id}</TableCell>
                <TableCell className={statusStyles[order.status] ?? ""}>{order.status}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>${Number(order.totalAud).toFixed(2)}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setDeletingOrder(order)}
                    className="rounded p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2Icon className="size-4" />
                  </button>
                </TableCell>
              </TableRow>
              {expandedId === order.id && (
                <TableRow key={`${order.id}-items`}>
                  <TableCell colSpan={7} className="bg-muted/30 p-4">
                    <OrderItemsTable items={order.items} />
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>

      {deletingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
            <h2 className="text-base font-semibold">Delete order?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Order <span className="font-medium text-foreground">#{deletingOrder.id}</span> will be permanently deleted. This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setDeletingOrder(null)} className="rounded border px-3 py-1.5 text-sm">
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete?.(deletingOrder.id)
                  setDeletingOrder(null)
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
