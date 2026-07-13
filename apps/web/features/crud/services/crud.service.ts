import { createRun, createWorkout, deleteRun, deleteWorkout, updateRun, updateWorkout } from '@/features/activity/services/activity.service'
import type { RunRecord, WorkoutRecord } from '@/features/activity/types/activity.types'
import { archiveHabit, createHabit, deleteHabit, updateHabit } from '@/features/habits/services/habits.service'
import type { HabitDraft, HabitRecord } from '@/features/habits/types/habit.types'
import { dreamsRepository, goalsPersistenceRepository, journalPersistenceRepository } from '@/features/persistence/repositories/domain.repositories'
import type { PersistedDream } from '@/features/persistence/repositories/domain.repositories'
import type { GoalRecord } from '@/features/goals/types/goal.types'
import type { JournalEntry } from '@/features/journal/types/journal.types'

export const goalCrud = {
  create: goalsPersistenceRepository.create,
  update: goalsPersistenceRepository.update,
  delete: goalsPersistenceRepository.delete,
  archive: (id: string) => goalsPersistenceRepository.update(id, { status: 'paused' }),
  duplicate: async (goal: GoalRecord) => goalsPersistenceRepository.create({ ...goal, title: `${goal.title} (cópia)` }),
}

export const dreamCrud = {
  create: dreamsRepository.create,
  update: dreamsRepository.update,
  delete: dreamsRepository.delete,
  archive: (id: string) => dreamsRepository.update(id, { status: 'paused' }),
  duplicate: async (dream: PersistedDream) => dreamsRepository.create({ ...dream, title: `${dream.title} (cópia)` }),
}

export const journalCrud = {
  create: journalPersistenceRepository.create,
  update: journalPersistenceRepository.update,
  delete: journalPersistenceRepository.delete,
  archive: (id: string) => journalPersistenceRepository.update(id, { title: '[Arquivado]' }),
  duplicate: async (entry: JournalEntry) => journalPersistenceRepository.create({ ...entry, title: `${entry.title} (cópia)` }),
}

export const habitCrud = {
  create: (draft: HabitDraft) => createHabit(draft),
  update: (id: string, patch: Partial<HabitRecord>) => updateHabit(id, patch),
  delete: deleteHabit,
  archive: archiveHabit,
  duplicate: async (habit: HabitRecord) => createHabit({ ...habit, title: `${habit.title} (cópia)` }),
}

export const workoutCrud = {
  create: createWorkout,
  update: updateWorkout,
  delete: deleteWorkout,
  archive: (id: string) => updateWorkout(id, { status: 'archived' }),
  duplicate: async (workout: WorkoutRecord) => createWorkout({ ...workout, title: `${workout.title} (cópia)` }),
}

export const runCrud = {
  create: createRun,
  update: updateRun,
  delete: deleteRun,
  archive: (id: string) => updateRun(id, { status: 'planned' }),
  duplicate: async (run: RunRecord) => createRun({ ...run, date: new Date().toISOString().slice(0, 10) }),
}
