export function Progress({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, value))

  return (
    <div className="h-2 rounded-full bg-slate-100">
      <div className="h-2 rounded-full bg-blue-600" style={{ width: `${safeValue}%` }} />
    </div>
  )
}
