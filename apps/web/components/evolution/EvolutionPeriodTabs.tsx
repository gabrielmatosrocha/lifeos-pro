import type { EvolutionPeriod } from '@/features/evolution/types/evolution.types'

type EvolutionPeriodTabsProps = {
  periods: EvolutionPeriod[]
  activeId: string
  onSelect: (id: string) => void
}

const rangeLabel: Record<EvolutionPeriod['range'], string> = {
  daily: 'Diária',
  weekly: 'Semanal',
  monthly: 'Mensal',
  yearly: 'Anual',
}

export default function EvolutionPeriodTabs({ periods, activeId, onSelect }: EvolutionPeriodTabsProps) {
  return (
    <section
      className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4"
      aria-label="Visões do histórico de evolução"
    >
      {periods.map((period) => {
        const isActive = activeId === period.id
        return (
          <button
            key={period.id}
            type="button"
            onClick={() => onSelect(period.id)}
            className={`group min-w-[188px] rounded-[22px] border p-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 sm:min-w-0 sm:rounded-[24px] sm:p-3.5 ${
              isActive
                ? 'border-cyan-300/40 bg-cyan-400/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_0_50px_rgba(34,211,238,.14)]'
                : 'border-white/[0.13] bg-white/[0.045] text-zinc-300 hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-white/[0.075]'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-zinc-400">{rangeLabel[period.range]}</p>
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] text-zinc-300">
                {period.label}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">{period.lifeScore}</p>
            <p className="mt-1 text-xs text-zinc-500">{period.comparison}</p>
          </button>
        )
      })}
    </section>
  )
}
