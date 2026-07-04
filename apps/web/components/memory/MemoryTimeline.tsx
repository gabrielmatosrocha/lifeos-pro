import { Clock3 } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { MemoryTimelineEvent } from '@/features/memory/types/memory.types'

export default function MemoryTimeline({ events }: { events: MemoryTimelineEvent[] }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-cyan-100/80">Timeline de memória</p>
          <h2 className="mt-1 text-xl font-bold text-white">O que o LifeOS aprendeu</h2>
        </div>
        <Clock3 className="h-5 w-5 text-cyan-100" />
      </div>

      <div className="mt-5 space-y-3">
        {events.map((event) => (
          <div key={event.id} className="grid gap-3 rounded-[22px] border border-white/[0.13] bg-white/[0.055] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] sm:grid-cols-[120px_1fr] sm:p-4">
            <div>
              <p className="text-sm font-semibold text-white">{event.date}</p>
              <p className="mt-1 text-xs text-cyan-100/60">{event.source}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{event.title}</p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
