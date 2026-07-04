import { createPersistenceRepository } from '@/features/persistence/repositories/repository-factory'
import type { HabitEvent, HabitRecord } from '@/features/habits/types/habit.types'

export const habitRepository = createPersistenceRepository<HabitRecord>('habits', 'habit')
export const habitEventRepository = createPersistenceRepository<HabitEvent>('habit_events', 'habit_event')
