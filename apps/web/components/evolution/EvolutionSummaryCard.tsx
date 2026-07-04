import { Activity, CheckCircle2, Flame, Footprints, HeartPulse, Trophy } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { EvolutionPeriod } from '@/features/evolution/types/evolution.types'

const icons = [HeartPulse, CheckCircle2, Trophy, Footprints, Activity, Flame]

export default function EvolutionSummaryCard({ period }: { period: EvolutionPeriod }) {
  const stats = [
    { label: 'Life Score', value: period.lifeScore, suffix: '/100' },
    { label: 'Hábitos', value: period.habitsCompleted, suffix: '' },
    { label: 'Treinos', value: period.workouts, suffix: '' },
    { label: 'Corridas e caminhadas', value: period.runs, suffix: '' },
    { label: 'Check-ins', value: period.checkIns, suffix: '' },
    { label: 'Streak', value: period.streak, suffix: ' dias' },
  ]

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-100/80">Histórico de Evolução</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">{period.label}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{period.summary}</p>
        </div>
        <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-100 shadow-[inset_0_1px_0_rgba(255,255,255,.10)]">
          {period.comparison}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2.5 md:grid-cols-3 md:gap-3 xl:grid-cols-6">
        {stats.map((stat, index) => {
          const Icon = icons[index]
          return (
            <div key={stat.label} className="rounded-[18px] border border-white/[0.13] bg-white/[0.055] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] sm:rounded-[20px] sm:p-3.5">
              <Icon className="h-[18px] w-[18px] text-cyan-200 sm:h-5 sm:w-5" />
              <p className="mt-2.5 text-[11px] leading-4 text-zinc-500">{stat.label}</p>
              <p className="mt-1 text-xl font-bold text-white sm:text-2xl">
                {stat.value}
                <span className="text-sm text-zinc-400">{stat.suffix}</span>
              </p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
