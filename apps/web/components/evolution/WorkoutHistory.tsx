import Card from '@/components/ui/Card'
import type { GymCheckInRecord } from '@/features/evolution/types/evolution.types'

export default function WorkoutHistory({ checkIns }: { checkIns: GymCheckInRecord[] }) {
  return (
    <Card>
      <h2 className="text-xl font-bold text-white">Histórico de Treinos</h2>
      <div className="mt-5 space-y-3">
        {checkIns.map((checkIn) => (
          <div key={checkIn.id} className="flex items-start justify-between gap-4 rounded-2xl border border-white/15 bg-white/[0.05] p-4">
            <div>
              <p className="font-semibold capitalize text-white">{checkIn.workout}</p>
              <p className="mt-1 text-sm text-zinc-400">{checkIn.notes}</p>
            </div>
            <span className="shrink-0 text-sm text-zinc-500">{checkIn.date}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
