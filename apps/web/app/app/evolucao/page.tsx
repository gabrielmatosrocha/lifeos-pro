"use client"

import { useEffect, useState } from 'react'
import AnalyticsDashboard from '@/components/evolution/AnalyticsDashboard'
import ActivityModePreview from '@/components/evolution/ActivityModePreview'
import ActivityTrackingCard from '@/components/evolution/ActivityTrackingCard'
import CoachDashboard from '@/components/evolution/CoachDashboard'
import DailyVerseCard from '@/components/evolution/DailyVerseCard'
import EvolutionComparisonCard from '@/components/evolution/EvolutionComparisonCard'
import EvolutionPeriodTabs from '@/components/evolution/EvolutionPeriodTabs'
import EvolutionSummaryCard from '@/components/evolution/EvolutionSummaryCard'
import GymCheckInCard from '@/components/evolution/GymCheckInCard'
import NotificationCenter from '@/components/evolution/NotificationCenter'
import RunCheckInCard from '@/components/evolution/RunCheckInCard'
import WorkoutHistoryCard from '@/components/evolution/WorkoutHistoryCard'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import FeedbackState from '@/components/ui/FeedbackState'
import { fieldClassName, insetSurfaceClassName, selectFieldClassName, textareaFieldClassName } from '@/components/ui/fieldStyles'
import { Progress } from '@/components/ui/Progress'
import { getActiveUserId } from '@/features/auth/services/auth.service'
import { createRun, createWorkout, deleteRun, deleteWorkout, getActivityEngineState, updateRun, updateWorkout } from '@/features/activity/services/activity.service'
import type { ActivityEngineState, ActivityKind, RunRecord, WorkoutRecord } from '@/features/activity/types/activity.types'
import { getDashboardSummary } from '@/features/dashboard/services/dashboard.service'
import { getEvolutionHistoryMock } from '@/features/evolution/services/evolution-history.service'
import { gymCheckInsRepository, runCheckInsRepository } from '@/features/persistence/repositories/domain.repositories'
import type { PersistedGymCheckIn, PersistedRunCheckIn } from '@/features/persistence/repositories/domain.repositories'
import type { DashboardSummary } from '@/features/dashboard/services/dashboard.service'
import type { EvolutionHistory } from '@/features/evolution/types/evolution.types'

type WorkoutDraftState = {
  title: string
  date: string
  muscleGroups: string
  duration: number
  volume: number
  notes: string
}

type RunDraftState = {
  kind: ActivityKind
  date: string
  distance: number
  duration: number
  pace: string
  notes: string
}

type GymCheckInDraftState = {
  date: string
  time: string
  workout: string
  notes: string
}

type RunCheckInDraftState = {
  date: string
  activityType: ActivityKind
  distance: number
  duration: string
  pace: string
  notes: string
}

type TrackedActivityResult = {
  kind: ActivityKind
  distanceKm: number
  durationMinutes: number
  pace: string
  averageSpeedKmh: number
  calories: number
  startedAt: string
  endedAt: string
  routePoints: Array<{
    latitude: number
    longitude: number
    accuracy?: number
    timestamp: number
  }>
  notes: string
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

const initialWorkoutDraft: WorkoutDraftState = {
  title: '',
  date: today(),
  muscleGroups: '',
  duration: 45,
  volume: 10,
  notes: '',
}

const initialRunDraft: RunDraftState = {
  kind: 'corrida',
  date: today(),
  distance: 3,
  duration: 25,
  pace: '6:30/km',
  notes: '',
}

const initialGymCheckInDraft: GymCheckInDraftState = {
  date: today(),
  time: '07:00',
  workout: '',
  notes: '',
}

const initialRunCheckInDraft: RunCheckInDraftState = {
  date: today(),
  activityType: 'corrida',
  distance: 3,
  duration: '25:00',
  pace: '6:30/km',
  notes: '',
}

export default function EvolucaoPage() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null)
  const [history, setHistory] = useState<EvolutionHistory | null>(null)
  const [activityState, setActivityState] = useState<ActivityEngineState | null>(null)
  const [gymCheckIns, setGymCheckIns] = useState<PersistedGymCheckIn[]>([])
  const [runCheckIns, setRunCheckIns] = useState<PersistedRunCheckIn[]>([])
  const [activePeriodId, setActivePeriodId] = useState('today')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [workoutDraft, setWorkoutDraft] = useState(initialWorkoutDraft)
  const [runDraft, setRunDraft] = useState(initialRunDraft)
  const [gymDraft, setGymDraft] = useState(initialGymCheckInDraft)
  const [runCheckInDraft, setRunCheckInDraft] = useState(initialRunCheckInDraft)
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null)
  const [editingRunId, setEditingRunId] = useState<string | null>(null)
  const [editingGymCheckInId, setEditingGymCheckInId] = useState<string | null>(null)
  const [editingRunCheckInId, setEditingRunCheckInId] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadEvolution() {
      setIsLoading(true)
      setError(null)
      try {
        const userId = await getActiveUserId()
        const [summary, evolutionHistory, activity, gymRecords, runRecords] = await Promise.all([
          getDashboardSummary(),
          getEvolutionHistoryMock(),
          getActivityEngineState(userId),
          gymCheckInsRepository.list({ userId }),
          runCheckInsRepository.list({ userId }),
        ])
        if (isMounted) {
          setDashboard(summary)
          setHistory(evolutionHistory)
          setActivityState(activity)
          setGymCheckIns(gymRecords.data)
          setRunCheckIns(runRecords.data)
        }
      } catch {
        if (isMounted) {
          setError('Não foi possível carregar sua evolução agora.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadEvolution()

    return () => {
      isMounted = false
    }
  }, [])

  async function refreshActivityData() {
    const userId = await getActiveUserId()
    const [activity, gymRecords, runRecords] = await Promise.all([
      getActivityEngineState(userId),
      gymCheckInsRepository.list({ userId }),
      runCheckInsRepository.list({ userId }),
    ])
    setActivityState(activity)
    setGymCheckIns(gymRecords.data)
    setRunCheckIns(runRecords.data)
  }

  async function handleTrackedActivityFinish(activity: TrackedActivityResult) {
    setIsSaving(true)
    setError(null)
    try {
      const userId = await getActiveUserId()
      const date = activity.endedAt.slice(0, 10)
      const routePreview = activity.routePoints.length > 1
        ? `${activity.routePoints.length} pontos GPS registrados`
        : 'Atividade registrada sem rota completa'

      await createRun({
        user_id: userId,
        kind: activity.kind,
        date,
        distance_km: activity.distanceKm,
        duration_minutes: activity.durationMinutes,
        pace: activity.pace,
        status: 'completed',
        notes: activity.notes.trim(),
        route_preview: routePreview,
        route_points: activity.routePoints,
        started_at: activity.startedAt,
        ended_at: activity.endedAt,
        average_speed_kmh: activity.averageSpeedKmh,
        calories: activity.calories,
      })

      await refreshActivityData()
    } catch {
      setError('Não foi possível salvar a atividade rastreada agora.')
    } finally {
      setIsSaving(false)
    }
  }

  function startEditingWorkout(workout: WorkoutRecord) {
    setEditingWorkoutId(workout.id)
    setWorkoutDraft({
      title: workout.title,
      date: workout.date,
      muscleGroups: workout.muscle_groups.join(', '),
      duration: workout.duration_minutes,
      volume: workout.volume,
      notes: workout.notes ?? '',
    })
  }

  function startEditingRun(run: RunRecord) {
    setEditingRunId(run.id)
    setRunDraft({
      kind: run.kind,
      date: run.date,
      distance: run.distance_km,
      duration: run.duration_minutes,
      pace: run.pace,
      notes: run.notes ?? '',
    })
  }

  function startEditingGymCheckIn(checkIn: PersistedGymCheckIn) {
    setEditingGymCheckInId(checkIn.id)
    setGymDraft({
      date: checkIn.date,
      time: checkIn.time,
      workout: checkIn.workout,
      notes: checkIn.notes ?? '',
    })
  }

  function startEditingRunCheckIn(checkIn: PersistedRunCheckIn) {
    setEditingRunCheckInId(checkIn.id)
    setRunCheckInDraft({
      date: checkIn.date,
      activityType: checkIn.activity_type,
      distance: checkIn.distance_km,
      duration: checkIn.duration,
      pace: checkIn.pace,
      notes: checkIn.notes ?? '',
    })
  }

  function resetActivityForms() {
    setWorkoutDraft(initialWorkoutDraft)
    setRunDraft(initialRunDraft)
    setGymDraft(initialGymCheckInDraft)
    setRunCheckInDraft(initialRunCheckInDraft)
    setEditingWorkoutId(null)
    setEditingRunId(null)
    setEditingGymCheckInId(null)
    setEditingRunCheckInId(null)
  }

  async function handleWorkoutSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!workoutDraft.title.trim()) {
      setError('Dê um nome para o treino antes de salvar.')
      return
    }

    setIsSaving(true)
    setError(null)
    try {
      const userId = await getActiveUserId()
      const payload = {
        user_id: userId,
        title: workoutDraft.title.trim(),
        date: workoutDraft.date,
        muscle_groups: workoutDraft.muscleGroups.split(',').map((item) => item.trim()).filter(Boolean),
        exercises: [],
        duration_minutes: Math.max(1, workoutDraft.duration),
        volume: Math.max(0, workoutDraft.volume),
        status: 'planned' as const,
        notes: workoutDraft.notes.trim(),
      }

      if (editingWorkoutId) {
        await updateWorkout(editingWorkoutId, payload)
      } else {
        await createWorkout(payload)
      }

      await refreshActivityData()
      resetActivityForms()
    } catch {
      setError('Não foi possível salvar o treino agora.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleRunSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    setError(null)
    try {
      const userId = await getActiveUserId()
      const payload = {
        user_id: userId,
        kind: runDraft.kind,
        date: runDraft.date,
        distance_km: Math.max(0, runDraft.distance),
        duration_minutes: Math.max(1, runDraft.duration),
        pace: runDraft.pace,
        status: 'planned' as const,
        notes: runDraft.notes.trim(),
      }

      if (editingRunId) {
        await updateRun(editingRunId, payload)
      } else {
        await createRun(payload)
      }

      await refreshActivityData()
      resetActivityForms()
    } catch {
      setError('Não foi possível salvar a corrida agora.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleGymCheckInSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!gymDraft.workout.trim()) {
      setError('Informe o treino do check-in.')
      return
    }

    setIsSaving(true)
    setError(null)
    try {
      const userId = await getActiveUserId()
      const payload = {
        user_id: userId,
        date: gymDraft.date,
        time: gymDraft.time,
        workout: gymDraft.workout.trim(),
        notes: gymDraft.notes.trim(),
      }

      if (editingGymCheckInId) {
        await gymCheckInsRepository.update(editingGymCheckInId, payload)
      } else {
        await gymCheckInsRepository.create(payload)
      }

      await refreshActivityData()
      resetActivityForms()
    } catch {
      setError('Não foi possível salvar o check-in de academia agora.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleRunCheckInSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    setError(null)
    try {
      const userId = await getActiveUserId()
      const payload = {
        user_id: userId,
        date: runCheckInDraft.date,
        activity_type: runCheckInDraft.activityType,
        distance_km: Math.max(0, runCheckInDraft.distance),
        duration: runCheckInDraft.duration,
        pace: runCheckInDraft.pace,
        notes: runCheckInDraft.notes.trim(),
      }

      if (editingRunCheckInId) {
        await runCheckInsRepository.update(editingRunCheckInId, payload)
      } else {
        await runCheckInsRepository.create(payload)
      }

      await refreshActivityData()
      resetActivityForms()
    } catch {
      setError('Não foi possível salvar o check-in de corrida agora.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleCompleteWorkout(workoutId: string) {
    setError(null)
    try {
      await updateWorkout(workoutId, { status: 'completed' })
      await refreshActivityData()
    } catch {
      setError('Não foi possível concluir o treino agora.')
    }
  }

  async function handleDeleteWorkout(workoutId: string) {
    setError(null)
    try {
      await deleteWorkout(workoutId)
      await refreshActivityData()
    } catch {
      setError('Não foi possível excluir o treino agora.')
    }
  }

  async function handleDeleteRun(runId: string) {
    setError(null)
    try {
      await deleteRun(runId)
      await refreshActivityData()
    } catch {
      setError('Não foi possível excluir a corrida agora.')
    }
  }

  async function handleDeleteGymCheckIn(checkInId: string) {
    setError(null)
    try {
      await gymCheckInsRepository.delete(checkInId)
      await refreshActivityData()
    } catch {
      setError('Não foi possível excluir o check-in de academia agora.')
    }
  }

  async function handleDeleteRunCheckIn(checkInId: string) {
    setError(null)
    try {
      await runCheckInsRepository.delete(checkInId)
      await refreshActivityData()
    } catch {
      setError('Não foi possível excluir o check-in de corrida agora.')
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl space-y-5 px-4 pb-40 pt-6 text-white sm:pb-48">
        <header>
          <p className="text-sm font-medium text-cyan-100/70">Sua jornada</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Evolução</h1>
        </header>
        <FeedbackState variant="loading" title="Carregando evolução" description="Lendo seus sinais mais recentes." />
      </main>
    )
  }

  if (error || !dashboard || !history) {
    return (
      <main className="mx-auto max-w-6xl space-y-5 px-4 pb-40 pt-6 text-white sm:pb-48">
        <header>
          <p className="text-sm font-medium text-cyan-100/70">Sua jornada</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Evolução</h1>
        </header>
        <FeedbackState variant="error" title="Não foi possível carregar" description={error ?? 'Tente novamente em alguns instantes.'} />
      </main>
    )
  }

  const { summary, actions, goals, journalEntries } = dashboard
  const activePeriod = history.periods.find((period) => period.id === activePeriodId) ?? history.periods[0]

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 pb-44 pt-5 text-white sm:space-y-6 sm:pb-48 sm:pt-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-100/70">Sua jornada</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Evolução</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-5 text-zinc-400 sm:mt-2 sm:leading-6">Tendências, treinos, corridas, check-ins e inteligência pessoal em um só lugar.</p>
          <p className="mt-1.5 hidden text-sm font-medium text-white/85 sm:block">Você está evoluindo, mesmo quando o progresso parece silencioso.</p>
        </div>
        <span className="w-fit rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,.10)]">Prévia · Supabase ready</span>
      </header>

      <EvolutionPeriodTabs periods={history.periods} activeId={activePeriod.id} onSelect={setActivePeriodId} />

      <div className="pt-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/55">Panorama</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Histórico e comparações</h2>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <EvolutionSummaryCard period={activePeriod} />
        <EvolutionComparisonCard comparisons={history.comparisons} />
      </section>

      <div className="pt-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/55">Sinais vitais</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Ritmo e pilares</h2>
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <p className="text-sm text-zinc-400">Ritmo geral</p>
          <p className="mt-2 text-5xl font-bold">{summary.rhythmIndex}</p>
          <p className="mt-2 text-zinc-400">{summary.insight}</p>
        </Card>

        <Card>
          <h2 className="text-xl font-bold">Pilares</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {Object.entries(summary.pillarScores).map(([pillar, value]) => (
              <div key={pillar}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{pillar}</span>
                  <span>{value}</span>
                </div>
                <Progress value={Number(value)} />
              </div>
            ))}
          </div>
        </Card>
      </section>

      <div className="pt-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/55">Registro físico</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Check-ins e atividade</h2>
      </div>

      {error ? <FeedbackState variant="error" title="Atenção" description={error} /> : null}

      <section>
        <ActivityTrackingCard onFinish={handleTrackedActivityFinish} isSaving={isSaving} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="text-xl font-bold">Treinos</h2>
          <form onSubmit={handleWorkoutSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
            <input value={workoutDraft.title} onChange={(event) => setWorkoutDraft((prev) => ({ ...prev, title: event.target.value }))} className={fieldClassName} placeholder="Peito e tríceps" aria-label="Nome do treino" />
            <input value={workoutDraft.muscleGroups} onChange={(event) => setWorkoutDraft((prev) => ({ ...prev, muscleGroups: event.target.value }))} className={fieldClassName} placeholder="peito, tríceps" aria-label="Grupos musculares" />
            <input type="date" value={workoutDraft.date} onChange={(event) => setWorkoutDraft((prev) => ({ ...prev, date: event.target.value }))} className={fieldClassName} aria-label="Data do treino" />
            <input type="number" min="1" value={workoutDraft.duration} onChange={(event) => setWorkoutDraft((prev) => ({ ...prev, duration: Number(event.target.value) }))} className={fieldClassName} aria-label="Duração em minutos" />
            <input type="number" min="0" value={workoutDraft.volume} onChange={(event) => setWorkoutDraft((prev) => ({ ...prev, volume: Number(event.target.value) }))} className={fieldClassName} aria-label="Volume do treino" />
            <Button type="submit" isLoading={isSaving}>{editingWorkoutId ? 'Salvar treino' : 'Criar treino'}</Button>
            <textarea value={workoutDraft.notes} onChange={(event) => setWorkoutDraft((prev) => ({ ...prev, notes: event.target.value }))} className={`${textareaFieldClassName} md:col-span-2`} rows={3} placeholder="Observações" aria-label="Observações do treino" />
            {editingWorkoutId ? <Button type="button" variant="ghost" onClick={resetActivityForms}>Cancelar edição</Button> : null}
          </form>

          <div className="mt-5 space-y-3">
            {(activityState?.workouts ?? []).map((workout) => (
              <div key={workout.id} className={insetSurfaceClassName}>
                <p className="font-semibold">{workout.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{workout.date} • {workout.duration_minutes} min • {workout.status}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="secondary" onClick={() => void handleCompleteWorkout(workout.id)} disabled={workout.status === 'completed'}>Concluir</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => startEditingWorkout(workout)}>Editar</Button>
                  <Button type="button" size="sm" variant="danger" onClick={() => void handleDeleteWorkout(workout.id)}>Excluir</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold">Corridas e caminhadas</h2>
          <form onSubmit={handleRunSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
            <select value={runDraft.kind} onChange={(event) => setRunDraft((prev) => ({ ...prev, kind: event.target.value as ActivityKind }))} className={selectFieldClassName} aria-label="Tipo de atividade">
              <option value="corrida" className="bg-zinc-900">Corrida</option>
              <option value="caminhada" className="bg-zinc-900">Caminhada</option>
            </select>
            <input type="date" value={runDraft.date} onChange={(event) => setRunDraft((prev) => ({ ...prev, date: event.target.value }))} className={fieldClassName} aria-label="Data da corrida" />
            <input type="number" min="0" step="0.1" value={runDraft.distance} onChange={(event) => setRunDraft((prev) => ({ ...prev, distance: Number(event.target.value) }))} className={fieldClassName} aria-label="Distância em quilômetros" />
            <input type="number" min="1" value={runDraft.duration} onChange={(event) => setRunDraft((prev) => ({ ...prev, duration: Number(event.target.value) }))} className={fieldClassName} aria-label="Duração em minutos" />
            <input value={runDraft.pace} onChange={(event) => setRunDraft((prev) => ({ ...prev, pace: event.target.value }))} className={fieldClassName} placeholder="6:30/km" aria-label="Pace" />
            <Button type="submit" isLoading={isSaving}>{editingRunId ? 'Salvar corrida' : 'Criar corrida'}</Button>
            <textarea value={runDraft.notes} onChange={(event) => setRunDraft((prev) => ({ ...prev, notes: event.target.value }))} className={`${textareaFieldClassName} md:col-span-2`} rows={3} placeholder="Observações" aria-label="Observações da corrida" />
            {editingRunId ? <Button type="button" variant="ghost" onClick={resetActivityForms}>Cancelar edição</Button> : null}
          </form>

          <div className="mt-5 space-y-3">
            {(activityState?.runs ?? []).map((run) => (
              <div key={run.id} className={insetSurfaceClassName}>
                <p className="font-semibold">{run.kind} • {run.distance_km} km</p>
                <p className="mt-1 text-sm text-zinc-400">{run.date} • {run.duration_minutes} min • {run.pace}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => startEditingRun(run)}>Editar</Button>
                  <Button type="button" size="sm" variant="danger" onClick={() => void handleDeleteRun(run.id)}>Excluir</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="text-xl font-bold">Check-in academia</h2>
          <form onSubmit={handleGymCheckInSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
            <input type="date" value={gymDraft.date} onChange={(event) => setGymDraft((prev) => ({ ...prev, date: event.target.value }))} className={fieldClassName} aria-label="Data do check-in" />
            <input type="time" value={gymDraft.time} onChange={(event) => setGymDraft((prev) => ({ ...prev, time: event.target.value }))} className={fieldClassName} aria-label="Horário do check-in" />
            <input value={gymDraft.workout} onChange={(event) => setGymDraft((prev) => ({ ...prev, workout: event.target.value }))} className={fieldClassName} placeholder="Costas e bíceps" aria-label="Treino realizado" />
            <Button type="submit" isLoading={isSaving}>{editingGymCheckInId ? 'Salvar check-in' : 'Criar check-in'}</Button>
            <textarea value={gymDraft.notes} onChange={(event) => setGymDraft((prev) => ({ ...prev, notes: event.target.value }))} className={`${textareaFieldClassName} md:col-span-2`} rows={3} placeholder="Observações" aria-label="Observações do check-in" />
            {editingGymCheckInId ? <Button type="button" variant="ghost" onClick={resetActivityForms}>Cancelar edição</Button> : null}
          </form>
          <div className="mt-5 space-y-3">
            {gymCheckIns.map((checkIn) => (
              <div key={checkIn.id} className={insetSurfaceClassName}>
                <p className="font-semibold">{checkIn.workout}</p>
                <p className="mt-1 text-sm text-zinc-400">{checkIn.date} • {checkIn.time}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => startEditingGymCheckIn(checkIn)}>Editar</Button>
                  <Button type="button" size="sm" variant="danger" onClick={() => void handleDeleteGymCheckIn(checkIn.id)}>Excluir</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold">Check-in corrida</h2>
          <form onSubmit={handleRunCheckInSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
            <select value={runCheckInDraft.activityType} onChange={(event) => setRunCheckInDraft((prev) => ({ ...prev, activityType: event.target.value as ActivityKind }))} className={selectFieldClassName} aria-label="Tipo do check-in">
              <option value="corrida" className="bg-zinc-900">Corrida</option>
              <option value="caminhada" className="bg-zinc-900">Caminhada</option>
            </select>
            <input type="date" value={runCheckInDraft.date} onChange={(event) => setRunCheckInDraft((prev) => ({ ...prev, date: event.target.value }))} className={fieldClassName} aria-label="Data do check-in de corrida" />
            <input type="number" min="0" step="0.1" value={runCheckInDraft.distance} onChange={(event) => setRunCheckInDraft((prev) => ({ ...prev, distance: Number(event.target.value) }))} className={fieldClassName} aria-label="Distância do check-in" />
            <input value={runCheckInDraft.duration} onChange={(event) => setRunCheckInDraft((prev) => ({ ...prev, duration: event.target.value }))} className={fieldClassName} placeholder="25:00" aria-label="Tempo do check-in" />
            <input value={runCheckInDraft.pace} onChange={(event) => setRunCheckInDraft((prev) => ({ ...prev, pace: event.target.value }))} className={fieldClassName} placeholder="6:30/km" aria-label="Pace do check-in" />
            <Button type="submit" isLoading={isSaving}>{editingRunCheckInId ? 'Salvar check-in' : 'Criar check-in'}</Button>
            <textarea value={runCheckInDraft.notes} onChange={(event) => setRunCheckInDraft((prev) => ({ ...prev, notes: event.target.value }))} className={`${textareaFieldClassName} md:col-span-2`} rows={3} placeholder="Observações" aria-label="Observações do check-in de corrida" />
            {editingRunCheckInId ? <Button type="button" variant="ghost" onClick={resetActivityForms}>Cancelar edição</Button> : null}
          </form>
          <div className="mt-5 space-y-3">
            {runCheckIns.map((checkIn) => (
              <div key={checkIn.id} className={insetSurfaceClassName}>
                <p className="font-semibold">{checkIn.activity_type} • {checkIn.distance_km} km</p>
                <p className="mt-1 text-sm text-zinc-400">{checkIn.date} • {checkIn.duration} • {checkIn.pace}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => startEditingRunCheckIn(checkIn)}>Editar</Button>
                  <Button type="button" size="sm" variant="danger" onClick={() => void handleDeleteRunCheckIn(checkIn.id)}>Excluir</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <GymCheckInCard checkIns={history.gymCheckIns} />
        <RunCheckInCard runs={history.runCheckIns} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <WorkoutHistoryCard gymCheckIns={history.gymCheckIns} runs={history.runCheckIns} />
        <ActivityModePreview session={history.activitySession} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <CoachDashboard insights={history.coachInsights} />
        <NotificationCenter reminders={history.reminders} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <DailyVerseCard verse={history.dailyVerse} />
        <AnalyticsDashboard insights={history.analytics} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <h2 className="text-xl font-bold">Metas ativas</h2>
          <div className="mt-4 space-y-3">
            {goals.length === 0 ? (
              <FeedbackState variant="empty" title="Nenhuma meta registrada" description="Crie metas para conectar direção e execução." />
            ) : (
              goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className={insetSurfaceClassName}>
                  <p className="font-semibold">{goal.title}</p>
                  <p className="text-sm text-slate-500">{goal.pillar} • {goal.current_value}/{goal.target_value}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold">Reflexões recentes</h2>
          <div className="mt-4 space-y-3">
            {journalEntries.length === 0 ? (
              <FeedbackState variant="empty" title="Nenhuma reflexão registrada" description="O diário alimenta a inteligência do LifeOS." />
            ) : (
              journalEntries.slice(0, 3).map((entry) => (
                <div key={entry.id} className={insetSurfaceClassName}>
                  <p className="font-semibold">{entry.title}</p>
                  <p className="text-sm text-slate-500">{entry.entry_date} • {entry.mood}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold">Timeline</h2>
          <div className="mt-4 space-y-3">
            {actions.length === 0 ? (
              <FeedbackState variant="empty" title="Nenhuma ação no período" description="Registre ações no Hoje para formar sua timeline." />
            ) : (
              actions.slice(0, 4).map((action) => (
                <div key={action.id} className={insetSurfaceClassName}>
                  <p className="font-semibold">{action.title}</p>
                  <p className="text-sm text-slate-500">{action.pillar} • {action.status === 'completed' ? 'Concluída' : 'Pendente'}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </main>
  )
}
