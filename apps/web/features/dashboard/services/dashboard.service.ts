import { loadDailyActions } from '@/features/actions/services/action.service'
import { listDailyActionsByDate } from '@/features/actions/services/daily-actions.service'
import { listGoals } from '@/features/goals/services/goals.service'
import { listJournalEntries } from '@/features/journal/services/journal.service'
import { runLifeEngine } from '@/features/life-engine/services/life-engine.service'
import type { LifeAction } from '@/features/actions/types/action.types'
import type { GoalRecord } from '@/features/goals/types/goal.types'
import type { JournalEntry } from '@/features/journal/types/journal.types'

export type DashboardSummary = {
  actions: LifeAction[]
  goals: GoalRecord[]
  journalEntries: JournalEntry[]
  summary: ReturnType<typeof runLifeEngine>
  completedCount: number
  pendingCount: number
  activeGoalCount: number
  journalEntryCount: number
}

export async function getDashboardSummary(date = new Date().toISOString().slice(0, 10)): Promise<DashboardSummary> {
  const localActions = loadDailyActions()
  const localTodayActions = localActions.filter((action) => action.occurred_at.startsWith(date))

  const remoteActions = await listDailyActionsByDate(date)
  const actions = remoteActions.length > 0 ? remoteActions : localTodayActions
  const goals = await listGoals()
  const journalEntries = await listJournalEntries()

  const summary = runLifeEngine(actions)

  return {
    actions,
    goals,
    journalEntries,
    summary,
    completedCount: actions.filter((action) => action.status === 'completed').length,
    pendingCount: actions.filter((action) => action.status !== 'completed').length,
    activeGoalCount: goals.filter((goal) => goal.status === 'active').length,
    journalEntryCount: journalEntries.length,
  }
}
