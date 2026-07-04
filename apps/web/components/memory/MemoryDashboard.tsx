import MemoryCard from '@/components/memory/MemoryCard'
import MemoryInsight from '@/components/memory/MemoryInsight'
import MemoryTimeline from '@/components/memory/MemoryTimeline'
import type { MemoryEngineMock } from '@/features/memory/types/memory.types'

export default function MemoryDashboard({ memory }: { memory: MemoryEngineMock }) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/55">Memory Engine V1</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Memória do LifeOS</h2>
        <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-zinc-400 sm:block">
          Uma primeira visão do contexto que o LifeOS poderá usar para personalizar planos, alertas e insights.
        </p>
      </div>

      <MemoryInsight insight={memory.insight} />

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {memory.memories.map((item) => (
          <MemoryCard key={item.id} memory={item} />
        ))}
      </div>

      <MemoryTimeline events={memory.timeline} />
    </section>
  )
}
