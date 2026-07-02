"use client"

import { useEffect, useState } from 'react'
import BackgroundGlow from '@/components/layout/BackgroundGlow'
import { motion } from 'framer-motion'
import HeroScore from '@/components/dashboard/HeroScore'
import MiniStat from '@/components/ui/MiniStat'
import Button from '@/components/ui/Button'
import { demoActions } from '@/features/demo/demo-data'
import { createDailyAction, loadDailyActions, persistDailyActions, syncDailyActions } from '@/features/actions/services/action.service'
import {
  createDailyActionRecord,
  deleteDailyAction,
  listDailyActionsByDate,
  updateDailyActionStatus,
} from '@/features/actions/services/daily-actions.service'
import type { LifeAction, Pillar } from '@/features/actions/types/action.types'
import { getDashboardSummary } from '@/features/dashboard/services/dashboard.service'
import { runLifeEngine } from '@/features/life-engine/services/life-engine.service'

const pillars: Pillar[] = ['Fé', 'Saúde', 'Mente', 'Conhecimento', 'Finanças', 'Propósito', 'Consistência']

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
  const [summary, setSummary] = useState(() => runLifeEngine(demoActions))

  useEffect(() => {
    async function hydrateActions() {
      const today = new Date().toISOString().slice(0, 10)
      const remoteActions = await listDailyActionsByDate(today)
      const nextActions = remoteActions.length > 0 ? remoteActions : loadDailyActions().filter((action) => action.occurred_at.startsWith(today))

      if (nextActions.length > 0) {
        setActions(nextActions)
        persistDailyActions(nextActions)
      }

      const dashboardSummary = await getDashboardSummary(today)
      setSummary(dashboardSummary.summary)
      setIsLoading(false)
    }

    void hydrateActions()
  }, [])

  const completedCount = actions.filter((action) => action.status === 'completed').length
  const pendingCount = actions.filter((action) => action.status !== 'completed').length

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!draft.title.trim()) {
      return
    }

    const nextAction = await createDailyAction(draft)
    const optimisticActions = [nextAction, ...actions]
    setActions(optimisticActions)
    setDraft(initialDraft)
    setIsSaving(true)

    const savedAction = await createDailyActionRecord(nextAction)
    const nextActions = [savedAction, ...actions]
    setActions(nextActions)
    persistDailyActions(nextActions)
    await syncDailyActions(nextActions)
    setIsSaving(false)
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

    setActions(optimisticNextActions)
    persistDailyActions(optimisticNextActions)

    const updatedAction = await updateDailyActionStatus(actionId, nextStatus)
    if (updatedAction) {
      const persistedActions = actions.map((action) =>
        action.id === actionId ? updatedAction : action,
      )
      setActions(persistedActions)
      persistDailyActions(persistedActions)
    }
  }

  async function handleDelete(actionId: string) {
    const deleted = await deleteDailyAction(actionId)

    if (!deleted) {
      return
    }

    const nextActions = actions.filter((action) => action.id !== actionId)
    setActions(nextActions)
    persistDailyActions(nextActions)
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="min-h-screen overflow-hidden bg-[#09090B] px-4 pb-48 pt-6 text-white"
    >
      <BackgroundGlow />
      <div className="relative mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-400">Hoje • LifeOS</p>
            <h1 className="mt-1 text-4xl font-bold tracking-tight">Bom dia, Gabriel ☀️</h1>
            <p className="mt-1 text-zinc-400">Viva com propósito. Evolua com constância.</p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xl backdrop-blur-xl">
            G
          </div>
        </header>

        <HeroScore score={summary.rhythmIndex} classification={summary.classification} insight={summary.insight} />

        <section className="grid gap-5 md:grid-cols-4">
          <MiniStat icon="💧" title="Água" value="2 L" color="from-cyan-500 to-sky-500" delay={0.15} />
          <MiniStat icon="📖" title="Palavra" value="5 min" color="from-amber-500 to-orange-500" delay={0.25} />
          <MiniStat icon="📚" title="Estudo" value="60 min" color="from-violet-500 to-fuchsia-500" delay={0.35} />
          <MiniStat icon="🙏" title="Gratidão" value="Hoje" color="from-emerald-500 to-lime-500" delay={0.45} />
        </section>

        <motion.section
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
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
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none ring-0"
                    placeholder="Ex.: Meditar 10 min"
                  />
                </label>

                <label className="block text-sm text-zinc-300">
                  <span className="mb-2 block">Categoria</span>
                  <select
                    value={draft.category}
                    onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value as Pillar }))}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
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
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                  />
                </label>

                <label className="block text-sm text-zinc-300">
                  <span className="mb-2 block">Status</span>
                  <select
                    value={draft.status}
                    onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value as 'completed' | 'pending' }))}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
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
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                  />
                </label>
              </div>

              <Button type="submit" disabled={isSaving} className="w-full bg-cyan-500 px-4 py-3 hover:bg-cyan-400">
                {isSaving ? 'Salvando...' : 'Adicionar ação'}
              </Button>
            </form>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Ações do dia</h2>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                {pendingCount} pendentes
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {isLoading ? (
                <p className="text-sm text-zinc-400">Carregando ações...</p>
              ) : actions.length === 0 ? (
                <p className="text-sm text-zinc-400">Nenhuma ação registrada ainda.</p>
              ) : (
                actions.map((action) => (
                  <div key={action.id} className={`rounded-2xl border p-4 transition ${action.status === 'completed' ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/10 bg-white/[0.04]'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <button type="button" onClick={() => void toggleStatus(action.id)} className="flex-1 text-left">
                        <p className="font-semibold">{action.title}</p>
                        <p className="text-sm text-zinc-400">
                          {action.category ?? action.pillar} • {action.value} pts
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`rounded-full px-2 py-1 text-xs ${action.status === 'completed' ? 'bg-emerald-500 text-black' : 'bg-white/10 text-zinc-300'}`}>
                            {action.status === 'completed' ? 'Concluído' : 'Pendente'}
                          </span>
                          <p className="text-xs text-zinc-500">{formatDate(action.occurred_at.slice(0, 10))}</p>
                        </div>
                      </button>
                      <button type="button" onClick={() => void handleDelete(action.id)} className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400 transition hover:bg-white/10">
                        Excluir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.section>

        <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
          <h2 className="text-xl font-bold">Pilares</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {Object.entries(summary.pillarScores).map(([pillar, value]) => (
              <div key={pillar} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span>{pillar}</span>
                  <span className="text-zinc-400">{value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.main>
  )
}
