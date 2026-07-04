import { habitEventRepository, habitRepository } from '@/features/habits/repositories/habit.repository'
import type { HabitDraft, HabitEngineState, HabitEvent, HabitRecord, HabitSummary } from '@/features/habits/types/habit.types'

const DEMO_USER_ID = 'demo'

export const demoHabits: HabitRecord[] = [
  {
    id: 'habit-water',
    user_id: DEMO_USER_ID,
    title: 'Beber água',
    description: 'Base simples para energia e clareza.',
    frequency: 'daily',
    checklist: ['2 litros no dia', 'Um copo ao acordar'],
    streak: 8,
    best_streak: 14,
    weight: 6,
    priority: 'alta',
    status: 'active',
    memory_signal: 'Saúde responde bem a hábitos simples.',
  },
  {
    id: 'habit-study',
    user_id: DEMO_USER_ID,
    title: 'Estudar com foco',
    description: 'Bloco curto para sustentar metas de conhecimento.',
    frequency: 'daily',
    checklist: ['30 minutos', 'Anotar uma ideia aplicável'],
    streak: 3,
    best_streak: 9,
    weight: 8,
    priority: 'alta',
    status: 'active',
    dream_id: 'dream-course',
  },
  {
    id: 'habit-review',
    user_id: DEMO_USER_ID,
    title: 'Revisão semanal',
    description: 'Olhar metas, diário e evolução antes da próxima semana.',
    frequency: 'weekly',
    checklist: ['Revisar metas', 'Escolher foco da semana'],
    streak: 2,
    best_streak: 5,
    weight: 7,
    priority: 'media',
    status: 'active',
  },
]

export const demoHabitEvents: HabitEvent[] = [
  { id: 'habit-event-water', user_id: DEMO_USER_ID, habit_id: 'habit-water', date: new Date().toISOString().slice(0, 10), status: 'completed' },
  { id: 'habit-event-study', user_id: DEMO_USER_ID, habit_id: 'habit-study', date: new Date().toISOString().slice(0, 10), status: 'skipped' },
]

function today() {
  return new Date().toISOString().slice(0, 10)
}

function calculateSummary(habits: HabitRecord[], events: HabitEvent[], date = today()): HabitSummary {
  const todayEvents = events.filter((event) => event.date === date)
  const completedIds = new Set(todayEvents.filter((event) => event.status === 'completed').map((event) => event.habit_id))
  const skippedIds = new Set(todayEvents.filter((event) => event.status === 'skipped').map((event) => event.habit_id))

  return {
    total: habits.length,
    active: habits.filter((habit) => habit.status === 'active').length,
    completedToday: completedIds.size,
    skippedToday: skippedIds.size,
    totalWeightCompleted: habits.filter((habit) => completedIds.has(habit.id)).reduce((sum, habit) => sum + habit.weight, 0),
    strongestStreak: Math.max(0, ...habits.map((habit) => habit.streak)),
  }
}

export async function getHabitEngineState(userId = DEMO_USER_ID): Promise<HabitEngineState> {
  const habitsResult = await habitRepository.list({ userId })
  const eventsResult = await habitEventRepository.list({ userId })
  const habits = habitsResult.data.length > 0 ? habitsResult.data : demoHabits
  const events = eventsResult.data.length > 0 ? eventsResult.data : demoHabitEvents

  return {
    habits,
    events,
    summary: calculateSummary(habits, events),
  }
}

export async function createHabit(draft: HabitDraft) {
  return habitRepository.create({
    ...draft,
    streak: 0,
    best_streak: 0,
    status: 'active',
  })
}

export async function updateHabit(id: string, patch: Partial<HabitRecord>) {
  return habitRepository.update(id, patch)
}

export async function archiveHabit(id: string) {
  return habitRepository.update(id, { status: 'archived' })
}

export async function deleteHabit(id: string) {
  return habitRepository.delete(id)
}

export async function completeHabit(habit: HabitRecord, date = today()) {
  const event = await habitEventRepository.create({
    user_id: habit.user_id,
    habit_id: habit.id,
    date,
    status: 'completed',
  })

  await habitRepository.update(habit.id, {
    streak: habit.streak + 1,
    best_streak: Math.max(habit.best_streak, habit.streak + 1),
  })

  return event
}

export async function skipHabit(habit: HabitRecord, date = today()) {
  const event = await habitEventRepository.create({
    user_id: habit.user_id,
    habit_id: habit.id,
    date,
    status: 'skipped',
  })

  await habitRepository.update(habit.id, { streak: 0 })
  return event
}

export function getHabitLifeEngineSignals(state: HabitEngineState) {
  return {
    completedHabits: state.summary.completedToday,
    skippedHabits: state.summary.skippedToday,
    consistencyWeight: state.summary.totalWeightCompleted,
    strongestStreak: state.summary.strongestStreak,
  }
}
