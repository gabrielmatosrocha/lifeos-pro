"use client"

import { useEffect, useState } from 'react'
import DreamComposerCard from '@/components/dreams/DreamComposerCard'
import DreamInsight from '@/components/dreams/DreamInsight'
import DreamList from '@/components/dreams/DreamList'
import DreamPlanCard from '@/components/dreams/DreamPlanCard'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import FeedbackState from '@/components/ui/FeedbackState'
import { fieldClassName, selectFieldClassName, subtleActionClassName } from '@/components/ui/fieldStyles'
import { Progress } from '@/components/ui/Progress'
import { getDreamEngineMock } from '@/features/dreams/services/dream.service'
import { createGoal, deleteGoal, listGoals, loadGoals, updateGoalProgress } from '@/features/goals/services/goals.service'
import type { GoalRecord } from '@/features/goals/types/goal.types'

const pillars = ['Saúde', 'Conhecimento', 'Mente', 'Fé', 'Finanças', 'Propósito']

export default function MetasPage() {
  const [dreamEngine] = useState(() => getDreamEngineMock())
  const [activeDreamId, setActiveDreamId] = useState(dreamEngine.featuredDreamId)
  const [goals, setGoals] = useState<GoalRecord[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    return loadGoals()
  })
  const [title, setTitle] = useState('')
  const [pillar, setPillar] = useState(pillars[0])
  const [targetValue, setTargetValue] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const activeDream = dreamEngine.dreams.find((dream) => dream.id === activeDreamId) ?? dreamEngine.dreams[0]

  useEffect(() => {
    let isMounted = true

    async function hydrateGoals() {
      setIsLoading(true)
      setError(null)
      try {
        const nextGoals = await listGoals()
        if (isMounted) {
          setGoals(nextGoals)
        }
      } catch {
        if (isMounted) {
          setError('Não foi possível atualizar suas metas agora.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
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
      setError('Dê um nome para a meta antes de criar.')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
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
    } catch {
      setError('Não foi possível criar a meta agora.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleProgress(goalId: string, currentValue: number) {
    setError(null)
    try {
      const nextGoals = await updateGoalProgress(goalId, currentValue)
      setGoals(nextGoals)
    } catch {
      setError('Não foi possível atualizar o progresso agora.')
    }
  }

  async function handleDelete(goalId: string) {
    setError(null)
    try {
      const nextGoals = await deleteGoal(goalId)
      setGoals(nextGoals)
    } catch {
      setError('Não foi possível excluir a meta agora.')
    }
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 pb-40 pt-6 text-white sm:pb-48">
      <header>
        <p className="text-sm font-medium text-cyan-100/70">Direção</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Metas</h1>
        <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-zinc-400 sm:block">Escolha uma direção clara. Sonhos viram metas quando ganham plano, rotina e próximo passo.</p>
      </header>

      {error ? <FeedbackState variant="error" title="Atenção" description={error} /> : null}

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/55">Dream Engine V1</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Sonhos, metas e plano de evolução</h2>
        </div>
        <DreamInsight insight={dreamEngine.insight} />
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <DreamList dreams={dreamEngine.dreams} activeDreamId={activeDream.id} onSelectDream={setActiveDreamId} />
          <div className="space-y-6">
            <DreamPlanCard dream={activeDream} />
            <DreamComposerCard />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/55">Metas atuais</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Execução mensurável</h2>
        </div>

      <Card>
        <h2 className="text-xl font-bold">Nova meta</h2>
        <p className="mt-1 text-sm text-zinc-400">Crie algo simples, mensurável e possível para este ciclo.</p>
        <form onSubmit={handleCreateGoal} className="mt-4 space-y-3">
          <input value={title} onChange={(event) => setTitle(event.target.value)} className={fieldClassName} placeholder="Ex: Correr 20 km este mês" aria-label="Nome da meta" />
          <select value={pillar} onChange={(event) => setPillar(event.target.value)} className={selectFieldClassName} aria-label="Pilar da meta">
            {pillars.map((item) => (
              <option key={item} value={item} className="bg-zinc-900">{item}</option>
            ))}
          </select>
          <input type="number" min="1" value={targetValue} onChange={(event) => setTargetValue(Number(event.target.value))} className={fieldClassName} placeholder="Meta" aria-label="Valor alvo da meta" />
          <Button type="submit" isLoading={isSaving}>Criar meta</Button>
        </form>
      </Card>
      </section>

      <section className="space-y-4">
        {isLoading ? (
          <FeedbackState variant="loading" title="Carregando metas" description="Buscando sua direção atual." />
        ) : goals.length === 0 ? (
          <FeedbackState variant="empty" title="Nenhuma meta ativa" description="Crie uma meta pequena para dar direção ao seu mês." />
        ) : (
          goals.map((goal) => {
            const progress = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))

            return (
              <Card key={goal.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">{goal.pillar}</p>
                    <h3 className="mt-1 text-lg font-bold">{goal.title}</h3>
                  </div>
                  <button type="button" onClick={() => void handleDelete(goal.id)} className={subtleActionClassName}>Excluir</button>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <input type="number" min="0" value={goal.current_value} onChange={(event) => void handleProgress(goal.id, Number(event.target.value))} className={fieldClassName} aria-label={`Progresso atual de ${goal.title}`} />
                  <span className="text-sm text-slate-400">/{goal.target_value}</span>
                </div>
              </Card>
            )
          })
        )}
      </section>
    </main>
  )
}
