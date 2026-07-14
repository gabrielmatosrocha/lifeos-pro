import type { PersistedEntity } from './persistence'

export type HabitFrequency = 'daily' | 'weekly' | 'monthly'
export type HabitPriority = 'baixa' | 'media' | 'alta'
export type HabitStatus = 'active' | 'archived'
export type HabitEventStatus = 'completed' | 'skipped'

export type HabitRecord = PersistedEntity & {
  title: string
  description?: string
  frequency: HabitFrequency
  checklist: string[]
  streak: number
  best_streak: number
  weight: number
  priority: HabitPriority
  status: HabitStatus
  dream_id?: string
  memory_signal?: string
}

export type HabitEvent = PersistedEntity & {
  habit_id: string
  date: string
  status: HabitEventStatus
  note?: string
}

export type HabitDraft = Omit<HabitRecord, 'id' | 'created_at' | 'updated_at' | 'streak' | 'best_streak' | 'status'>

export type HabitSummary = {
  total: number
  active: number
  completedToday: number
  skippedToday: number
  totalWeightCompleted: number
  strongestStreak: number
}

export type HabitEngineState = {
  habits: HabitRecord[]
  events: HabitEvent[]
  summary: HabitSummary
}
