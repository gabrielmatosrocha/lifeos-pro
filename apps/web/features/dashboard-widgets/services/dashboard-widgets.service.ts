import type { ActivityEngineState } from '@/features/activity/types/activity.types'
import type { CoachAdvice } from '@/features/coach/types/coach.types'
import type { DreamEngineMock } from '@/features/dreams/types/dream.types'
import type { EvolutionHistory } from '@/features/evolution/types/evolution.types'
import type { HabitEngineState } from '@/features/habits/types/habit.types'
import type { MemoryEngineMock } from '@/features/memory/types/memory.types'
import type { LifeReviewSummary } from '@/features/reviews/types/review.types'
import type { DashboardWidget } from '@/features/dashboard-widgets/types/dashboard-widget.types'
import type { JournalEntry } from '@/features/journal/types/journal.types'

export function getDashboardWidgets(input: {
  lifeScore: number
  rhythmIndex: number
  habits: HabitEngineState
  activity: ActivityEngineState
  dreams: DreamEngineMock
  memory: MemoryEngineMock
  evolution: EvolutionHistory
  advice: CoachAdvice | null
  review: LifeReviewSummary | null
  journalEntries: JournalEntry[]
}): DashboardWidget[] {
  const nextDream = input.dreams.dreams.find((dream) => dream.status === 'active') ?? input.dreams.dreams[0]
  const todayEvolution = input.evolution.periods.find((period) => period.id === 'today')
  const spiritualMemory = input.memory.memories.find((memory) => memory.category === 'espiritualidade')
  const lastJournal = input.journalEntries[0]
  const nextRun = input.activity.runs.find((run) => run.kind === 'corrida') ?? input.activity.runs[0]
  const nextWorkout = input.activity.workouts[0]

  const widgets: DashboardWidget[] = [
    {
      id: 'widget-today',
      kind: 'today',
      title: 'Hoje',
      value: `${input.rhythmIndex}/100`,
      description: `Life Score ${input.lifeScore}/100 com ${input.habits.summary.completedToday} hábitos concluídos.`,
      priority: 1,
    },
    {
      id: 'widget-coach',
      kind: 'coach',
      title: 'Conselho do Coach',
      value: input.advice?.domain ?? 'estratégia',
      description: input.advice?.action ?? 'Concluir uma ação pequena para ativar ritmo.',
      priority: 2,
    },
    {
      id: 'widget-next-goal',
      kind: 'next-goal',
      title: 'Próxima meta',
      value: nextDream ? `${nextDream.progress}%` : '0%',
      description: nextDream?.nextAction ?? 'Definir a próxima ação executável.',
      priority: 3,
    },
    {
      id: 'widget-pending-habits',
      kind: 'pending-habits',
      title: 'Hábitos pendentes',
      value: `${Math.max(0, input.habits.summary.active - input.habits.summary.completedToday)}`,
      description: 'Missões do dia geradas pelo Habits Engine.',
      priority: 4,
    },
    {
      id: 'widget-workout',
      kind: 'workout',
      title: 'Treino do dia',
      value: nextWorkout?.title ?? 'Planejar',
      description: nextWorkout ? `${nextWorkout.duration_minutes} min • ${nextWorkout.muscle_groups.join(' + ')}` : 'Nenhum treino registrado.',
      priority: 5,
    },
    {
      id: 'widget-run',
      kind: 'run',
      title: 'Corrida sugerida',
      value: nextRun ? `${nextRun.distance_km} km` : 'Leve',
      description: nextRun?.pace ? `${nextRun.kind} em ${nextRun.pace}` : 'Caminhada leve para manter consistência.',
      priority: 6,
    },
    {
      id: 'widget-review',
      kind: 'weekly-review',
      title: 'Resumo da semana',
      value: todayEvolution?.comparison ?? 'em leitura',
      description: input.review?.summary ?? todayEvolution?.summary ?? 'Acompanhando evolução.',
      priority: 7,
    },
    {
      id: 'widget-spiritual',
      kind: 'spiritual',
      title: 'Resumo espiritual',
      value: spiritualMemory ? 'ativo' : 'configurar',
      description: spiritualMemory?.description ?? 'Conteúdo espiritual permanece configurável.',
      priority: 8,
    },
    {
      id: 'widget-journal',
      kind: 'journal',
      title: 'Último diário',
      value: lastJournal?.mood ?? 'sem registro',
      description: lastJournal?.title ?? 'Registrar uma reflexão curta ajuda o Coach futuro.',
      priority: 9,
    },
    {
      id: 'widget-streak',
      kind: 'streak',
      title: 'Streak',
      value: `${input.habits.summary.strongestStreak} dias`,
      description: 'Maior sequência ativa do Habits Engine.',
      priority: 10,
    },
    {
      id: 'widget-achievement',
      kind: 'achievement',
      title: 'Próxima conquista',
      value: `${input.activity.summary.weeklyWorkouts} treinos`,
      description: 'Sustentar o ritmo físico desta semana.',
      priority: 11,
    },
    {
      id: 'widget-milestone',
      kind: 'milestone',
      title: 'Próximo marco',
      value: nextDream?.deadline ?? 'este ciclo',
      description: nextDream?.title ?? 'Transformar intenção em execução.',
      priority: 12,
    },
  ]

  return widgets.sort((a, b) => a.priority - b.priority)
}
