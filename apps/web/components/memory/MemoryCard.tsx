import { Brain, Database, ShieldCheck } from 'lucide-react'
import { Progress } from '@/components/ui/Progress'
import type { MemoryRecord } from '@/features/memory/types/memory.types'

const confidenceValue = {
  alta: 92,
  média: 68,
  baixa: 38,
}

export default function MemoryCard({ memory }: { memory: MemoryRecord }) {
  return (
    <article className="rounded-[24px] border border-white/[0.13] bg-white/[0.055] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-white/[0.08] sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/55">{memory.category}</p>
            <h3 className="mt-1 text-base font-bold text-white">{memory.title}</h3>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs text-zinc-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          {memory.confidence}
        </span>
      </div>

      <p className="mt-3 text-sm leading-5 text-zinc-400 sm:leading-6">{memory.description}</p>

      <div className="mt-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <Database className="h-3.5 w-3.5" />
            {memory.origin}
          </span>
          <span>{memory.updatedAt}</span>
        </div>
        <Progress value={confidenceValue[memory.confidence]} />
      </div>
    </article>
  )
}
