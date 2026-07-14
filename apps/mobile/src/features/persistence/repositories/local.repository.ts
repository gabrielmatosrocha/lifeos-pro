import { secureStorageAdapter } from '@/features/persistence/storage/secure-storage.adapter'
import type { PersistedEntity, Repository } from '@/features/persistence/types/persistence.types'

function keyFor(collection: string, userId: string) {
  return `lifeos.mobile.${collection}.${userId}`
}

export function createLocalRepository<T extends PersistedEntity>(collection: string): Repository<T> {
  return {
    async list(userId) {
      const stored = await secureStorageAdapter.getItem(keyFor(collection, userId))
      return stored ? (JSON.parse(stored) as T[]) : []
    },
    async save(record) {
      const records = await this.list(record.userId)
      const nextRecords = records.some((item) => item.id === record.id)
        ? records.map((item) => (item.id === record.id ? record : item))
        : [record, ...records]

      await secureStorageAdapter.setItem(keyFor(collection, record.userId), JSON.stringify(nextRecords))
      return record
    },
    async remove(userId, id) {
      const records = await this.list(userId)
      await secureStorageAdapter.setItem(
        keyFor(collection, userId),
        JSON.stringify(records.filter((record) => record.id !== id)),
      )
    },
  }
}
