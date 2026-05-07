import { useState } from "react"
import { CheckCircle2Icon, CircleIcon, PhoneIcon, MessageCircleIcon, MapPinIcon, TruckIcon } from "lucide-react"
import { SearchForm } from "@/components/search-form"

const paymentBadge = {
  paid:    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  failed:  "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
}

const deliveryBadge = {
  delivery: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  pickup:   "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
}

export function OrdersTable({ orders = [], onToggleCompleted }) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("pending")

  const filtered = orders.filter((o) => {
    const tx = o.transaction ?? {}
    if (filter === "pending" && o.completed) return false
    const q = search.toLowerCase()
    return (
      !q ||
      tx.customer?.name?.toLowerCase().includes(q) ||
      tx.customer?.email?.toLowerCase().includes(q) ||
      tx.customer?.phone?.toLowerCase().includes(q) ||
      tx.customer?.wechatNumber?.toLowerCase().includes(q) ||
      tx.note?.toLowerCase().includes(q) ||
      tx.deliveryAddress?.toLowerCase().includes(q) ||
      tx.pickupLocation?.name?.toLowerCase().includes(q)
    )
  })

  const pendingCount = orders.filter((o) => !o.completed).length

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchForm value={search} onChange={setSearch} placeholder="按客户、地址或备注搜索…" />
        <div className="flex rounded-md border overflow-hidden text-sm">
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 ${filter === "pending" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
          >
            待处理
            <span className="ml-1.5 rounded-full bg-current/15 px-1.5 py-0.5 text-xs font-medium">{pendingCount}</span>
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 border-l ${filter === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
          >
            全部
            <span className="ml-1.5 rounded-full bg-current/15 px-1.5 py-0.5 text-xs font-medium">{orders.length}</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {filter === "pending" ? "暂无待处理订单 — 全部完成！" : "未找到订单。"}
        </p>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((order) => {
          const tx = order.transaction ?? {}
          const customer = tx.customer ?? {}
          const items = tx.items ?? []

          return (
            <div
              key={order.id}
              className={`flex flex-col rounded-lg border bg-card transition-opacity ${order.completed ? "opacity-40" : ""}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 p-4 pb-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-card-foreground">
                    {customer.name ?? customer.email ?? "Guest"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <button
                  onClick={() => onToggleCompleted?.(order.id, !order.completed)}
                  title={order.completed ? "Mark as pending" : "Mark as completed"}
                  className="mt-0.5 shrink-0"
                >
                  {order.completed
                    ? <CheckCircle2Icon className="size-6 text-green-600" />
                    : <CircleIcon className="size-6 text-muted-foreground hover:text-green-600 transition-colors" />
                  }
                </button>
              </div>

              {/* Scheduled date + time */}
              {tx.scheduledDate && (
                <div className="mx-4 mb-3 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-sm dark:bg-amber-900/20 dark:border-amber-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">预约配送</span>
                    <span className="ml-auto font-semibold text-amber-800 dark:text-amber-300">
                      {new Date(tx.scheduledDate + "T00:00:00").toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </div>
                  {tx.scheduledTime && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">配送时间</span>
                      <span className="ml-auto font-semibold text-amber-800 dark:text-amber-300">{tx.scheduledTime}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Contact */}
              {(customer.phone || customer.wechatNumber) && (
                <div className="mx-4 mb-3 space-y-1 rounded-md bg-muted/50 px-3 py-2 text-sm">
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <PhoneIcon className="size-3.5 shrink-0" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  {customer.wechatNumber && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageCircleIcon className="size-3.5 shrink-0" />
                      <span>{customer.wechatNumber}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Delivery / pickup */}
              {tx.deliveryType && (
                <div className="mx-4 mb-3 flex items-start gap-2 rounded-md border px-3 py-2 text-sm">
                  {tx.deliveryType === "delivery"
                    ? <TruckIcon className="mt-0.5 size-3.5 shrink-0 text-blue-600" />
                    : <MapPinIcon className="mt-0.5 size-3.5 shrink-0 text-purple-600" />
                  }
                  <div>
                    <span className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${deliveryBadge[tx.deliveryType] ?? ""}`}>
                      {tx.deliveryType}
                    </span>
                    {tx.deliveryType === "delivery" && tx.deliveryAddress && (
                      <p className="mt-1 text-muted-foreground">{tx.deliveryAddress}</p>
                    )}
                    {tx.deliveryType === "pickup" && tx.pickupLocation && (
                      <p className="mt-1 text-muted-foreground">
                        {tx.pickupLocation.name}
                        {tx.pickupLocation.address && (
                          <span className="block text-xs">{tx.pickupLocation.address}</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="mx-4 space-y-1.5 border-t pt-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="text-card-foreground">
                      <span className="mr-1.5 font-medium">{item.quantity}×</span>
                      {item.product?.name ?? "—"}
                    </span>
                    <span className="shrink-0 text-muted-foreground">
                      ${(item.quantity * Number(item.priceAud)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mx-4 mt-2 flex justify-between border-t pt-2 text-sm font-semibold">
                <span>Total</span>
                <span>${Number(tx.totalAud ?? 0).toFixed(2)}</span>
              </div>

              {/* Note */}
              {tx.note && (
                <div className="mx-4 mt-3 rounded-md border-l-2 border-primary/40 bg-primary/5 px-3 py-2 text-sm text-muted-foreground">
                  {tx.note}
                </div>
              )}

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between px-4 py-3 pt-3 text-xs text-muted-foreground">
                <span className={`rounded-full px-2 py-0.5 font-medium ${paymentBadge[tx.status] ?? ""}`}>
                  {tx.status ?? "—"}
                </span>
                <span className="font-mono">txn {tx.id?.slice(0, 8)}…</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
