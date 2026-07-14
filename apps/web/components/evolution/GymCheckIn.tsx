import { Dumbbell } from 'lucide-react'
import Card from '@/components/ui/Card'
import PhotoUpload from './PhotoUpload'
import type { GymCheckInRecord } from '@/features/evolution/types/evolution.types'

export default function GymCheckIn({ checkIns }: { checkIns: GymCheckInRecord[] }) {
  const latest = checkIns[0]

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">Check-in Academia</p>
          <h2 className="mt-1 text-xl font-bold text-white">Registrar treino</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">Prévia preparada para data, horário, treino, observações e foto.</p>
        </div>
        <Dumbbell className="h-6 w-6 text-cyan-200" />
      </div>
      <div className="mt-5 rounded-2xl border border-white/15 bg-white/[0.05] p-4">
        <p className="text-sm text-zinc-400">{latest.date} · {latest.time}</p>
        <p className="mt-1 text-lg font-semibold capitalize text-white">{latest.workout}</p>
        <p className="mt-2 text-sm text-zinc-400">{latest.notes}</p>
        <div className="mt-4">
          <PhotoUpload label="Foto do treino" />
        </div>
      </div>
    </Card>
  )
}
