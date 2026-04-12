import { ProductsTable } from "@/components/ProductsTable"

const mockProducts = [
  {
    id: "p1b2c3d4-0000-0000-0000-000000000001",
    name: "Rose Bush",
    description: "A beautiful red rose bush perfect for garden borders.",
    priceAud: 39.99,
    tags: ["flowers", "outdoor"],
    availability: true,
    imageUrl: null,
  },
  {
    id: "p1b2c3d4-0000-0000-0000-000000000002",
    name: "Succulent Set",
    description: "Set of 5 assorted succulents in terracotta pots.",
    priceAud: 14.90,
    tags: ["succulents", "indoor"],
    availability: true,
    imageUrl: null,
  },
  {
    id: "p1b2c3d4-0000-0000-0000-000000000003",
    name: "Lavender Pot",
    description: null,
    priceAud: 50.01,
    tags: ["herbs", "outdoor"],
    availability: false,
    imageUrl: null,
  },
]

export default function Products() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Products</h1>
      <ProductsTable products={mockProducts} />
    </div>
  )
}
