export type PersistedEntity = {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
}

export type Repository<T extends PersistedEntity> = {
  list(userId: string): Promise<T[]>
  save(record: T): Promise<T>
  remove(userId: string, id: string): Promise<void>
}

export type KeyValueStorage = {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
}
