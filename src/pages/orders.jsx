import { OrdersTable } from "@/components/OrdersTable"

const mockOrders = [
  {
    id: "a1b2c3d4-0000-0000-0000-000000000001",
    customer: { name: "Alice Smith", email: "alice@example.com" },
    status: "paid",
    paymentMethod: "card",
    totalAud: 129.99,
    createdAt: "2024-03-01T10:00:00Z",
    items: [
      { id: "item-001", product: { name: "Rose Bush" }, quantity: 2, priceAud: 39.99 },
      { id: "item-002", product: { name: "Lavender Pot" }, quantity: 1, priceAud: 50.01 },
    ],
  },
  {
    id: "a1b2c3d4-0000-0000-0000-000000000002",
    customer: { name: "Bob Jones", email: "bob@example.com" },
    status: "pending",
    paymentMethod: "card",
    totalAud: 74.50,
    createdAt: "2024-03-05T14:30:00Z",
    items: [
      { id: "item-003", product: { name: "Succulent Set" }, quantity: 5, priceAud: 14.90 },
    ],
  },
]

export default function Orders() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Orders</h1>
      <OrdersTable orders={mockOrders} />
    </div>
  )
}
