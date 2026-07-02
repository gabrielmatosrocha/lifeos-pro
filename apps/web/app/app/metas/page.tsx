"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { createGoal, deleteGoal, listGoals, loadGoals, updateGoalProgress } from '@/features/goals/services/goals.service'
import type { GoalRecord } from '@/features/goals/types/goal.types'

const pillars = ['Saúde', 'Conhecimento', 'Mente', 'Fé', 'Finanças', 'Propósito']

export default function MetasPage() {
  const [goals, setGoals] = useState<GoalRecord[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    return loadGoals()
  })
  const [title, setTitle] = useState('')
  const [pillar, setPillar] = useState(pillars[0])
  const [targetValue, setTargetValue] = useState(10)

  useEffect(() => {
    let isMounted = true

    async function hydrateGoals() {
      const nextGoals = await listGoals()
      if (isMounted) {
        setGoals(nextGoals)
      }
    }

    void hydrateGoals()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleCreateGoal(event: React.FormEvent) {
    event.preventDefault()

    if (!title.trim()) {
      return
    }

    const nextGoals = await createGoal({
      title,
      pillar,
      horizon: 'month',
      target_value: targetValue,
      unit: 'ações',
      status: 'active',
    })

    setGoals(nextGoals)
    setTitle('')
    setTargetValue(10)
  }

  async function handleProgress(goalId: string, currentValue: number) {
    const nextGoals = await updateGoalProgress(goalId, currentValue)
    setGoals(nextGoals)
  }

  async function handleDelete(goalId: string) {
    const nextGoals = await deleteGoal(goalId)
    setGoals(nextGoals)
  }

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <header>
        <p className="text-slate-500">Direção</p>
        <h1 className="text-3xl font-bold">Metas</h1>
      </header>

      <Card>
        <h2 className="text-xl font-bold">Nova meta</h2>
        <form onSubmit={handleCreateGoal} className="mt-4 space-y-3">
          <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-white" placeholder="Ex: Correr 20 km este mês" />
          <select value={pillar} onChange={(event) => setPillar(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-white">
            {pillars.map((item) => (
              <option key={item} value={item} className="bg-zinc-900">{item}</option>
            ))}
          </select>
          <input type="number" min="1" value={targetValue} onChange={(event) => setTargetValue(Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-white" placeholder="Meta" />
          <button type="submit" className="rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white">Criar meta</button>
        </form>
      </Card>

      <section className="space-y-4">
        {goals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))

          return (
            <Card key={goal.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{goal.pillar}</p>
                  <h3 className="mt-1 text-lg font-bold">{goal.title}</h3>
                </div>
                <button type="button" onClick={() => void handleDelete(goal.id)} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">Excluir</button>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input type="number" min="0" value={goal.current_value} onChange={(event) => void handleProgress(goal.id, Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-white" />
                <span className="text-sm text-slate-400">/{goal.target_value}</span>
              </div>
            </Card>
          )
        })}
      </section>
    </main>
  )
}
