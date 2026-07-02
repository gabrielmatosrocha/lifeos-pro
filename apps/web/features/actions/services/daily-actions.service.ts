import type { LifeAction } from '@/features/actions/types/action.types'
import type { DailyActionRecord } from '@/features/actions/types/supabase-action.types'
import { getActiveUserId } from '@/features/auth/services/auth.service'
import { getSupabaseClient } from '@/lib/supabase/client'
import { loadDailyActions, persistDailyActions } from '@/features/actions/services/action.service'

function toLifeAction(record: DailyActionRecord): LifeAction {
  return {
    id: record.id,
    user_id: record.user_id,
    type: record.type,
    pillar: record.pillar,
    title: record.title,
    value: record.value,
    unit: record.unit,
    occurred_at: record.occurred_at,
    source: record.source,
    notes: record.notes,
    status: record.status ?? 'pending',
    category: record.category ?? record.pillar,
  }
}

export async function listDailyActionsByDate(date: string) {
  const supabase = getSupabaseClient()
  const userId = await getActiveUserId()

  if (!supabase || userId === 'demo') {
    return loadDailyActions().filter((action) => action.occurred_at.startsWith(date))
  }

  const { data, error } = await supabase
    .from('actions')
    .select('*')
    .eq('user_id', userId)
    .gte('occurred_at', `${date}T00:00:00.000Z`)
    .lt('occurred_at', `${date}T23:59:59.999Z`)
    .order('occurred_at', { ascending: false })

  if (error) {
    return loadDailyActions().filter((action) => action.occurred_at.startsWith(date))
  }

  return (data ?? []).map(toLifeAction)
}

export async function createDailyActionRecord(action: LifeAction) {
  const supabase = getSupabaseClient()
  const userId = await getActiveUserId()

  if (!supabase || userId === 'demo') {
    const stored = loadDailyActions()
    const next = [action, ...stored]
    persistDailyActions(next)
    return action
  }

  const { data, error } = await supabase.from('actions').insert({
    id: action.id,
    user_id: userId,
    type: action.type,
    pillar: action.pillar,
    title: action.title,
    value: action.value,
    unit: action.unit,
    occurred_at: action.occurred_at,
    source: action.source,
    notes: action.notes,
  }).select('*').single()

  if (error || !data) {
    const stored = loadDailyActions()
    const next = [action, ...stored]
    persistDailyActions(next)
    return action
  }

  return toLifeAction(data as DailyActionRecord)
}

export async function updateDailyActionStatus(actionId: string, status: 'completed' | 'pending') {
  const supabase = getSupabaseClient()
  const userId = await getActiveUserId()

  if (!supabase || userId === 'demo') {
    const stored = loadDailyActions()
    const next = stored.map((action) =>
      action.id === actionId ? { ...action, status, notes: status === 'completed' ? 'Concluída' : 'Pendente' } : action,
    )
    persistDailyActions(next)
    return next.find((action) => action.id === actionId) ?? null
  }

  const { data, error } = await supabase
    .from('actions')
    .update({ notes: status === 'completed' ? 'Concluída' : 'Pendente' })
    .eq('id', actionId)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error || !data) {
    return null
  }

  return toLifeAction(data as DailyActionRecord)
}

export async function deleteDailyAction(actionId: string) {
  const supabase = getSupabaseClient()
  const userId = await getActiveUserId()

  if (!supabase || userId === 'demo') {
    const stored = loadDailyActions()
    const next = stored.filter((action) => action.id !== actionId)
    persistDailyActions(next)
    return true
  }

  const { error } = await supabase.from('actions').delete().eq('id', actionId).eq('user_id', userId)

  if (error) {
    return false
  }

  return true
}
