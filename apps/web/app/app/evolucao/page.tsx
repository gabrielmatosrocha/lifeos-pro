"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { getDashboardSummary } from '@/features/dashboard/services/dashboard.service'
import type { DashboardSummary } from '@/features/dashboard/services/dashboard.service'

export default function EvolucaoPage() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      const summary = await getDashboardSummary()
      setDashboard(summary)
    }

    void loadDashboard()
  }, [])

  if (!dashboard) {
    return (
      <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
        <header>
          <p className="text-slate-500">Sua jornada</p>
          <h1 className="text-3xl font-bold">Evolução</h1>
        </header>
        <Card>
          <p className="text-sm text-slate-500">Carregando dados...</p>
        </Card>
      </main>
    )
  }

  const { summary, actions, goals, journalEntries } = dashboard

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <header>
        <p className="text-slate-500">Sua jornada</p>
        <h1 className="text-3xl font-bold">Evolução</h1>
      </header>

      <Card>
        <p className="text-sm text-slate-500">Ritmo geral</p>
        <p className="mt-2 text-5xl font-bold">{summary.rhythmIndex}</p>
        <p className="mt-2 text-slate-500">{summary.insight}</p>
      </Card>

      <Card>
        <h2 className="text-xl font-bold">Pilares</h2>
        <div className="mt-4 space-y-4">
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

      <Card>
        <h2 className="text-xl font-bold">Metas ativas</h2>
        <div className="mt-4 space-y-3">
          {goals.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma meta registrada ainda.</p>
          ) : (
            goals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="rounded-xl border p-3">
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
            <p className="text-sm text-slate-500">Nenhuma reflexão registrada ainda.</p>
          ) : (
            journalEntries.slice(0, 3).map((entry) => (
              <div key={entry.id} className="rounded-xl border p-3">
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
          {actions.map((action) => (
            <div key={action.id} className="rounded-xl border p-3">
              <p className="font-semibold">{action.title}</p>
              <p className="text-sm text-slate-500">{action.pillar} • {action.status === 'completed' ? 'Concluída' : 'Pendente'}</p>
            </div>
          ))}
        </div>
      </Card>
    </main>
  )
}
