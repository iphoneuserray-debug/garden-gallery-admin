import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SearchForm } from "@/components/search-form"

export function CustomersTable({ customers = [] }) {
  const [search, setSearch] = useState("")

  const filtered = customers.filter((customer) => {
    const q = search.toLowerCase()
    return (
      customer.id.toLowerCase().includes(q) ||
      customer.name?.toLowerCase().includes(q) ||
      customer.email?.toLowerCase().includes(q) ||
      customer.phone?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-4">
      <SearchForm value={search} onChange={setSearch} placeholder="Search customers..." />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Stripe ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">{customer.id}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone ?? "—"}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{customer.stripeCustomerId ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
