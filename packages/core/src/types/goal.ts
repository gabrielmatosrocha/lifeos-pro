export type GoalStatus = 'active' | 'completed' | 'paused'
export type GoalPriority = 'baixa' | 'media' | 'alta'

export type GoalRecord = {
  id: string
  user_id: string
  title: string
  description?: string
  deadline?: string
  priority?: GoalPriority
  pillar: string
  horizon: string
  target_value: number
  current_value: number
  unit: string
  status: GoalStatus
  created_at?: string
  updated_at?: string
}

export type GoalDraft = {
  title: string
  description?: string
  deadline?: string
  priority?: GoalPriority
  pillar: string
  horizon: string
  target_value: number
  unit: string
  status: GoalStatus
}
