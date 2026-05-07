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
import { Pagination } from "@/components/Pagination"
import { SortableHead } from "@/components/SortableHead"
import { PAGE_SIZE } from "@/lib/table-utils"

const statusStyles = {
  pending: "text-yellow-600",
  paid:    "text-green-600",
  failed:  "text-red-600",
}

const STATUS_TABS = ["all", "paid", "pending", "failed"]
const STATUS_TAB_LABELS = { all: "全部", paid: "已付款", pending: "待支付", failed: "失败" }

export function TransactionsTable({ transactions = [], onStatusUpdate }) {
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState({ field: null, dir: "asc" })
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")

  const handleSearch = (v) => { setSearch(v); setPage(1) }
  const handleTabChange = (tab) => { setStatusFilter(tab); setPage(1) }

  const handleSort = (field) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    )
    setPage(1)
  }

  // Summary stats
  const totalRevenue = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + Number(t.totalAud ?? 0), 0)
  const counts = {
    paid:    transactions.filter((t) => t.status === "paid").length,
    pending: transactions.filter((t) => t.status === "pending").length,
    failed:  transactions.filter((t) => t.status === "failed").length,
  }

  const filtered = transactions.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false
    const q = search.toLowerCase()
    return (
      !q ||
      t.id.toLowerCase().includes(q) ||
      t.order?.id?.toLowerCase().includes(q) ||
      t.customer?.name?.toLowerCase().includes(q) ||
      t.customer?.email?.toLowerCase().includes(q)
    )
  })

  const sorted = [...filtered].sort((a, b) => {
    if (!sort.field) return 0
    let av, bv
    if (sort.field === "customer") { av = a.customer?.name ?? ""; bv = b.customer?.name ?? "" }
    else if (sort.field === "total") { av = Number(a.totalAud ?? 0); bv = Number(b.totalAud ?? 0) }
    else if (sort.field === "date") { av = a.createdAt; bv = b.createdAt }
    else if (sort.field === "scheduledDate") { av = a.scheduledDate ?? ""; bv = b.scheduledDate ?? "" }
    else { av = a[sort.field] ?? ""; bv = b[sort.field] ?? "" }
    if (av < bv) return sort.dir === "asc" ? -1 : 1
    if (av > bv) return sort.dir === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs text-muted-foreground">收入</p>
          <p className="mt-0.5 text-xl font-semibold">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs text-muted-foreground">已付款</p>
          <p className="mt-0.5 text-xl font-semibold text-green-600">{counts.paid}</p>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs text-muted-foreground">待支付</p>
          <p className="mt-0.5 text-xl font-semibold text-yellow-600">{counts.pending}</p>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs text-muted-foreground">失败</p>
          <p className="mt-0.5 text-xl font-semibold text-red-600">{counts.failed}</p>
        </div>
      </div>

      {/* Search + status tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchForm value={search} onChange={handleSearch} placeholder="搜索交易…" />
        <div className="flex rounded-md border overflow-hidden text-sm">
          {STATUS_TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-3 py-1.5 ${i > 0 ? "border-l" : ""} ${statusFilter === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              {STATUS_TAB_LABELS[tab]}
              {tab !== "all" && (
                <span className="ml-1.5 rounded-full bg-current/15 px-1.5 py-0.5 text-xs font-medium">
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHead label="交易编号" field="id" sort={sort} onSort={handleSort} />
            <TableHead>订单编号</TableHead>
            <SortableHead label="客户" field="customer" sort={sort} onSort={handleSort} />
            <SortableHead label="状态" field="status" sort={sort} onSort={handleSort} />
            <TableHead>配送方式</TableHead>
            <SortableHead label="预约日期" field="scheduledDate" sort={sort} onSort={handleSort} />
            <SortableHead label="总额" field="total" sort={sort} onSort={handleSort} />
            <SortableHead label="下单日期" field="date" sort={sort} onSort={handleSort} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((tx) => (
            <>
              <TableRow
                key={tx.id}
                className="cursor-pointer"
                onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {tx.id.slice(0, 8)}…
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {tx.order ? `${tx.order.id.slice(0, 8)}…` : "—"}
                </TableCell>
                <TableCell>{tx.customer?.name ?? tx.customer?.email ?? "—"}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <select
                    value={tx.status}
                    onChange={(e) => onStatusUpdate?.(tx.id, e.target.value)}
                    className={`rounded border border-input bg-background px-2 py-1 text-sm ${statusStyles[tx.status] ?? ""}`}
                  >
                    <option value="pending">待支付</option>
                    <option value="paid">已付款</option>
                    <option value="failed">失败</option>
                  </select>
                </TableCell>
                <TableCell className="text-sm">
                  {!tx.deliveryType && <span className="text-muted-foreground">—</span>}
                  {tx.deliveryType === "delivery" && (
                    <div>
                      <span className="font-medium text-blue-600">快递</span>
                      {tx.deliveryAddress && (
                        <p className="text-xs text-muted-foreground break-words">{tx.deliveryAddress}</p>
                      )}
                    </div>
                  )}
                  {tx.deliveryType === "pickup" && (
                    <div>
                      <span className="font-medium text-purple-600">自取</span>
                      {tx.pickupLocation && (
                        <>
                          <p className="text-xs font-medium">{tx.pickupLocation.name}</p>
                          {tx.pickupLocation.address && (
                            <p className="text-xs text-muted-foreground break-words">{tx.pickupLocation.address}</p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {tx.scheduledDate
                    ? new Date(tx.scheduledDate + "T00:00:00").toLocaleDateString("zh-CN")
                    : <span className="text-muted-foreground">—</span>}
                </TableCell>
                <TableCell>${Number(tx.totalAud).toFixed(2)}</TableCell>
                <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
              {expandedId === tx.id && (
                <TableRow key={`${tx.id}-items`}>
                  <TableCell colSpan={8} className="bg-muted/30 p-4">
                    <OrderItemsTable items={tx.items ?? []} />
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
      <Pagination page={page} totalPages={totalPages} total={sorted.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  )
}
