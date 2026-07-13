import type { ActivityEngineState } from '@/features/activity/types/activity.types'
import type { HabitEngineState } from '@/features/habits/types/habit.types'
import type { LifeReviewSummary } from '@/features/reviews/types/review.types'

export function getWeeklyReview(input: {
  habits: HabitEngineState
  activity: ActivityEngineState
  lifeScore: number
}): LifeReviewSummary {
  const habitWin = `${input.habits.summary.completedToday}/${input.habits.summary.active} hábitos ativos com progresso hoje`
  const activityWin = `${input.activity.summary.weeklyWorkouts} treinos e ${input.activity.summary.totalDistanceKm} km registrados`
  const lowScoreRisk = input.lifeScore < 55 ? 'Life Score abaixo do ideal pede foco no básico.' : 'Evitar adicionar complexidade antes de consolidar o ritmo.'

  return {
    id: 'review-weekly-current',
    period: 'weekly',
    title: 'Resumo da semana',
    summary: 'Seu painel mostra sinais suficientes para orientar a próxima ação sem depender de IA real.',
    wins: [habitWin, activityWin],
    risks: [lowScoreRisk],
    nextStep: 'Escolha uma missão simples e conclua antes de abrir novas frentes.',
  }
}
