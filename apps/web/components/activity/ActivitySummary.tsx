import { Activity, Clock3, Gauge, Map } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { ActivitySummary as ActivitySummaryType } from '@/features/activity/types/activity.types'

export default function ActivitySummary({ summary }: { summary: ActivitySummaryType }) {
  const stats = [
    { label: 'Treinos', value: summary.weeklyWorkouts, icon: Activity },
    { label: 'Distância', value: `${summary.totalDistanceKm} km`, icon: Map },
    { label: 'Tempo total', value: `${summary.totalMinutes} min`, icon: Clock3 },
    { label: 'Volume', value: summary.weeklyVolume, icon: Gauge },
  ]

  return (
    <Card className="p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
              <Icon className="h-4 w-4 text-cyan-100" />
              <p className="mt-3 text-xs text-zinc-500">{stat.label}</p>
              <p className="mt-1 text-xl font-bold text-white">{stat.value}</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
