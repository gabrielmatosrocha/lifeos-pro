import { createSupabasePersistenceAdapter } from '@/features/persistence/adapters/supabase.adapter'
import { createLocalRepository } from '@/features/persistence/repositories/local.repository'
import type { CrudRepository, PersistedEntity, PersistenceModel } from '@/features/persistence/types/persistence.types'

const STORAGE_PREFIX = 'lifeos.persistence'

function getUserScopedStorageKey(model: PersistenceModel) {
  if (typeof window === 'undefined') {
    return `${STORAGE_PREFIX}:${model}:demo`
  }

  try {
    const session = window.localStorage.getItem('lifeos.local-session')
    const parsed = session ? (JSON.parse(session) as { id?: string }) : null
    return `${STORAGE_PREFIX}:${model}:${parsed?.id ?? 'demo'}`
  } catch {
    return `${STORAGE_PREFIX}:${model}:demo`
  }
}

export function createPersistenceRepository<T extends PersistedEntity>(model: PersistenceModel, idPrefix: string): CrudRepository<T> {
  const supabase = createSupabasePersistenceAdapter()

  // Supabase is the primary planned source. Until migrations are added for each
  // model, repositories use the local implementation with the same CRUD contract.
  supabase.tableFor(model)

  return createLocalRepository<T>(getUserScopedStorageKey(model), idPrefix)
}
