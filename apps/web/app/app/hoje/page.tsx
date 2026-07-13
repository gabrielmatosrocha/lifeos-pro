"use client"

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, CheckCircle2, Droplets, GraduationCap, Heart, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DailyAdvice from '@/components/coach/DailyAdvice'
import DailyFlow from '@/components/dashboard/DailyFlow'
import HeroScore from '@/components/dashboard/HeroScore'
import MiniStat from '@/components/ui/MiniStat'
import Button from '@/components/ui/Button'
import FeedbackState from '@/components/ui/FeedbackState'
import { fieldClassName, insetSurfaceClassName, panelSurfaceClassName, selectFieldClassName } from '@/components/ui/fieldStyles'
import { createDailyAction, loadDailyActions, persistDailyActions, syncDailyActions } from '@/features/actions/services/action.service'
import {
  createDailyActionRecord,
  deleteDailyAction,
  listDailyActionsByDate,
  updateDailyActionStatus,
} from '@/features/actions/services/daily-actions.service'
import { getActiveUserId } from '@/features/auth/services/auth.service'
import type { LifeAction, Pillar } from '@/features/actions/types/action.types'
import type { ActivityEngineState } from '@/features/activity/types/activity.types'
import { getActivityEngineState } from '@/features/activity/services/activity.service'
import type { CoachAdvice } from '@/features/coach/types/coach.types'
import { getDailyCoachAdvice } from '@/features/coach/services/coach.service'
import { getDashboardSummary } from '@/features/dashboard/services/dashboard.service'
import type { DreamEngineMock } from '@/features/dreams/types/dream.types'
import { getDreamEngineMock } from '@/features/dreams/services/dream.service'
import type { EvolutionHistory } from '@/features/evolution/types/evolution.types'
import { getEvolutionHistoryMock } from '@/features/evolution/services/evolution-history.service'
import type { HabitEngineState, HabitFrequency, HabitPriority, HabitRecord } from '@/features/habits/types/habit.types'
import { archiveHabit, completeHabit, createHabit, deleteHabit, getHabitEngineState, skipHabit, updateHabit } from '@/features/habits/services/habits.service'
import type { JournalEntry } from '@/features/journal/types/journal.types'
import { runLifeEngine } from '@/features/life-engine/services/life-engine.service'
import type { MemoryEngineMock } from '@/features/memory/types/memory.types'
import { getMemoryEngineMock } from '@/features/memory/services/memory.service'
import type { LifeReviewSummary } from '@/features/reviews/types/review.types'
import { getWeeklyReview } from '@/features/reviews/services/review.service'

const pillars: Pillar[] = ['Fé', 'Saúde', 'Mente', 'Conhecimento', 'Finanças', 'Propósito', 'Consistência']

type QuickMission = { title: string; category: Pillar; impact: number; icon: ReactNode }

type DraftState = {
  title: string
  category: Pillar
  impact: number
  status: 'completed' | 'pending'
  date: string
}

type HabitDraftState = {
  title: string
  description: string
  frequency: HabitFrequency
  priority: HabitPriority
  weight: number
}

const initialDraft: DraftState = {
  title: '',
  category: 'Saúde',
  impact: 10,
  status: 'pending',
  date: new Date().toISOString().slice(0, 10),
}

const initialHabitDraft: HabitDraftState = {
  title: '',
  description: '',
  frequency: 'daily',
  priority: 'media',
  weight: 5,
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

function getHabitPillar(habit: HabitRecord): Pillar {
  const title = habit.title.toLowerCase()

  if (title.includes('água') || title.includes('agua')) {
    return 'Saúde'
  }

  if (title.includes('estudar') || title.includes('estudo')) {
    return 'Conhecimento'
  }

  if (title.includes('oração') || title.includes('biblia') || title.includes('bíblia')) {
    return 'Fé'
  }

  if (title.includes('revisão') || title.includes('revisao')) {
    return 'Propósito'
  }

  return 'Consistência'
}

function getHabitIcon(habit: HabitRecord) {
  const pillar = getHabitPillar(habit)

  if (pillar === 'Saúde') {
    return <Droplets className="h-5 w-5" />
  }

  if (pillar === 'Conhecimento') {
    return <GraduationCap className="h-5 w-5" />
  }

  if (pillar === 'Fé') {
    return <BookOpen className="h-5 w-5" />
  }

  return <Heart className="h-5 w-5" />
}

export default function HojePage() {
  const router = useRouter()
  const [actions, setActions] = useState<LifeAction[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    const stored = loadDailyActions()
    return stored
  })
  const [draft, setDraft] = useState(initialDraft)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeActionId, setActiveActionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState(() => runLifeEngine([]))
  const [dailyAdvice, setDailyAdvice] = useState<CoachAdvice | null>(null)
  const [habitState, setHabitState] = useState<HabitEngineState | null>(null)
  const [activityState, setActivityState] = useState<ActivityEngineState | null>(null)
  const [dreamState, setDreamState] = useState<DreamEngineMock | null>(null)
  const [memoryState, setMemoryState] = useState<MemoryEngineMock | null>(null)
  const [evolutionState, setEvolutionState] = useState<EvolutionHistory | null>(null)
  const [reviewState, setReviewState] = useState<LifeReviewSummary | null>(null)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [habitDraft, setHabitDraft] = useState(initialHabitDraft)
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null)
  const [habitActionId, setHabitActionId] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function hydrateActions() {
      setIsLoading(true)
      setError(null)

      try {
        const today = getToday()
        const remoteActions = await listDailyActionsByDate(today)
        const localTodayActions = loadDailyActions().filter((action) => action.occurred_at.startsWith(today))
        const nextActions = remoteActions.length > 0 ? remoteActions : localTodayActions

        if (!isMounted) {
          return
        }

        if (nextActions.length > 0) {
          setActions(nextActions)
          persistDailyActions(nextActions)
        }

        const [dashboardSummary, habits, activity, dreams, memory, evolution] = await Promise.all([
          getDashboardSummary(today),
          getHabitEngineState(),
          getActivityEngineState(),
          Promise.resolve(getDreamEngineMock()),
          Promise.resolve(getMemoryEngineMock()),
          getEvolutionHistoryMock(),
        ])

        if (isMounted) {
          setSummary(dashboardSummary.summary)
          setHabitState(habits)
          setActivityState(activity)
          setDreamState(dreams)
          setMemoryState(memory)
          setEvolutionState(evolution)
          setJournalEntries(dashboardSummary.journalEntries)
          setReviewState(getWeeklyReview({
            habits,
            activity,
            lifeScore: dashboardSummary.summary.lifeScore,
          }))
        }
      } catch {
        if (isMounted) {
          setError('Não foi possível atualizar o painel agora. Mantivemos seus dados locais visíveis.')
          setSummary(runLifeEngine(loadDailyActions().filter((action) => action.occurred_at.startsWith(getToday()))))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void hydrateActions()

    return () => {
      isMounted = false
    }
  }, [])

  const completedCount = actions.filter((action) => action.status === 'completed').length
  const pendingCount = actions.filter((action) => action.status !== 'completed').length

  const habitMissions = useMemo<QuickMission[]>(() => {
    const activeHabits = habitState?.habits.filter((habit) => habit.status === 'active') ?? []

    return activeHabits.slice(0, 4).map((habit) => ({
      title: habit.title,
      category: getHabitPillar(habit),
      impact: habit.weight,
      icon: getHabitIcon(habit),
    }))
  }, [habitState])

  const miniStats = useMemo(() => {
    const nextDream = dreamState?.dreams.find((dream) => dream.status === 'active') ?? dreamState?.dreams[0]
    const activityDistance = activityState?.summary.totalDistanceKm ?? 0
    const completedHabits = habitState?.summary.completedToday ?? completedCount
    const activeHabits = habitState?.summary.active ?? actions.length
    const weeklyStreak = habitState?.summary.strongestStreak ?? 0

    return [
      { icon: <Droplets />, title: 'Hábitos', value: `${completedHabits}/${activeHabits}`, color: 'from-cyan-500 to-sky-500', delay: 0.15 },
      { icon: <BookOpen />, title: 'Meta', value: nextDream ? `${nextDream.progress}%` : 'Hoje', color: 'from-amber-500 to-orange-500', delay: 0.25 },
      { icon: <GraduationCap />, title: 'Atividade', value: `${activityDistance} km`, color: 'from-violet-500 to-fuchsia-500', delay: 0.35 },
      { icon: <Heart />, title: 'Streak', value: `${weeklyStreak} dias`, color: 'from-emerald-500 to-lime-500', delay: 0.45 },
    ]
  }, [actions.length, activityState, completedCount, dreamState, habitState])

  useEffect(() => {
    let isMounted = true

    async function loadDailyAdvice() {
      const advice = await getDailyCoachAdvice({
        actions,
        lifeScore: summary.lifeScore,
        rhythmIndex: summary.rhythmIndex,
        pillarScores: summary.pillarScores,
        completedHabits: completedCount,
        pendingHabits: pendingCount,
      })

      if (isMounted) {
        setDailyAdvice(advice)
      }
    }

    void loadDailyAdvice()

    return () => {
      isMounted = false
    }
  }, [actions, completedCount, pendingCount, summary.lifeScore, summary.pillarScores, summary.rhythmIndex])

  const pendingHabitsForFlow = Math.max(
    0,
    (habitState?.summary.active ?? actions.length) - (habitState?.summary.completedToday ?? completedCount),
  )

  const priorityGoal = useMemo(() => {
    const nextDream = dreamState?.dreams.find((dream) => dream.status === 'at_risk')
      ?? dreamState?.dreams.find((dream) => dream.status === 'active')
      ?? dreamState?.dreams[0]

    return nextDream
      ? {
          title: nextDream.title,
          progress: nextDream.progress,
          nextAction: nextDream.nextAction,
        }
      : undefined
  }, [dreamState])

  const suggestedWorkout = useMemo(() => {
    const workout = activityState?.workouts.find((item) => item.status === 'planned')
      ?? activityState?.workouts[0]

    return workout
      ? {
          title: workout.title,
          detail: `${workout.duration_minutes} min · ${workout.muscle_groups.join(' + ')}`,
        }
      : undefined
  }, [activityState])

  const flowMissions = useMemo(
    () =>
      habitMissions.map((mission) => ({
        ...mission,
        onOpen: () => {
          const signal = `${mission.title} ${mission.category}`.toLowerCase()
          const destination = signal.includes('treino') || signal.includes('corrida') || signal.includes('sa')
            ? '/app/evolucao'
            : signal.includes('estud') || signal.includes('ora') || signal.includes('diario') || signal.includes('diário')
              ? '/app/diario'
              : '/app/metas'

          router.push(destination)
        },
      })),
    [habitMissions, router],
  )

  const latestJournalTitle = journalEntries[0]?.title
  const memorySignal = memoryState?.insight.recommendation
  const evolutionSignal = evolutionState?.periods[0]?.summary

  const nextRecommendation = useMemo(() => {
    const weakestPillar = Object.entries(summary.pillarScores).sort((a, b) => a[1] - b[1])[0]?.[0]
    const base = weakestPillar ? `Próxima ação recomendada: avance em ${weakestPillar}.` : 'Registre uma ação pequena para ativar seu ritmo.'
    const context = memorySignal ?? evolutionSignal

    return context ? `${base} ${context}` : base
  }, [evolutionSignal, memorySignal, summary.pillarScores])

  async function persistNextAction(input: DraftState) {
    const nextAction = await createDailyAction(input)
    const optimisticActions = [nextAction, ...actions]
    setActions(optimisticActions)
    setSummary(runLifeEngine(optimisticActions))

    const savedAction = await createDailyActionRecord(nextAction)
    const nextActions = [savedAction, ...actions]
    setActions(nextActions)
    setSummary(runLifeEngine(nextActions))
    persistDailyActions(nextActions)
    await syncDailyActions(nextActions)
  }

  async function refreshHabitState() {
    const nextHabitState = await getHabitEngineState()
    setHabitState(nextHabitState)
  }

  function startEditingHabit(habit: HabitRecord) {
    setEditingHabitId(habit.id)
    setHabitDraft({
      title: habit.title,
      description: habit.description ?? '',
      frequency: habit.frequency,
      priority: habit.priority,
      weight: habit.weight,
    })
    setError(null)
  }

  function cancelHabitEditing() {
    setEditingHabitId(null)
    setHabitDraft(initialHabitDraft)
  }

  async function handleHabitSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!habitDraft.title.trim()) {
      setError('Dê um nome para o hábito antes de salvar.')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      if (editingHabitId) {
        await updateHabit(editingHabitId, {
          title: habitDraft.title.trim(),
          description: habitDraft.description.trim(),
          frequency: habitDraft.frequency,
          priority: habitDraft.priority,
          weight: Math.max(1, habitDraft.weight),
        })
      } else {
        const userId = await getActiveUserId()
        await createHabit({
          user_id: userId,
          title: habitDraft.title.trim(),
          description: habitDraft.description.trim(),
          frequency: habitDraft.frequency,
          checklist: [],
          priority: habitDraft.priority,
          weight: Math.max(1, habitDraft.weight),
        })
      }

      await refreshHabitState()
      cancelHabitEditing()
    } catch {
      setError('Não foi possível salvar o hábito agora.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleCompleteHabit(habit: HabitRecord) {
    setHabitActionId(habit.id)
    setError(null)
    try {
      await completeHabit(habit)
      await refreshHabitState()
    } catch {
      setError('Não foi possível concluir o hábito agora.')
    } finally {
      setHabitActionId(null)
    }
  }

  async function handleSkipHabit(habit: HabitRecord) {
    setHabitActionId(habit.id)
    setError(null)
    try {
      await skipHabit(habit)
      await refreshHabitState()
    } catch {
      setError('Não foi possível pular o hábito agora.')
    } finally {
      setHabitActionId(null)
    }
  }

  async function handleArchiveHabit(habitId: string) {
    setHabitActionId(habitId)
    setError(null)
    try {
      await archiveHabit(habitId)
      await refreshHabitState()
    } catch {
      setError('Não foi possível arquivar o hábito agora.')
    } finally {
      setHabitActionId(null)
    }
  }

  async function handleDeleteHabit(habitId: string) {
    setHabitActionId(habitId)
    setError(null)
    try {
      await deleteHabit(habitId)
      await refreshHabitState()
    } catch {
      setError('Não foi possível excluir o hábito agora.')
    } finally {
      setHabitActionId(null)
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!draft.title.trim()) {
      setError('Dê um nome para a ação antes de registrar.')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      await persistNextAction(draft)
      setDraft({ ...initialDraft, date: getToday() })
    } catch {
      setError('Não foi possível salvar a ação. Tente novamente em alguns instantes.')
    } finally {
      setIsSaving(false)
    }
  }

  async function toggleStatus(actionId: string) {
    const currentAction = actions.find((action) => action.id === actionId)

    if (!currentAction) {
      return
    }

    const nextStatus: 'completed' | 'pending' = currentAction.status === 'completed' ? 'pending' : 'completed'
    const optimisticNextActions: LifeAction[] = actions.map((action) =>
      action.id === actionId
        ? {
            ...action,
            status: nextStatus,
            notes: nextStatus === 'completed' ? 'Concluída' : 'Pendente',
          }
        : action,
    )

    setActiveActionId(actionId)
    setError(null)
    setActions(optimisticNextActions)
    setSummary(runLifeEngine(optimisticNextActions))
    persistDailyActions(optimisticNextActions)

    try {
      const updatedAction = await updateDailyActionStatus(actionId, nextStatus)
      if (updatedAction) {
        const persistedActions = actions.map((action) =>
          action.id === actionId ? updatedAction : action,
        )
        setActions(persistedActions)
        setSummary(runLifeEngine(persistedActions))
        persistDailyActions(persistedActions)
      }
    } catch {
      setError('A mudança ficou salva localmente, mas não sincronizou agora.')
    } finally {
      setActiveActionId(null)
    }
  }

  async function handleDelete(actionId: string) {
    setActiveActionId(actionId)
    setError(null)

    try {
      const deleted = await deleteDailyAction(actionId)

      if (!deleted) {
        setError('Não foi possível excluir esta ação agora.')
        return
      }

      const nextActions = actions.filter((action) => action.id !== actionId)
      setActions(nextActions)
      setSummary(runLifeEngine(nextActions))
      persistDailyActions(nextActions)
    } catch {
      setError('Não foi possível excluir esta ação agora.')
    } finally {
      setActiveActionId(null)
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="px-4 pb-40 pt-6 text-white sm:pb-48"
    >
      <div className="relative mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-400">Hoje • LifeOS</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Bom dia, Gabriel</h1>
            <p className="mt-1 text-zinc-400">Viva com propósito. Evolua com constância.</p>
            <p className="mt-3 max-w-xl text-sm font-medium text-white/85">Obrigado, Deus, por mais um dia. Vamos transformar intenção em movimento.</p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xl backdrop-blur-xl">
            G
          </div>
        </header>

        <HeroScore
          score={summary.rhythmIndex}
          classification={summary.classification}
          insight={`${summary.insight} ${nextRecommendation}`}
          lifeScore={summary.lifeScore}
        />

        {dailyAdvice ? <DailyAdvice advice={dailyAdvice} /> : null}

        <DailyFlow
          missions={flowMissions}
          pendingHabits={pendingHabitsForFlow}
          priorityGoal={priorityGoal}
          workout={suggestedWorkout}
          review={reviewState ? { title: reviewState.title, nextStep: reviewState.nextStep } : undefined}
          journalTitle={latestJournalTitle}
          onOpenGoals={() => router.push('/app/metas')}
          onOpenCheckIn={() => router.push('/app/evolucao')}
          onOpenJournal={() => router.push('/app/diario')}
          onOpenEvolution={() => router.push('/app/evolucao')}
        />

        {error ? (
          <FeedbackState
            variant="error"
            title="Atenção necessária"
            description={error}
          />
        ) : null}

        <section className="relative overflow-hidden rounded-[32px] border border-white/[0.12] bg-white/[0.035] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.10),0_24px_70px_rgba(0,0,0,.30)] backdrop-blur-2xl sm:p-4">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="mb-3 flex items-center justify-between px-1 sm:px-2">
            <div>
              <p className="text-sm font-semibold text-white">Painel inteligente</p>
              <p className="text-xs text-zinc-400">Sinais vivos das engines do LifeOS.</p>
            </div>
            <Sparkles className="h-4 w-4 text-cyan-100" />
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {miniStats.map((stat) => (
              <MiniStat key={stat.title} icon={stat.icon} title={stat.title} value={stat.value} color={stat.color} delay={stat.delay} />
            ))}
          </div>
        </section>

        <section className={panelSurfaceClassName}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-100/70">Hábitos</p>
              <h2 className="mt-1 text-xl font-bold">Ritmo diário</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-400">Crie, edite, conclua, pule ou arquive hábitos sem sair do seu dia.</p>
            </div>
            <span className="w-fit rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-xs text-zinc-300">
              {habitState?.summary.completedToday ?? 0}/{habitState?.summary.active ?? 0} concluídos
            </span>
          </div>

          <form onSubmit={handleHabitSubmit} className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr_150px_150px_140px_auto]">
            <input
              value={habitDraft.title}
              onChange={(event) => setHabitDraft((prev) => ({ ...prev, title: event.target.value }))}
              className={fieldClassName}
              placeholder="Ex.: Alongar 10 min"
              aria-label="Nome do hábito"
            />
            <input
              value={habitDraft.description}
              onChange={(event) => setHabitDraft((prev) => ({ ...prev, description: event.target.value }))}
              className={fieldClassName}
              placeholder="Descrição curta"
              aria-label="Descrição do hábito"
            />
            <select
              value={habitDraft.frequency}
              onChange={(event) => setHabitDraft((prev) => ({ ...prev, frequency: event.target.value as HabitFrequency }))}
              className={selectFieldClassName}
              aria-label="Frequência do hábito"
            >
              <option value="daily" className="bg-zinc-900">Diário</option>
              <option value="weekly" className="bg-zinc-900">Semanal</option>
              <option value="monthly" className="bg-zinc-900">Mensal</option>
            </select>
            <select
              value={habitDraft.priority}
              onChange={(event) => setHabitDraft((prev) => ({ ...prev, priority: event.target.value as HabitPriority }))}
              className={selectFieldClassName}
              aria-label="Prioridade do hábito"
            >
              <option value="baixa" className="bg-zinc-900">Baixa</option>
              <option value="media" className="bg-zinc-900">Média</option>
              <option value="alta" className="bg-zinc-900">Alta</option>
            </select>
            <input
              type="number"
              min="1"
              value={habitDraft.weight}
              onChange={(event) => setHabitDraft((prev) => ({ ...prev, weight: Number(event.target.value) }))}
              className={fieldClassName}
              aria-label="Peso do hábito"
            />
            <div className="flex gap-2">
              <Button type="submit" isLoading={isSaving} size="sm">{editingHabitId ? 'Salvar' : 'Criar'}</Button>
              {editingHabitId ? <Button type="button" variant="ghost" size="sm" onClick={cancelHabitEditing}>Cancelar</Button> : null}
            </div>
          </form>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {(habitState?.habits ?? []).length === 0 ? (
              <FeedbackState variant="empty" title="Nenhum hábito cadastrado" description="Crie um hábito simples para ativar seu ritmo." />
            ) : (
              habitState?.habits.map((habit) => (
                <div key={habit.id} className="rounded-2xl border border-white/[0.12] bg-white/[0.045] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{habit.title}</p>
                      <p className="mt-1 text-sm text-zinc-400">{habit.description || 'Sem descrição'}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-400">
                        <span className="rounded-full bg-white/10 px-2.5 py-1">{habit.frequency}</span>
                        <span className="rounded-full bg-white/10 px-2.5 py-1">peso {habit.weight}</span>
                        <span className="rounded-full bg-white/10 px-2.5 py-1">streak {habit.streak}</span>
                        <span className="rounded-full bg-white/10 px-2.5 py-1">{habit.status === 'archived' ? 'Arquivado' : 'Ativo'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="secondary" onClick={() => void handleCompleteHabit(habit)} disabled={habitActionId === habit.id || habit.status === 'archived'}>Concluir</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => void handleSkipHabit(habit)} disabled={habitActionId === habit.id || habit.status === 'archived'}>Pular</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => startEditingHabit(habit)}>Editar</Button>
                    {habit.status !== 'archived' ? <Button type="button" size="sm" variant="ghost" onClick={() => void handleArchiveHabit(habit.id)} disabled={habitActionId === habit.id}>Arquivar</Button> : null}
                    <Button type="button" size="sm" variant="danger" onClick={() => void handleDeleteHabit(habit.id)} disabled={habitActionId === habit.id}>Excluir</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className={panelSurfaceClassName}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Registrar ação</h2>
                <p className="text-sm text-zinc-400">Adicione metas do dia e acompanhe o impacto.</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                {completedCount}/{actions.length}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm text-zinc-300">
                  <span className="mb-2 block">Título</span>
                  <input
                    value={draft.title}
                    onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
                    className={fieldClassName}
                    placeholder="Ex.: Meditar 10 min"
                  />
                </label>

                <label className="block text-sm text-zinc-300">
                  <span className="mb-2 block">Categoria</span>
                  <select
                    value={draft.category}
                    onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value as Pillar }))}
                    className={selectFieldClassName}
                  >
                    {pillars.map((pillar) => (
                      <option key={pillar} value={pillar} className="bg-zinc-900">
                        {pillar}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="block text-sm text-zinc-300">
                  <span className="mb-2 block">Impacto</span>
                  <input
                    type="number"
                    min="1"
                    value={draft.impact}
                    onChange={(event) => setDraft((prev) => ({ ...prev, impact: Number(event.target.value) }))}
                    className={fieldClassName}
                  />
                </label>

                <label className="block text-sm text-zinc-300">
                  <span className="mb-2 block">Status</span>
                  <select
                    value={draft.status}
                    onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value as 'completed' | 'pending' }))}
                    className={selectFieldClassName}
                  >
                    <option value="pending" className="bg-zinc-900">Pendente</option>
                    <option value="completed" className="bg-zinc-900">Concluído</option>
                  </select>
                </label>

                <label className="block text-sm text-zinc-300">
                  <span className="mb-2 block">Data</span>
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(event) => setDraft((prev) => ({ ...prev, date: event.target.value }))}
                    className={fieldClassName}
                  />
                </label>
              </div>

              <Button type="submit" isLoading={isSaving} className="w-full">
                <Plus className="h-4 w-4" />
                {isSaving ? 'Salvando...' : 'Adicionar ação'}
              </Button>
            </form>
          </div>

          <div className={panelSurfaceClassName}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Ações do dia</h2>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                {pendingCount} pendentes
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {isLoading ? (
                <FeedbackState variant="loading" title="Carregando ações" description="Sincronizando seu dia com calma." />
              ) : actions.length === 0 ? (
                <FeedbackState
                  variant="empty"
                  title="Nenhuma ação registrada ainda"
                  description="Comece com uma ação rápida ou registre uma intenção para hoje."
                />
              ) : (
                actions.map((action) => (
                  <div key={action.id} className={`rounded-2xl border p-4 transition ${action.status === 'completed' ? 'border-emerald-400/35 bg-emerald-500/10' : 'border-white/15 bg-white/[0.055] hover:border-cyan-300/25 hover:bg-white/[0.075]'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <button type="button" onClick={() => void toggleStatus(action.id)} className="flex-1 text-left" disabled={activeActionId === action.id}>
                        <div className="flex items-start gap-3">
                          <span className={`mt-1 grid h-6 w-6 place-items-center rounded-full border ${action.status === 'completed' ? 'border-emerald-400 bg-emerald-400 text-black' : 'border-white/20 bg-white/5 text-transparent'}`}>
                            <CheckCircle2 className="h-4 w-4" />
                          </span>
                          <span>
                            <span className="block font-semibold">{action.title}</span>
                            <span className="text-sm text-zinc-400">
                              {action.category ?? action.pillar} • {action.value} pts
                            </span>
                            <span className="mt-2 flex items-center gap-2">
                              <span className={`rounded-full px-2 py-1 text-xs ${action.status === 'completed' ? 'bg-emerald-500 text-black' : 'bg-white/10 text-zinc-300'}`}>
                                {action.status === 'completed' ? 'Concluído' : 'Pendente'}
                              </span>
                              <span className="text-xs text-zinc-500">{formatDate(action.occurred_at.slice(0, 10))}</span>
                            </span>
                          </span>
                        </div>
                      </button>
                      <button type="button" aria-label={`Excluir ${action.title}`} onClick={() => void handleDelete(action.id)} className="rounded-full border border-white/15 bg-white/[0.04] p-2 text-zinc-400 transition hover:border-rose-300/35 hover:bg-rose-500/10 hover:text-rose-100" disabled={activeActionId === action.id}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.section>

        <section className={panelSurfaceClassName}>
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-cyan-200" />
            <h2 className="text-xl font-bold">Pilares</h2>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {Object.entries(summary.pillarScores).map(([pillar, value]) => (
              <div key={pillar} className={insetSurfaceClassName}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{pillar}</span>
                  <span className="text-zinc-400">{value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.main>
  )
}
