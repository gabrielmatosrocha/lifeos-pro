import { Activity, CheckCircle2, Flame, HeartPulse, Trophy } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { EvolutionPeriod } from '@/features/evolution/types/evolution.types'

const icons = [HeartPulse, CheckCircle2, Activity, Trophy, Flame]

export default function EvolutionSummary({ period }: { period: EvolutionPeriod }) {
  const stats = [
    { label: 'Life Score', value: period.lifeScore, suffix: '/100' },
    { label: 'Hábitos', value: period.habitsCompleted, suffix: '' },
    { label: 'Treinos', value: period.workouts, suffix: '' },
    { label: 'Check-ins', value: period.checkIns, suffix: '' },
    { label: 'Streak', value: period.streak, suffix: ' dias' },
  ]

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-cyan-200">Histórico de Evolução</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">{period.label}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{period.summary}</p>
        </div>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-100">
          {period.comparison}
        </span>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map((stat, index) => {
          const Icon = icons[index]
          return (
            <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
              <Icon className="h-5 w-5 text-cyan-200" />
              <p className="mt-3 text-xs text-zinc-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-white">{stat.value}<span className="text-sm text-zinc-400">{stat.suffix}</span></p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
