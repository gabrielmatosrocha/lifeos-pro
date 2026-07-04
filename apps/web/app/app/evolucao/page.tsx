"use client"

import { useEffect, useState } from 'react'
import AnalyticsDashboard from '@/components/evolution/AnalyticsDashboard'
import ActivityModePreview from '@/components/evolution/ActivityModePreview'
import CoachDashboard from '@/components/evolution/CoachDashboard'
import DailyVerseCard from '@/components/evolution/DailyVerseCard'
import EvolutionComparisonCard from '@/components/evolution/EvolutionComparisonCard'
import EvolutionPeriodTabs from '@/components/evolution/EvolutionPeriodTabs'
import EvolutionSummaryCard from '@/components/evolution/EvolutionSummaryCard'
import GymCheckInCard from '@/components/evolution/GymCheckInCard'
import NotificationCenter from '@/components/evolution/NotificationCenter'
import RunCheckInCard from '@/components/evolution/RunCheckInCard'
import WorkoutHistoryCard from '@/components/evolution/WorkoutHistoryCard'
import { Card } from '@/components/ui/Card'
import FeedbackState from '@/components/ui/FeedbackState'
import { insetSurfaceClassName } from '@/components/ui/fieldStyles'
import { Progress } from '@/components/ui/Progress'
import { getDashboardSummary } from '@/features/dashboard/services/dashboard.service'
import { getEvolutionHistoryMock } from '@/features/evolution/services/evolution-history.service'
import type { DashboardSummary } from '@/features/dashboard/services/dashboard.service'
import type { EvolutionHistory } from '@/features/evolution/types/evolution.types'

export default function EvolucaoPage() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null)
  const [history, setHistory] = useState<EvolutionHistory | null>(null)
  const [activePeriodId, setActivePeriodId] = useState('today')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadEvolution() {
      setIsLoading(true)
      setError(null)
      try {
        const [summary, evolutionHistory] = await Promise.all([
          getDashboardSummary(),
          getEvolutionHistoryMock(),
        ])
        if (isMounted) {
          setDashboard(summary)
          setHistory(evolutionHistory)
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
        <span className="w-fit rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,.10)]">Mock · Supabase ready</span>
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
