import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

export function Pagination({ page, totalPages, total, pageSize, onChange }) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between border-t pt-3 text-sm text-muted-foreground">
      <span>{total === 0 ? "无结果" : `第 ${from}–${to} 条，共 ${total} 条`}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="rounded p-1.5 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <span className="min-w-[80px] text-center">第 {page} / {totalPages || 1} 页</span>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded p-1.5 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}
