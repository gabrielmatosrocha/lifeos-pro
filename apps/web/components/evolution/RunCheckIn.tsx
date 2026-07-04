import { Footprints } from 'lucide-react'
import Card from '@/components/ui/Card'
import PhotoUpload from './PhotoUpload'
import type { RunCheckInRecord } from '@/features/evolution/types/evolution.types'

export default function RunCheckIn({ runs }: { runs: RunCheckInRecord[] }) {
  const latest = runs[0]

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">Check-in Corrida</p>
          <h2 className="mt-1 text-xl font-bold text-white">{latest.distanceKm} km · {latest.pace}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{latest.notes}</p>
        </div>
        <Footprints className="h-6 w-6 text-emerald-200" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
          <p className="text-xs text-zinc-500">Tempo</p>
          <p className="mt-1 text-xl font-bold">{latest.duration}</p>
        </div>
        <PhotoUpload label="Foto da corrida" />
      </div>
    </Card>
  )
}
