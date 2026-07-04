import { CalendarDays, CheckCircle2, Flag, Footprints, Repeat, Trophy } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { DreamRecord } from '@/features/dreams/types/dream.types'

const planSteps = [
  { key: 'annualGoal', label: 'Meta anual', icon: Trophy },
  { key: 'monthlyGoal', label: 'Meta mensal', icon: CalendarDays },
  { key: 'weeklyGoal', label: 'Meta semanal', icon: Flag },
  { key: 'dailyHabit', label: 'Hábito diário', icon: Repeat },
  { key: 'nextStep', label: 'Próximo passo', icon: Footprints },
] as const

export default function DreamPlanCard({ dream }: { dream: DreamRecord }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-cyan-100/80">Transformar sonho em plano</p>
          <h2 className="mt-1 text-xl font-bold text-white">{dream.title}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">Sonho → meta anual → meta mensal → meta semanal → hábito diário → próxima ação.</p>
        </div>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-500/10 text-emerald-100">
          <CheckCircle2 className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {planSteps.map((step, index) => {
          const Icon = step.icon

          return (
            <div key={step.key} className="grid gap-3 rounded-[22px] border border-white/[0.13] bg-white/[0.055] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] sm:grid-cols-[auto_1fr] sm:items-start">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/55">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{step.label}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-400">{dream.plan[step.key]}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
