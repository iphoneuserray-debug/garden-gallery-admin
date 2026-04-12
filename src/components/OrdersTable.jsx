import { useState } from "react"
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

export function OrdersTable({ orders = [] }) {
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState("")

  const filtered = orders.filter((order) => {
    const q = search.toLowerCase()
    return (
      order.id.toLowerCase().includes(q) ||
      order.customer?.name?.toLowerCase().includes(q) ||
      order.customer?.email?.toLowerCase().includes(q) ||
      order.status.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-4">
      <SearchForm value={search} onChange={setSearch} placeholder="Search orders..." />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((order) => (
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
              </TableRow>
              {expandedId === order.id && (
                <TableRow key={`${order.id}-items`}>
                  <TableCell colSpan={6} className="bg-muted/30 p-4">
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
