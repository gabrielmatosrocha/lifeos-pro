import { getSupabaseClient } from '@/lib/supabase/client'
import type { PersistenceModel } from '@/features/persistence/types/persistence.types'

export type SupabasePersistenceAdapter = {
  isAvailable(): boolean
  tableFor(model: PersistenceModel): string
}

const tableMap: Record<PersistenceModel, string> = {
  goals: 'goals',
  dreams: 'dreams',
  journal: 'journal_entries',
  gym_check_ins: 'gym_check_ins',
  run_check_ins: 'run_check_ins',
  workouts: 'workouts',
  habits: 'habits',
  habit_events: 'habit_events',
  activity_sessions: 'activity_sessions',
}

export function createSupabasePersistenceAdapter(): SupabasePersistenceAdapter {
  return {
    isAvailable() {
      return getSupabaseClient() !== null
    },

    tableFor(model) {
      return tableMap[model]
    },
  }
}
