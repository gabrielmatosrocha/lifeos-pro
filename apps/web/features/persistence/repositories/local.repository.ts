import { createId, getLocalCollection, matchesFilter, nowIso, setLocalCollection } from '@/features/persistence/storage/local-storage.adapter'
import type { CrudRepository, EntityDraft, PersistedEntity, RepositoryQuery, RepositoryResult } from '@/features/persistence/types/persistence.types'

export function createLocalRepository<T extends PersistedEntity>(storageKey: string, idPrefix: string): CrudRepository<T> {
  function result<R>(data: R): RepositoryResult<R> {
    return { data, source: 'local' }
  }

  function listRecords(query?: RepositoryQuery<T>) {
    const records = getLocalCollection<T>(storageKey)
    return records.filter((record) => {
      const userMatches = query?.userId ? record.user_id === query.userId : true
      return userMatches && matchesFilter(record, query?.filter)
    })
  }

  return {
    async list(query) {
      return result(listRecords(query))
    },

    async getById(id) {
      return result(getLocalCollection<T>(storageKey).find((record) => record.id === id) ?? null)
    },

    async create(draft: EntityDraft<T>) {
      const timestamp = nowIso()
      const record = {
        ...draft,
        id: createId(idPrefix),
        created_at: timestamp,
        updated_at: timestamp,
      } as T
      const records = [record, ...getLocalCollection<T>(storageKey)]
      setLocalCollection(storageKey, records)
      return result(record)
    },

    async update(id, patch) {
      const timestamp = nowIso()
      const records = getLocalCollection<T>(storageKey)
      let updated: T | null = null
      const nextRecords = records.map((record) => {
        if (record.id !== id) {
          return record
        }

        updated = { ...record, ...patch, updated_at: timestamp } as T
        return updated
      })

      setLocalCollection(storageKey, nextRecords)
      return result(updated)
    },

    async delete(id) {
      const records = getLocalCollection<T>(storageKey)
      const nextRecords = records.filter((record) => record.id !== id)
      setLocalCollection(storageKey, nextRecords)
      return result(nextRecords.length !== records.length)
    },
  }
}
