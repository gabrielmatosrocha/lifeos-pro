import { MapPinned, Play } from 'lucide-react'
import Card from '@/components/ui/Card'
import ActivityMap from './ActivityMap'
import type { ActivitySession } from '@/features/evolution/types/evolution.types'

export default function ActivityTracker({ session }: { session: ActivitySession }) {
  return (
    <Card>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-zinc-500">Modo Atividade</p>
          <h2 className="mt-1 text-xl font-bold text-white">Iniciar Corrida ou Caminhada</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Prévia visual preparada para GPS, percurso, tempo, distância, pace, velocidade, altitude, calorias e mapa.</p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100"><Play className="mr-1 inline h-3 w-3" />Prévia</span>
          <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs text-zinc-300"><MapPinned className="mr-1 inline h-3 w-3" />GPS ready</span>
        </div>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Distância', `${session.distanceKm} km`],
            ['Tempo', session.duration],
            ['Pace', session.pace],
            ['Calorias', `${session.calories} kcal`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
              <p className="text-xs text-zinc-500">{label}</p>
              <p className="mt-1 text-lg font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
        <ActivityMap description={session.mapPreview} />
      </div>
    </Card>
  )
}
