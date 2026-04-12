import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function OrderItemsTable({ items = [] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Unit Price</TableHead>
          <TableHead>Subtotal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-mono text-xs text-muted-foreground">{item.id}</TableCell>
            <TableCell>{item.product?.name ?? item.product?.id}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>${Number(item.priceAud).toFixed(2)}</TableCell>
            <TableCell>${(item.quantity * Number(item.priceAud)).toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
