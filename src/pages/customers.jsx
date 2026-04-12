import { CustomersTable } from "@/components/CustomersTable"

const mockCustomers = [
  {
    id: "c1b2c3d4-0000-0000-0000-000000000001",
    name: "Alice Smith",
    email: "alice@example.com",
    phone: "+61 400 000 001",
    stripeCustomerId: "cus_abc123",
  },
  {
    id: "c1b2c3d4-0000-0000-0000-000000000002",
    name: "Bob Jones",
    email: "bob@example.com",
    phone: null,
    stripeCustomerId: null,
  },
]

export default function Customers() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Customers</h1>
      <CustomersTable customers={mockCustomers} />
    </div>
  )
}
