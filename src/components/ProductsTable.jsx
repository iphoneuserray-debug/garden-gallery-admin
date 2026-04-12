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

export function ProductsTable({ products = [] }) {
  const [search, setSearch] = useState("")

  const filtered = products.filter((product) => {
    const q = search.toLowerCase()
    return (
      product.id.toLowerCase().includes(q) ||
      product.name?.toLowerCase().includes(q) ||
      product.description?.toLowerCase().includes(q) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-4">
      <SearchForm value={search} onChange={setSearch} placeholder="Search products..." />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Available</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">{product.id}</TableCell>
              <TableCell>
                {product.imageUrl
                  ? <img src={product.imageUrl} alt={product.name} className="size-10 rounded object-cover" />
                  : "—"}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">{product.description ?? "—"}</TableCell>
              <TableCell>${Number(product.priceAud).toFixed(2)}</TableCell>
              <TableCell>
                {product.tags?.length
                  ? <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag) => (
                        <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-xs">{tag}</span>
                      ))}
                    </div>
                  : "—"}
              </TableCell>
              <TableCell>{product.availability ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
