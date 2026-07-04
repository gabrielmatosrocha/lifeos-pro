import type { PersistedEntity } from '@/features/persistence/types/persistence.types'

export function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export function nowIso() {
  return new Date().toISOString()
}

export function getLocalCollection<T extends PersistedEntity>(storageKey: string): T[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = window.localStorage.getItem(storageKey)
    return stored ? (JSON.parse(stored) as T[]) : []
  } catch {
    return []
  }
}

export function setLocalCollection<T extends PersistedEntity>(storageKey: string, records: T[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(storageKey, JSON.stringify(records))
}

export function matchesFilter<T extends PersistedEntity>(record: T, filter?: Partial<T>) {
  if (!filter) {
    return true
  }

  return Object.entries(filter).every(([key, value]) => record[key as keyof T] === value)
}
