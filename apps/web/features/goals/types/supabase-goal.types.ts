import type { GoalStatus } from '@/features/goals/types/goal.types'

export type SupabaseGoalRecord = {
  id: string
  user_id: string
  title: string
  pillar: string
  horizon: string
  target_value: number
  current_value: number
  unit: string
  status: GoalStatus
  created_at?: string
  updated_at?: string
}
