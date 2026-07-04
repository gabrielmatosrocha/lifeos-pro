import { Route } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { RunRecord } from '@/features/activity/types/activity.types'

export default function RunCard({ run }: { run: RunRecord }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/55">{run.kind}</p>
          <h3 className="mt-1 text-lg font-bold text-white">{run.distance_km} km</h3>
          <p className="mt-1 text-sm text-zinc-400">{run.duration_minutes} min • {run.pace}</p>
        </div>
        <Route className="h-5 w-5 text-emerald-100" />
      </div>
      <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-sm text-zinc-400">
        {run.route_preview ?? run.notes ?? 'Rota preparada para GPS futuro.'}
      </p>
    </Card>
  )
}
