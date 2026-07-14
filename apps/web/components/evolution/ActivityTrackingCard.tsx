import { Footprints, LocateFixed, Pause, Play, Square, Timer } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { selectFieldClassName, textareaFieldClassName } from '@/components/ui/fieldStyles'
import type { ActivityKind, ActivityRoutePoint } from '@/features/activity/types/activity.types'

type ActivityTrackingResult = {
  kind: ActivityKind
  distanceKm: number
  durationMinutes: number
  pace: string
  averageSpeedKmh: number
  calories: number
  startedAt: string
  endedAt: string
  routePoints: ActivityRoutePoint[]
  notes: string
}

type ActivityTrackingCardProps = {
  onFinish: (activity: ActivityTrackingResult) => Promise<void>
  isSaving?: boolean
}

const EARTH_RADIUS_KM = 6371
const MIN_POINT_DISTANCE_KM = 0.005

function toRadians(value: number) {
  return (value * Math.PI) / 180
}

function distanceBetween(a: ActivityRoutePoint, b: ActivityRoutePoint) {
  const latDistance = toRadians(b.latitude - a.latitude)
  const lonDistance = toRadians(b.longitude - a.longitude)
  const startLat = toRadians(a.latitude)
  const endLat = toRadians(b.latitude)
  const haversine = Math.sin(latDistance / 2) ** 2 + Math.cos(startLat) * Math.cos(endLat) * Math.sin(lonDistance / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

function formatElapsed(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return hours > 0
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function formatPace(distanceKm: number, elapsedSeconds: number) {
  if (distanceKm <= 0 || elapsedSeconds <= 0) {
    return '--/km'
  }

  const secondsPerKm = Math.round(elapsedSeconds / distanceKm)
  const minutes = Math.floor(secondsPerKm / 60)
  const seconds = secondsPerKm % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}/km`
}

function estimateCalories(kind: ActivityKind, distanceKm: number) {
  const caloriesPerKm = kind === 'corrida' ? 72 : 48
  return Math.round(distanceKm * caloriesPerKm)
}

function getTileUrl(point?: ActivityRoutePoint) {
  if (!point) {
    return null
  }

  const zoom = 15
  const latRad = toRadians(point.latitude)
  const tiles = 2 ** zoom
  const x = Math.floor(((point.longitude + 180) / 360) * tiles)
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * tiles)
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`
}

function routePath(points: ActivityRoutePoint[]) {
  if (points.length < 2) {
    return ''
  }

  const lats = points.map((point) => point.latitude)
  const lons = points.map((point) => point.longitude)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLon = Math.min(...lons)
  const maxLon = Math.max(...lons)
  const latRange = Math.max(maxLat - minLat, 0.0001)
  const lonRange = Math.max(maxLon - minLon, 0.0001)

  return points
    .map((point, index) => {
      const x = 14 + ((point.longitude - minLon) / lonRange) * 72
      const y = 86 - ((point.latitude - minLat) / latRange) * 72
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

export default function ActivityTrackingCard({ onFinish, isSaving = false }: ActivityTrackingCardProps) {
  const [kind, setKind] = useState<ActivityKind>('corrida')
  const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle')
  const [startedAt, setStartedAt] = useState<string | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [distanceKm, setDistanceKm] = useState(0)
  const [routePoints, setRoutePoints] = useState<ActivityRoutePoint[]>([])
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('Pronto para iniciar uma corrida ou caminhada com GPS.')
  const watchIdRef = useRef<number | null>(null)
  const lastPointRef = useRef<ActivityRoutePoint | null>(null)
  const intervalRef = useRef<number | null>(null)

  const averageSpeedKmh = elapsedSeconds > 0 ? Number((distanceKm / (elapsedSeconds / 3600)).toFixed(2)) : 0
  const pace = formatPace(distanceKm, elapsedSeconds)
  const calories = estimateCalories(kind, distanceKm)
  const tileUrl = getTileUrl(routePoints[0])
  const path = routePath(routePoints)

  const stats = useMemo(
    () => [
      ['Tempo', formatElapsed(elapsedSeconds)],
      ['Distância', `${distanceKm.toFixed(2)} km`],
      ['Pace', pace],
      ['Velocidade', `${averageSpeedKmh.toFixed(1)} km/h`],
    ],
    [averageSpeedKmh, distanceKm, elapsedSeconds, pace],
  )

  useEffect(() => {
    if (status !== 'running') {
      return
    }

    intervalRef.current = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1)
    }, 1000)

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [status])

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  function clearWatch() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }

  function handlePosition(position: GeolocationPosition) {
    const nextPoint: ActivityRoutePoint = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    }

    setRoutePoints((current) => {
      const previous = lastPointRef.current
      if (previous) {
        const nextDistance = distanceBetween(previous, nextPoint)
        if (nextDistance >= MIN_POINT_DISTANCE_KM) {
          setDistanceKm((value) => Number((value + nextDistance).toFixed(3)))
        }
      }

      lastPointRef.current = nextPoint
      return [...current, nextPoint]
    })
    setMessage('GPS ativo. Registrando seu percurso com segurança.')
  }

  function handlePositionError(error: GeolocationPositionError) {
    const friendlyMessage: Record<number, string> = {
      1: 'Permissão de localização negada. Ative o GPS para iniciar a atividade.',
      2: 'GPS indisponível no momento. Tente novamente em uma área aberta.',
      3: 'O GPS demorou para responder. Tente iniciar novamente.',
    }
    setMessage(friendlyMessage[error.code] ?? 'Não foi possível acessar sua localização agora.')
    setStatus('idle')
    clearWatch()
  }

  function startWatch() {
    if (!('geolocation' in navigator)) {
      setMessage('Este navegador não oferece suporte à Geolocation API.')
      return
    }

    clearWatch()
    watchIdRef.current = navigator.geolocation.watchPosition(handlePosition, handlePositionError, {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 12000,
    })
  }

  function handleStart() {
    setStartedAt(new Date().toISOString())
    setElapsedSeconds(0)
    setDistanceKm(0)
    setRoutePoints([])
    lastPointRef.current = null
    setStatus('running')
    setMessage('Solicitando permissão de localização...')
    startWatch()
  }

  function handlePause() {
    setStatus('paused')
    clearWatch()
    setMessage('Atividade pausada. Continue quando estiver pronto.')
  }

  function handleResume() {
    setStatus('running')
    setMessage('Retomando sinal de GPS...')
    startWatch()
  }

  async function handleFinish() {
    if (!startedAt) {
      return
    }

    clearWatch()
    setStatus('idle')
    const endedAt = new Date().toISOString()
    await onFinish({
      kind,
      distanceKm: Number(distanceKm.toFixed(2)),
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      pace,
      averageSpeedKmh,
      calories,
      startedAt,
      endedAt,
      routePoints,
      notes,
    })
    setMessage('Atividade salva no histórico.')
    setStartedAt(null)
    setElapsedSeconds(0)
    setDistanceKm(0)
    setRoutePoints([])
    setNotes('')
    lastPointRef.current = null
  }

  return (
    <Card className="overflow-visible">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-100/80">Activity Tracking V1</p>
          <h2 className="mt-1 text-xl font-bold text-white">Rastreador de atividade</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{message}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={kind} onChange={(event) => setKind(event.target.value as ActivityKind)} className={`${selectFieldClassName} min-h-10 w-auto py-2 text-sm`} disabled={status !== 'idle'} aria-label="Tipo de atividade rastreada">
            <option value="corrida" className="bg-zinc-900">Corrida</option>
            <option value="caminhada" className="bg-zinc-900">Caminhada</option>
          </select>
          {status === 'idle' ? (
            <Button type="button" size="sm" onClick={handleStart} disabled={isSaving}>
              <Play className="h-4 w-4" />
              Iniciar atividade
            </Button>
          ) : null}
          {status === 'running' ? (
            <Button type="button" size="sm" variant="secondary" onClick={handlePause}>
              <Pause className="h-4 w-4" />
              Pausar
            </Button>
          ) : null}
          {status === 'paused' ? (
            <Button type="button" size="sm" onClick={handleResume}>
              <Play className="h-4 w-4" />
              Continuar
            </Button>
          ) : null}
          {status !== 'idle' ? (
            <Button type="button" size="sm" variant="danger" onClick={() => void handleFinish()} isLoading={isSaving}>
              <Square className="h-4 w-4" />
              Finalizar
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {stats.map(([label, value]) => (
              <div key={label} className="rounded-[22px] border border-white/[0.13] bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="mt-1 text-lg font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-[22px] border border-white/[0.13] bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Timer className="h-4 w-4 text-cyan-100" />
              <span>{routePoints.length} pontos de GPS registrados</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-zinc-300">
              <Footprints className="h-4 w-4 text-emerald-100" />
              <span>{calories} kcal estimadas</span>
            </div>
          </div>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className={textareaFieldClassName} rows={3} placeholder="Observações da atividade" aria-label="Observações da atividade rastreada" />
        </div>

        <div className="relative min-h-72 overflow-hidden rounded-[28px] border border-white/[0.14] bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,.10)]">
          {tileUrl ? (
            <div
              aria-label="Mapa OpenStreetMap do percurso"
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{ backgroundImage: `url(${tileUrl})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(34,211,238,.24),transparent_32%),radial-gradient(circle_at_72%_70%,rgba(16,185,129,.18),transparent_34%),rgba(255,255,255,.035)]" />
          )}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {path ? <path d={path} fill="none" stroke="rgb(103 232 249)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /> : null}
            {routePoints.length > 0 ? <circle cx="14" cy="86" r="2.5" fill="rgb(110 231 183)" /> : null}
            {routePoints.length > 1 ? <circle cx="86" cy="14" r="2.5" fill="rgb(34 211 238)" /> : null}
          </svg>
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-950/65 px-3 py-1 text-xs text-zinc-100 backdrop-blur-xl">
            <LocateFixed className="h-3.5 w-3.5 text-cyan-100" />
            OpenStreetMap
          </div>
        </div>
      </div>
    </Card>
  )
}
