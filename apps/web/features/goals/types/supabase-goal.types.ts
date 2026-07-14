import type { GoalPriority, GoalStatus } from '@/features/goals/types/goal.types'

export type SupabaseGoalRecord = {
  id: string
  user_id: string
  title: string
  description?: string | null
  deadline?: string | null
  priority?: GoalPriority | null
  pillar: string
  horizon: string
  target_value: number
  current_value: number
  unit: string
  status: GoalStatus
  created_at?: string
  updated_at?: string
}
