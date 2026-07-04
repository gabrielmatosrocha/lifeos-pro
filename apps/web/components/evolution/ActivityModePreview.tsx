import { Footprints, Play, Timer } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { ActivitySession } from '@/features/evolution/types/evolution.types'
import ActivityRouteMock from './ActivityRouteMock'

export default function ActivityModePreview({ session }: { session: ActivitySession }) {
  const stats = [
    ['Distância', `${session.distanceKm} km`],
    ['Tempo', session.duration],
    ['Pace', session.pace],
    ['Velocidade', `${session.speedKmh} km/h`],
    ['Altitude', `${session.altitudeGainM ?? 0} m`],
    ['Calorias', `${session.calories} kcal`],
  ]

  return (
    <Card>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-100/80">Modo Atividade</p>
          <h2 className="mt-1 text-xl font-bold text-white">Corrida e caminhada estilo Strava</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Arquitetura visual preparada para Geolocation API, PWA, Android e iPhone. GPS real ainda não implementado.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm">
            <Play className="h-4 w-4" />
            Iniciar corrida
          </Button>
          <Button type="button" size="sm" variant="secondary">
            <Footprints className="h-4 w-4" />
            Iniciar caminhada
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-400/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.10)]">
            <div className="flex items-center gap-2 text-cyan-100">
              <Timer className="h-5 w-5" />
              <p className="text-sm font-semibold">Sessão mockada · {session.startedAt}</p>
            </div>
            <h3 className="mt-3 text-3xl font-bold text-white">{session.routeName}</h3>
            <p className="mt-2 text-sm text-zinc-300">Resumo de atividade pronto para receber percurso, tempo, distância, pace, velocidade, altitude e calorias.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map(([label, value]) => (
              <div key={label} className="rounded-[22px] border border-white/[0.13] bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="mt-1 text-lg font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <ActivityRouteMock description={session.mapPreview} />
      </div>
    </Card>
  )
}
