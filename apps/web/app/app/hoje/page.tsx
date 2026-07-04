"use client"

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, CheckCircle2, Droplets, GraduationCap, Heart, Plus, Sparkles, Trash2 } from 'lucide-react'
import DailyAdvice from '@/components/coach/DailyAdvice'
import HeroScore from '@/components/dashboard/HeroScore'
import MiniStat from '@/components/ui/MiniStat'
import Button from '@/components/ui/Button'
import FeedbackState from '@/components/ui/FeedbackState'
import { fieldClassName, insetSurfaceClassName, panelSurfaceClassName, selectFieldClassName } from '@/components/ui/fieldStyles'
import { demoActions } from '@/features/demo/demo-data'
import { createDailyAction, loadDailyActions, persistDailyActions, syncDailyActions } from '@/features/actions/services/action.service'
import {
  createDailyActionRecord,
  deleteDailyAction,
  listDailyActionsByDate,
  updateDailyActionStatus,
} from '@/features/actions/services/daily-actions.service'
import type { LifeAction, Pillar } from '@/features/actions/types/action.types'
import type { CoachAdvice } from '@/features/coach/types/coach.types'
import { getDailyCoachAdvice } from '@/features/coach/services/coach.service'
import { getDashboardSummary } from '@/features/dashboard/services/dashboard.service'
import { runLifeEngine } from '@/features/life-engine/services/life-engine.service'

const pillars: Pillar[] = ['Fé', 'Saúde', 'Mente', 'Conhecimento', 'Finanças', 'Propósito', 'Consistência']

const quickActions: Array<{ title: string; category: Pillar; impact: number; icon: ReactNode }> = [
  { title: 'Beber água', category: 'Saúde', impact: 6, icon: <Droplets className="h-5 w-5" /> },
  { title: 'Ler a Palavra', category: 'Fé', impact: 16, icon: <BookOpen className="h-5 w-5" /> },
  { title: 'Estudar 25 min', category: 'Conhecimento', impact: 18, icon: <GraduationCap className="h-5 w-5" /> },
  { title: 'Registrar gratidão', category: 'Mente', impact: 12, icon: <Heart className="h-5 w-5" /> },
]

type DraftState = {
  title: string
  category: Pillar
  impact: number
  status: 'completed' | 'pending'
  date: string
}

const initialDraft: DraftState = {
  title: '',
  category: 'Saúde',
  impact: 10,
  status: 'pending',
  date: new Date().toISOString().slice(0, 10),
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

export default function HojePage() {
  const [actions, setActions] = useState<LifeAction[]>(() => {
    if (typeof window === 'undefined') {
      return demoActions
    }

    const stored = loadDailyActions()
    return stored.length > 0 ? stored : demoActions
  })
  const [draft, setDraft] = useState(initialDraft)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeActionId, setActiveActionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState(() => runLifeEngine(demoActions))
  const [dailyAdvice, setDailyAdvice] = useState<CoachAdvice | null>(null)

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

        const dashboardSummary = await getDashboardSummary(today)
        if (isMounted) {
          setSummary(dashboardSummary.summary)
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

  const nextRecommendation = useMemo(() => {
    const weakestPillar = Object.entries(summary.pillarScores).sort((a, b) => a[1] - b[1])[0]?.[0]
    return weakestPillar ? `Próxima ação recomendada: avance em ${weakestPillar}.` : 'Registre uma ação pequena para ativar seu ritmo.'
  }, [summary.pillarScores])

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

  async function handleQuickAction(action: (typeof quickActions)[number]) {
    setIsSaving(true)
    setError(null)

    try {
      await persistNextAction({
        title: action.title,
        category: action.category,
        impact: action.impact,
        status: 'completed',
        date: getToday(),
      })
    } catch {
      setError('Não foi possível registrar a ação rápida agora.')
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
              <p className="text-xs text-zinc-400">Sinais simples do seu ritmo diário.</p>
            </div>
            <Sparkles className="h-4 w-4 text-cyan-100" />
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <MiniStat icon={<Droplets />} title="Água" value="2 L" color="from-cyan-500 to-sky-500" delay={0.15} />
            <MiniStat icon={<BookOpen />} title="Palavra" value="5 min" color="from-amber-500 to-orange-500" delay={0.25} />
            <MiniStat icon={<GraduationCap />} title="Estudo" value="60 min" color="from-violet-500 to-fuchsia-500" delay={0.35} />
            <MiniStat icon={<Heart />} title="Gratidão" value="Hoje" color="from-emerald-500 to-lime-500" delay={0.45} />
          </div>
        </section>

        <section className={panelSurfaceClassName}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Ações rápidas</h2>
              <p className="text-sm text-zinc-400">Um toque para manter o ritmo sem fricção.</p>
            </div>
            <Sparkles className="h-5 w-5 text-cyan-200" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <button
                key={action.title}
                type="button"
                disabled={isSaving}
                onClick={() => void handleQuickAction(action)}
                className={`${insetSurfaceClassName} flex items-center gap-3 text-left disabled:opacity-60`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-lg">{action.icon}</span>
                <span>
                  <span className="block font-semibold">{action.title}</span>
                  <span className="text-xs text-zinc-400">{action.category} • {action.impact} pts</span>
                </span>
              </button>
            ))}
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
