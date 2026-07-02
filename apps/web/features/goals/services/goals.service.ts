import type { GoalRecord, GoalStatus } from '@/features/goals/types/goal.types'
import type { SupabaseGoalRecord } from '@/features/goals/types/supabase-goal.types'
import { getActiveUserId } from '@/features/auth/services/auth.service'
import { getSupabaseClient } from '@/lib/supabase/client'

const GOALS_STORAGE_KEY_PREFIX = 'lifeos.goals'

function getCurrentUserStorageId() {
  if (typeof window === 'undefined') {
    return 'demo'
  }

  try {
    const session = window.localStorage.getItem('lifeos.local-session')
    if (!session) {
      return 'demo'
    }

    const parsed = JSON.parse(session) as { id?: string }
    return parsed.id ?? 'demo'
  } catch {
    return 'demo'
  }
}

function getStorageKey() {
  return `${GOALS_STORAGE_KEY_PREFIX}:${getCurrentUserStorageId()}`
}

export type GoalDraft = {
  title: string
  pillar: string
  horizon: string
  target_value: number
  unit: string
  status: GoalStatus
}

async function createGoalRecord(input: GoalDraft): Promise<GoalRecord> {
  const userId = await getActiveUserId()

  return {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    user_id: userId,
    title: input.title.trim(),
    pillar: input.pillar,
    horizon: input.horizon,
    target_value: Math.max(1, input.target_value),
    current_value: 0,
    unit: input.unit,
    status: input.status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

function toGoalRecord(record: SupabaseGoalRecord): GoalRecord {
  return {
    id: record.id,
    user_id: record.user_id,
    title: record.title,
    pillar: record.pillar,
    horizon: record.horizon,
    target_value: record.target_value,
    current_value: record.current_value,
    unit: record.unit,
    status: record.status,
    created_at: record.created_at,
    updated_at: record.updated_at,
  }
}

export function loadGoals(): GoalRecord[] {
  if (typeof window === 'undefined') {
    return []
  }

  const stored = window.localStorage.getItem(getStorageKey())
  if (!stored) {
    return []
  }

  try {
    const parsed = JSON.parse(stored) as GoalRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    window.localStorage.removeItem(getStorageKey())
    return []
  }
}

export function persistGoals(goals: GoalRecord[]) {
  if (typeof window === 'undefined') {
    return goals
  }

  window.localStorage.setItem(getStorageKey(), JSON.stringify(goals))
  return goals
}

export async function listGoals(): Promise<GoalRecord[]> {
  const supabase = getSupabaseClient()
  const userId = await getActiveUserId()

  if (!supabase || userId === 'demo') {
    return loadGoals()
  }

  const { data, error } = await supabase.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: false })

  if (error || !data) {
    return loadGoals()
  }

  const nextGoals = (data ?? []).map((record) => toGoalRecord(record as SupabaseGoalRecord))
  const persistedGoals = nextGoals.length > 0 ? nextGoals : loadGoals()
  persistGoals(persistedGoals)
  return persistedGoals
}

export async function createGoal(input: GoalDraft): Promise<GoalRecord[]> {
  const record = await createGoalRecord(input)
  const localGoals = [record, ...loadGoals()]
  persistGoals(localGoals)

  const supabase = getSupabaseClient()
  const userId = await getActiveUserId()

  if (!supabase || userId === 'demo') {
    return localGoals
  }

  const { data, error } = await supabase.from('goals').insert({
    user_id: record.user_id,
    title: record.title,
    pillar: record.pillar,
    horizon: record.horizon,
    target_value: record.target_value,
    current_value: record.current_value,
    unit: record.unit,
    status: record.status,
  }).select('*').single()

  if (error || !data) {
    return localGoals
  }

  const remoteRecord = toGoalRecord(data as SupabaseGoalRecord)
  const nextGoals = [remoteRecord, ...localGoals.filter((goal) => goal.id !== record.id)]
  persistGoals(nextGoals)
  return nextGoals
}

export async function updateGoalProgress(goalId: string, current_value: number): Promise<GoalRecord[]> {
  const localGoals = loadGoals().map((goal) => (goal.id === goalId ? { ...goal, current_value, updated_at: new Date().toISOString() } : goal))
  persistGoals(localGoals)

  const supabase = getSupabaseClient()
  const userId = await getActiveUserId()

  if (!supabase || userId === 'demo') {
    return localGoals
  }

  const { data, error } = await supabase
    .from('goals')
    .update({ current_value, updated_at: new Date().toISOString() })
    .eq('id', goalId)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error || !data) {
    return localGoals
  }

  const remoteRecord = toGoalRecord(data as SupabaseGoalRecord)
  const nextGoals = localGoals.map((goal) => (goal.id === goalId ? remoteRecord : goal))
  persistGoals(nextGoals)
  return nextGoals
}

export async function deleteGoal(goalId: string): Promise<GoalRecord[]> {
  const localGoals = loadGoals().filter((goal) => goal.id !== goalId)
  persistGoals(localGoals)

  const supabase = getSupabaseClient()
  const userId = await getActiveUserId()

  if (!supabase || userId === 'demo') {
    return localGoals
  }

  const { error } = await supabase.from('goals').delete().eq('id', goalId).eq('user_id', userId)

  if (error) {
    return localGoals
  }

  return localGoals
}
