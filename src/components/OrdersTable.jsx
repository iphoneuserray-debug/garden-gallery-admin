import { useState } from "react"
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon } from "lucide-react"
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

export function OrdersTable({ orders = [], onStatusUpdate }) {
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState({ field: null, dir: "asc" })

  const handleSort = (field) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchForm value={search} onChange={setSearch} placeholder="Search orders..." />
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
            <TableHead>Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <>
              <TableRow
                key={order.id}
                className="cursor-pointer"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">{order.id}</TableCell>
                <TableCell>{order.customer?.name ?? order.customer?.email ?? order.customer?.id}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <select
                    value={order.status}
                    onChange={(e) => onStatusUpdate?.(order.id, e.target.value)}
                    className={`rounded border border-input bg-background px-2 py-1 text-sm ${statusStyles[order.status] ?? ""}`}
                  >
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="failed">failed</option>
                  </select>
                </TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>${Number(order.totalAud).toFixed(2)}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{order.note ?? "—"}</TableCell>
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
    </div>
  )
}
