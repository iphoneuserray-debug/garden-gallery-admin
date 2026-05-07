export function DeleteConfirmModal({ title, description, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded border px-3 py-1.5 text-sm">取消</button>
          <button onClick={onConfirm} className="rounded bg-destructive px-3 py-1.5 text-sm text-destructive-foreground">删除</button>
        </div>
      </div>
    </div>
  )
}
