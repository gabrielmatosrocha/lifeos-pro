import { Activity, BookOpen, CalendarDays, Dumbbell, Flame, Heart, Map, Sparkles, Target, Trophy } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { DashboardWidget, DashboardWidgetKind } from '@/features/dashboard-widgets/types/dashboard-widget.types'

const iconByKind: Record<DashboardWidgetKind, typeof Sparkles> = {
  today: Sparkles,
  coach: Sparkles,
  'next-goal': Target,
  'pending-habits': CalendarDays,
  workout: Dumbbell,
  run: Map,
  'weekly-review': Activity,
  spiritual: Heart,
  journal: BookOpen,
  streak: Flame,
  achievement: Trophy,
  milestone: Target,
}

export default function DashboardWidgetGrid({ widgets }: { widgets: DashboardWidget[] }) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {widgets.map((widget) => {
        const Icon = iconByKind[widget.kind]

        return (
          <Card key={widget.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/55">{widget.title}</p>
                <h3 className="mt-2 text-xl font-bold text-white">{widget.value}</h3>
                <p className="mt-2 text-sm leading-5 text-zinc-400">{widget.description}</p>
              </div>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-cyan-100">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        )
      })}
    </section>
  )
}
