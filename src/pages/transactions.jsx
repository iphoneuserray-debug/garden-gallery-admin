import { useEffect, useState } from "react"
import { TransactionsTable } from "@/components/TransactionsTable"
import { api } from "@/lib/api"

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getTransactions()
      .then(setTransactions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusUpdate = async (id, status) => {
    const original = transactions.find((t) => t.id === id)
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
    try {
      const updated = await api.updateTransactionStatus(id, status)
      setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, status: updated?.status ?? status } : t)))
    } catch (e) {
      setTransactions((prev) => prev.map((t) => (t.id === id ? original : t)))
      alert(`Failed to update transaction status: ${e.message}`)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">交易</h1>
      {loading && <p className="text-sm text-muted-foreground">加载中…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!loading && !error && (
        <TransactionsTable transactions={transactions} onStatusUpdate={handleStatusUpdate} />
      )}
    </div>
  )
}
