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
import { getActiveUserId } from '@/features/auth/services/auth.service'
import { getDreamEngineMock } from '@/features/dreams/services/dream.service'
import { archiveGoal, createGoal, deleteGoal, listGoals, loadGoals, updateGoal, updateGoalProgress } from '@/features/goals/services/goals.service'
import type { GoalRecord } from '@/features/goals/types/goal.types'
import { dreamsRepository } from '@/features/persistence/repositories/domain.repositories'
import type { PersistedDream } from '@/features/persistence/repositories/domain.repositories'

const pillars = ['Saúde', 'Conhecimento', 'Mente', 'Fé', 'Finanças', 'Propósito']
const dreamAreas = ['Idiomas', 'Saúde', 'Corrida', 'Fé', 'Finanças', 'Leitura', 'Educação', 'Propósito']

type DreamDraftState = {
  title: string
  why: string
  deadline: string
  lifeArea: string
  priority: 'alta' | 'media' | 'baixa'
  nextAction: string
}

const initialDreamDraft: DreamDraftState = {
  title: '',
  why: '',
  deadline: '',
  lifeArea: dreamAreas[0],
  priority: 'media',
  nextAction: '',
}

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
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editPillar, setEditPillar] = useState(pillars[0])
  const [editTargetValue, setEditTargetValue] = useState(10)
  const [dreams, setDreams] = useState<PersistedDream[]>([])
  const [dreamDraft, setDreamDraft] = useState(initialDreamDraft)
  const [editingDreamId, setEditingDreamId] = useState<string | null>(null)
  const activeDream = dreamEngine.dreams.find((dream) => dream.id === activeDreamId) ?? dreamEngine.dreams[0]

  useEffect(() => {
    let isMounted = true

    async function hydrateGoals() {
      setIsLoading(true)
      setError(null)
      try {
        const userId = await getActiveUserId()
        const [nextGoals, nextDreams] = await Promise.all([
          listGoals(),
          dreamsRepository.list({ userId }),
        ])
        if (isMounted) {
          setGoals(nextGoals)
          setDreams(nextDreams.data)
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

  function startEditing(goal: GoalRecord) {
    setEditingGoalId(goal.id)
    setEditTitle(goal.title)
    setEditPillar(goal.pillar)
    setEditTargetValue(goal.target_value)
    setError(null)
  }

  function cancelEditing() {
    setEditingGoalId(null)
    setEditTitle('')
    setEditPillar(pillars[0])
    setEditTargetValue(10)
  }

  async function handleUpdateGoal(event: React.FormEvent) {
    event.preventDefault()

    if (!editingGoalId) {
      return
    }

    if (!editTitle.trim()) {
      setError('Dê um nome para a meta antes de salvar.')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const nextGoals = await updateGoal(editingGoalId, {
        title: editTitle,
        pillar: editPillar,
        target_value: editTargetValue,
      })

      setGoals(nextGoals)
      cancelEditing()
    } catch {
      setError('Não foi possível salvar a meta agora.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleArchive(goalId: string) {
    setError(null)
    try {
      const nextGoals = await archiveGoal(goalId)
      setGoals(nextGoals)
    } catch {
      setError('Não foi possível arquivar a meta agora.')
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

  async function refreshDreams() {
    const userId = await getActiveUserId()
    const nextDreams = await dreamsRepository.list({ userId })
    setDreams(nextDreams.data)
  }

  function startEditingDream(dream: PersistedDream) {
    setEditingDreamId(dream.id)
    setDreamDraft({
      title: dream.title,
      why: dream.why,
      deadline: dream.deadline,
      lifeArea: dream.life_area,
      priority: dream.priority,
      nextAction: dream.next_action,
    })
    setError(null)
  }

  function cancelDreamEditing() {
    setEditingDreamId(null)
    setDreamDraft(initialDreamDraft)
  }

  async function handleDreamSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!dreamDraft.title.trim()) {
      setError('Dê um nome para o sonho antes de salvar.')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const userId = await getActiveUserId()
      const payload = {
        user_id: userId,
        title: dreamDraft.title.trim(),
        why: dreamDraft.why.trim(),
        deadline: dreamDraft.deadline.trim(),
        life_area: dreamDraft.lifeArea,
        priority: dreamDraft.priority,
        progress: 0,
        status: 'active' as const,
        next_action: dreamDraft.nextAction.trim(),
      }

      if (editingDreamId) {
        await dreamsRepository.update(editingDreamId, payload)
      } else {
        await dreamsRepository.create(payload)
      }

      await refreshDreams()
      cancelDreamEditing()
    } catch {
      setError('Não foi possível salvar o sonho agora.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleArchiveDream(dreamId: string) {
    setError(null)
    try {
      await dreamsRepository.update(dreamId, { status: 'paused' })
      await refreshDreams()
    } catch {
      setError('Não foi possível arquivar o sonho agora.')
    }
  }

  async function handleDeleteDream(dreamId: string) {
    setError(null)
    try {
      await dreamsRepository.delete(dreamId)
      await refreshDreams()
    } catch {
      setError('Não foi possível excluir o sonho agora.')
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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/55">Sonhos salvos</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Visão executável</h2>
        </div>

        <Card>
          <h2 className="text-xl font-bold">{editingDreamId ? 'Editar sonho' : 'Novo sonho'}</h2>
          <form onSubmit={handleDreamSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
            <input value={dreamDraft.title} onChange={(event) => setDreamDraft((prev) => ({ ...prev, title: event.target.value }))} className={fieldClassName} placeholder="Ex.: Correr 10 km" aria-label="Título do sonho" />
            <input value={dreamDraft.deadline} onChange={(event) => setDreamDraft((prev) => ({ ...prev, deadline: event.target.value }))} className={fieldClassName} placeholder="Prazo desejado" aria-label="Prazo do sonho" />
            <select value={dreamDraft.lifeArea} onChange={(event) => setDreamDraft((prev) => ({ ...prev, lifeArea: event.target.value }))} className={selectFieldClassName} aria-label="Área da vida do sonho">
              {dreamAreas.map((area) => (
                <option key={area} value={area} className="bg-zinc-900">{area}</option>
              ))}
            </select>
            <select value={dreamDraft.priority} onChange={(event) => setDreamDraft((prev) => ({ ...prev, priority: event.target.value as DreamDraftState['priority'] }))} className={selectFieldClassName} aria-label="Prioridade do sonho">
              <option value="baixa" className="bg-zinc-900">Baixa</option>
              <option value="media" className="bg-zinc-900">Média</option>
              <option value="alta" className="bg-zinc-900">Alta</option>
            </select>
            <input value={dreamDraft.why} onChange={(event) => setDreamDraft((prev) => ({ ...prev, why: event.target.value }))} className={fieldClassName} placeholder="Por que isso importa?" aria-label="Motivo do sonho" />
            <input value={dreamDraft.nextAction} onChange={(event) => setDreamDraft((prev) => ({ ...prev, nextAction: event.target.value }))} className={fieldClassName} placeholder="Próxima ação" aria-label="Próxima ação do sonho" />
            <div className="flex flex-wrap gap-2 md:col-span-2">
              <Button type="submit" isLoading={isSaving}>{editingDreamId ? 'Salvar sonho' : 'Criar sonho'}</Button>
              {editingDreamId ? <Button type="button" variant="ghost" onClick={cancelDreamEditing}>Cancelar</Button> : null}
            </div>
          </form>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          {dreams.length === 0 ? (
            <FeedbackState variant="empty" title="Nenhum sonho salvo" description="Crie um sonho executável para conectar visão, meta e próximo passo." />
          ) : (
            dreams.map((dream) => (
              <Card key={dream.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">{dream.life_area} • {dream.priority}</p>
                    <h3 className="mt-1 text-lg font-bold">{dream.title}</h3>
                    <p className="mt-2 text-sm text-zinc-400">{dream.why}</p>
                    <p className="mt-2 text-sm text-cyan-100/80">{dream.next_action}</p>
                    <p className="mt-2 text-xs text-zinc-500">{dream.status === 'paused' ? 'Arquivado' : 'Ativo'} • {dream.deadline || 'Sem prazo'}</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <button type="button" onClick={() => startEditingDream(dream)} className="rounded-full border border-white/15 bg-white/[0.045] px-3 py-1 text-xs text-slate-300 transition-all duration-200 hover:border-cyan-300/35 hover:bg-cyan-500/10 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50">Editar</button>
                    {dream.status !== 'paused' ? (
                      <button type="button" onClick={() => void handleArchiveDream(dream.id)} className="rounded-full border border-white/15 bg-white/[0.045] px-3 py-1 text-xs text-slate-300 transition-all duration-200 hover:border-amber-300/35 hover:bg-amber-500/10 hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50">Arquivar</button>
                    ) : null}
                    <button type="button" onClick={() => void handleDeleteDream(dream.id)} className={subtleActionClassName}>Excluir</button>
                  </div>
                </div>
              </Card>
            ))
          )}
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
                    <p className="mt-1 text-xs text-zinc-500">{goal.status === 'paused' ? 'Arquivada' : goal.status === 'completed' ? 'Concluída' : 'Ativa'}</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <button type="button" onClick={() => startEditing(goal)} className="rounded-full border border-white/15 bg-white/[0.045] px-3 py-1 text-xs text-slate-300 transition-all duration-200 hover:border-cyan-300/35 hover:bg-cyan-500/10 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50">Editar</button>
                    {goal.status !== 'paused' ? (
                      <button type="button" onClick={() => void handleArchive(goal.id)} className="rounded-full border border-white/15 bg-white/[0.045] px-3 py-1 text-xs text-slate-300 transition-all duration-200 hover:border-amber-300/35 hover:bg-amber-500/10 hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50">Arquivar</button>
                    ) : null}
                    <button type="button" onClick={() => void handleDelete(goal.id)} className={subtleActionClassName}>Excluir</button>
                  </div>
                </div>

                {editingGoalId === goal.id ? (
                  <form onSubmit={handleUpdateGoal} className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 md:grid-cols-[1fr_180px_150px_auto]">
                    <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} className={fieldClassName} aria-label={`Editar nome de ${goal.title}`} />
                    <select value={editPillar} onChange={(event) => setEditPillar(event.target.value)} className={selectFieldClassName} aria-label={`Editar pilar de ${goal.title}`}>
                      {pillars.map((item) => (
                        <option key={item} value={item} className="bg-zinc-900">{item}</option>
                      ))}
                    </select>
                    <input type="number" min="1" value={editTargetValue} onChange={(event) => setEditTargetValue(Number(event.target.value))} className={fieldClassName} aria-label={`Editar alvo de ${goal.title}`} />
                    <div className="flex gap-2">
                      <Button type="submit" isLoading={isSaving} size="sm">Salvar</Button>
                      <Button type="button" variant="ghost" size="sm" onClick={cancelEditing}>Cancelar</Button>
                    </div>
                  </form>
                ) : null}

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
