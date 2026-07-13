export type PersistenceSource = 'supabase' | 'local'

export type PersistedEntity = {
  id: string
  user_id: string
  created_at?: string
  updated_at?: string
}

export type RepositoryResult<T> = {
  data: T
  source: PersistenceSource
}

export type EntityDraft<T extends PersistedEntity> = Omit<T, 'id' | 'created_at' | 'updated_at'>

export type RepositoryQuery<T extends PersistedEntity> = {
  userId?: string
  filter?: Partial<T>
}

export type CrudRepository<T extends PersistedEntity> = {
  list(query?: RepositoryQuery<T>): Promise<RepositoryResult<T[]>>
  getById(id: string): Promise<RepositoryResult<T | null>>
  create(draft: EntityDraft<T>): Promise<RepositoryResult<T>>
  update(id: string, patch: Partial<Omit<T, 'id' | 'created_at'>>): Promise<RepositoryResult<T | null>>
  delete(id: string): Promise<RepositoryResult<boolean>>
}

export type PersistenceModel =
  | 'goals'
  | 'dreams'
  | 'journal'
  | 'gym_check_ins'
  | 'run_check_ins'
  | 'workouts'
  | 'habits'
  | 'habit_events'
  | 'activity_sessions'
  | 'profiles'
