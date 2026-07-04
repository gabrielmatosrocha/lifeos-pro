import { createPersistenceRepository } from '@/features/persistence/repositories/repository-factory'
import type { RunRecord, WorkoutRecord } from '@/features/activity/types/activity.types'

export const workoutRepository = createPersistenceRepository<WorkoutRecord>('workouts', 'workout')
export const runRepository = createPersistenceRepository<RunRecord>('activity_sessions', 'activity')
