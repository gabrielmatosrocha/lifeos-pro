import type { CrudRepository, EntityDraft, KeyValueStorage, PersistedEntity, RepositoryQuery, RepositoryResult } from '../types/persistence'
import { createId } from '../utils/id'
import { nowIso } from '../utils/date'

function matchesFilter<T extends PersistedEntity>(record: T, filter?: Partial<T>) {
  if (!filter) {
    return true
  }

  return Object.entries(filter).every(([key, value]) => record[key as keyof T] === value)
}

export function createKeyValueRepository<T extends PersistedEntity>(
  storage: KeyValueStorage,
  storageKey: string,
  idPrefix: string,
): CrudRepository<T> {
  async function readRecords() {
    const stored = await storage.getItem(storageKey)
    return stored ? (JSON.parse(stored) as T[]) : []
  }

  async function writeRecords(records: T[]) {
    await storage.setItem(storageKey, JSON.stringify(records))
  }

  function result<R>(data: R): RepositoryResult<R> {
    return { data, source: 'local' }
  }

  async function listRecords(query?: RepositoryQuery<T>) {
    const records = await readRecords()
    return records.filter((record) => {
      const userMatches = query?.userId ? record.user_id === query.userId : true
      return userMatches && matchesFilter(record, query?.filter)
    })
  }

  return {
    async list(query) {
      return result(await listRecords(query))
    },
    async getById(id) {
      return result((await readRecords()).find((record) => record.id === id) ?? null)
    },
    async create(draft: EntityDraft<T>) {
      const timestamp = nowIso()
      const record = {
        ...draft,
        id: createId(idPrefix),
        created_at: timestamp,
        updated_at: timestamp,
      } as T
      await writeRecords([record, ...(await readRecords())])
      return result(record)
    },
    async update(id, patch) {
      const timestamp = nowIso()
      const records = await readRecords()
      let updated: T | null = null
      const nextRecords = records.map((record) => {
        if (record.id !== id) {
          return record
        }

        updated = { ...record, ...patch, updated_at: timestamp } as T
        return updated
      })

      await writeRecords(nextRecords)
      return result(updated)
    },
    async delete(id) {
      const records = await readRecords()
      const nextRecords = records.filter((record) => record.id !== id)
      await writeRecords(nextRecords)
      return result(nextRecords.length !== records.length)
    },
  }
}
