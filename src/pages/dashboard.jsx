import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { api } from "@/lib/api"

const chartConfig = {
  revenue: {
    label: "Revenue (AUD)",
    color: "var(--chart-1)",
  },
}

function getWeekMeta(dateStr) {
  const d = new Date(dateStr)
  const day = d.getDay() || 7
  d.setDate(d.getDate() + 4 - day)
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  const mon = new Date(dateStr)
  mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7))
  return {
    sortKey: `${d.getFullYear()}-${String(week).padStart(2, "0")}`,
    label: mon.toLocaleDateString("en-AU", { day: "numeric", month: "short" }),
  }
}

function buildWeeklyData(orders, weeks = 12) {
  const now = new Date()
  const map = {}

  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const { sortKey, label } = getWeekMeta(d.toISOString())
    if (!map[sortKey]) map[sortKey] = { sortKey, label, revenue: 0 }
  }

  const cutoff = new Date(now)
  cutoff.setDate(cutoff.getDate() - weeks * 7)

  for (const order of orders) {
    if (order.status !== "paid") continue
    if (new Date(order.createdAt) < cutoff) continue
    const { sortKey, label } = getWeekMeta(order.createdAt)
    if (!map[sortKey]) map[sortKey] = { sortKey, label, revenue: 0 }
    map[sortKey].revenue += Number(order.totalAud)
  }

  return Object.values(map)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map((r) => ({ ...r, revenue: Math.round(r.revenue * 100) / 100 }))
}

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getOrders()
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const weeklyData = buildWeeklyData(orders)
  const totalRevenue = weeklyData.reduce((sum, w) => sum + w.revenue, 0)
  const paidOrders = orders.filter((o) => o.status === "paid").length

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-3xl">{loading ? "—" : orders.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paid Orders</CardDescription>
            <CardTitle className="text-3xl">{loading ? "—" : paidOrders}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription>Revenue (12 wks)</CardDescription>
            <CardTitle className="text-3xl">{loading ? "—" : `$${totalRevenue.toFixed(2)}`}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Revenue</CardTitle>
          <CardDescription>Paid orders · last 12 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-muted-foreground py-8 text-center">Loading…</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {!loading && !error && (
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart data={weeklyData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}`}
                  width={55}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
                    />
                  }
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
