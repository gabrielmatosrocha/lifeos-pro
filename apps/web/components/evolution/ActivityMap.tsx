export default function ActivityMap({ description }: { description: string }) {
  return (
    <div className="relative min-h-48 overflow-hidden rounded-3xl border border-white/15 bg-[radial-gradient(circle_at_35%_30%,rgba(34,211,238,.22),transparent_28%),radial-gradient(circle_at_70%_70%,rgba(16,185,129,.18),transparent_32%),rgba(255,255,255,.04)] p-5">
      <div className="absolute left-8 top-10 h-24 w-36 rounded-full border border-cyan-200/30" />
      <div className="absolute bottom-8 right-8 h-20 w-28 rounded-full border border-emerald-200/30" />
      <div className="relative z-10 flex h-full min-h-36 items-end">
        <p className="max-w-sm text-sm leading-6 text-zinc-300">{description}</p>
      </div>
    </div>
  )
}
