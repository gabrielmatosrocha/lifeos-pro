import type { EvolutionPeriod } from '@/features/evolution/types/evolution.types'

type Props = {
  periods: EvolutionPeriod[]
  activeId: string
  onSelect: (id: string) => void
}

export default function EvolutionTimeline({ periods, activeId, onSelect }: Props) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {periods.map((period) => {
        const isActive = activeId === period.id
        return (
          <button
            key={period.id}
            type="button"
            onClick={() => onSelect(period.id)}
            className={`rounded-3xl border p-4 text-left transition ${isActive ? 'border-cyan-300/40 bg-cyan-400/10 shadow-[0_0_50px_rgba(34,211,238,.14)]' : 'border-white/15 bg-white/[0.045] hover:border-cyan-300/25 hover:bg-white/[0.07]'}`}
          >
            <p className="text-sm text-zinc-400">{period.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{period.lifeScore}</p>
            <p className="mt-1 text-xs text-zinc-500">{period.comparison}</p>
          </button>
        )
      })}
    </section>
  )
}
