import { MapPinned } from 'lucide-react'

export default function ActivityRouteMock({ description }: { description: string }) {
  return (
    <div className="relative min-h-64 overflow-hidden rounded-[28px] border border-white/[0.14] bg-[radial-gradient(circle_at_28%_22%,rgba(34,211,238,.24),transparent_28%),radial-gradient(circle_at_72%_72%,rgba(16,185,129,.18),transparent_32%),rgba(255,255,255,.045)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.10)]">
      <div className="absolute left-8 top-10 h-28 w-40 rotate-[-12deg] rounded-full border border-cyan-200/35" />
      <div className="absolute bottom-10 right-8 h-24 w-36 rotate-[18deg] rounded-full border border-emerald-200/35" />
      <div className="absolute left-1/2 top-12 h-36 w-px -rotate-45 bg-gradient-to-b from-cyan-200/60 via-emerald-200/35 to-transparent" />
      <div className="absolute left-[28%] top-[38%] h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_24px_rgba(34,211,238,.8)]" />
      <div className="absolute bottom-[28%] right-[30%] h-3 w-3 rounded-full bg-emerald-200 shadow-[0_0_24px_rgba(16,185,129,.8)]" />

      <div className="relative z-10 flex h-full min-h-52 flex-col justify-between">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-zinc-950/50 px-3 py-1 text-xs text-zinc-200 backdrop-blur-xl">
          <MapPinned className="h-3.5 w-3.5 text-cyan-100" />
          Prévia de rota
        </div>
        <p className="max-w-sm text-sm leading-6 text-zinc-300">{description}</p>
      </div>
    </div>
  )
}
