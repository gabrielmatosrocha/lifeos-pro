import { CalendarDays } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { GymCheckInRecord, RunCheckInRecord } from '@/features/evolution/types/evolution.types'

type TimelineItem = {
  id: string
  date: string
  title: string
  description: string
  tone: 'gym' | 'run'
}

export default function WorkoutHistoryCard({
  gymCheckIns,
  runs,
}: {
  gymCheckIns: GymCheckInRecord[]
  runs: RunCheckInRecord[]
}) {
  const items: TimelineItem[] = [
    ...gymCheckIns.map((checkIn) => ({
      id: checkIn.id,
      date: checkIn.date,
      title: checkIn.workout,
      description: checkIn.notes,
      tone: 'gym' as const,
    })),
    ...runs.map((run) => ({
      id: run.id,
      date: run.date,
      title: `${run.activityType} ${run.distanceKm} km`,
      description: `${run.duration} · ${run.pace} · ${run.notes}`,
      tone: 'run' as const,
    })),
  ]

  return (
    <Card>
      <div className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-cyan-100" />
        <h2 className="text-xl font-bold text-white">Histórico de Treinos</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-400">Linha do tempo física com treinos, corridas e caminhadas recentes.</p>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-4 rounded-[22px] border border-white/[0.13] bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
            <div className={`mt-1 h-3 w-3 rounded-full ${item.tone === 'gym' ? 'bg-cyan-300' : 'bg-emerald-300'} shadow-[0_0_22px_rgba(34,211,238,.28)]`} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold capitalize text-white">{item.title}</p>
                <span className="text-sm text-zinc-500">{item.date}</span>
              </div>
              <p className="mt-1 text-sm leading-5 text-zinc-400">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
