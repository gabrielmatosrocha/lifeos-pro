import { createPersistenceRepository } from '@/features/persistence/repositories/repository-factory'
import type { PersistedEntity } from '@/features/persistence/types/persistence.types'
import type { GoalRecord } from '@/features/goals/types/goal.types'
import type { JournalEntry } from '@/features/journal/types/journal.types'

export type PersistedDream = PersistedEntity & {
  title: string
  why: string
  deadline: string
  life_area: string
  priority: 'alta' | 'media' | 'baixa'
  progress: number
  status: 'active' | 'paused' | 'completed' | 'at_risk'
  next_action: string
}

export type PersistedGymCheckIn = PersistedEntity & {
  date: string
  time: string
  workout: string
  notes?: string
  photo_url?: string
}

export type PersistedRunCheckIn = PersistedEntity & {
  date: string
  activity_type: 'corrida' | 'caminhada'
  distance_km: number
  duration: string
  pace: string
  notes?: string
  photo_url?: string
}

export type PersistedWorkout = PersistedEntity & {
  title: string
  date: string
  muscle_groups: string[]
  duration_minutes: number
  notes?: string
  status: 'planned' | 'completed' | 'skipped' | 'archived'
}

export const goalsPersistenceRepository = createPersistenceRepository<GoalRecord>('goals', 'goal')
export const journalPersistenceRepository = createPersistenceRepository<JournalEntry>('journal', 'journal')
export const dreamsRepository = createPersistenceRepository<PersistedDream>('dreams', 'dream')
export const gymCheckInsRepository = createPersistenceRepository<PersistedGymCheckIn>('gym_check_ins', 'gym')
export const runCheckInsRepository = createPersistenceRepository<PersistedRunCheckIn>('run_check_ins', 'run')
export const workoutsRepository = createPersistenceRepository<PersistedWorkout>('workouts', 'workout')
