import type { LifeAction, Pillar } from '@/features/actions/types/action.types'
import { getActiveUserId } from '@/features/auth/services/auth.service'

export type ActionStatus = 'completed' | 'pending'

export type DailyActionDraft = {
  title: string
  category: Pillar
  impact: number
  status: ActionStatus
  date: string
}

const STORAGE_KEY_PREFIX = 'lifeos.daily-actions'

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
  return `${STORAGE_KEY_PREFIX}:${getCurrentUserStorageId()}`
}

function getTimestamp(date: string) {
  return new Date(`${date}T12:00:00`).toISOString()
}

export async function createDailyAction(input: DailyActionDraft): Promise<LifeAction> {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

  const userId = await getActiveUserId()

  return {
    id,
    user_id: userId,
    type: 'CUSTOM_ACTION',
    pillar: input.category,
    title: input.title.trim(),
    value: Math.max(1, input.impact),
    unit: 'pts',
    occurred_at: getTimestamp(input.date),
    source: 'manual',
    notes: input.status === 'completed' ? 'Concluída' : 'Pendente',
    status: input.status,
    category: input.category,
  }
}

export function loadDailyActions(): LifeAction[] {
  if (typeof window === 'undefined') {
    return []
  }

  const stored = window.localStorage.getItem(getStorageKey())

  if (!stored) {
    return []
  }

  try {
    const parsed = JSON.parse(stored) as LifeAction[]

    if (Array.isArray(parsed)) {
      return parsed
    }
  } catch {
    window.localStorage.removeItem(getStorageKey())
  }

  return []
}

export function persistDailyActions(actions: LifeAction[]) {
  if (typeof window === 'undefined') {
    return actions
  }

  window.localStorage.setItem(getStorageKey(), JSON.stringify(actions))
  return actions
}

export async function syncDailyActions(actions: LifeAction[]) {
  persistDailyActions(actions)

  return {
    ok: true,
    actions,
  }
}
