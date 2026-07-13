import { getSupabaseClient } from '@/lib/supabase/client'
import type { CrudRepository, EntityDraft, PersistedEntity, RepositoryQuery, RepositoryResult } from '@/features/persistence/types/persistence.types'

type SupabaseRow = Record<string, unknown>
type SupabaseError = { message: string } | null
type SupabaseRowsResponse = { data: SupabaseRow[] | null; error: SupabaseError }
type SupabaseRowResponse = { data: SupabaseRow | null; error: SupabaseError }
type SupabaseDeleteResponse = { error: SupabaseError }

type SupabaseSelectQuery = PromiseLike<SupabaseRowsResponse> & {
  eq(column: string, value: unknown): SupabaseSelectQuery
}

type SupabaseSingleQuery = {
  eq(column: string, value: unknown): {
    maybeSingle(): Promise<SupabaseRowResponse>
  }
}

type SupabaseTableClient = {
  select(columns: string): unknown
  insert(value: SupabaseRow): {
    select(columns: string): {
      single(): Promise<SupabaseRowResponse>
    }
  }
  update(value: SupabaseRow): {
    eq(column: string, value: unknown): {
      select(columns: string): {
        maybeSingle(): Promise<SupabaseRowResponse>
      }
    }
  }
  delete(): {
    eq(column: string, value: unknown): Promise<SupabaseDeleteResponse>
  }
}

function toEntity<T extends PersistedEntity>(row: SupabaseRow): T {
  return row as T
}

function toRows<T extends PersistedEntity>(rows: SupabaseRow[] | null): T[] {
  return (rows ?? []).map((row) => toEntity<T>(row))
}

export function createSupabaseRepository<T extends PersistedEntity>(
  table: string,
  fallback: CrudRepository<T>,
): CrudRepository<T> {
  function result<R>(data: R): RepositoryResult<R> {
    return { data, source: 'supabase' }
  }

  function getClient() {
    return getSupabaseClient()
  }

  function getTable() {
    const supabase = getClient()
    return supabase ? (supabase.from(table) as unknown as SupabaseTableClient) : null
  }

  return {
    async list(query?: RepositoryQuery<T>) {
      const tableClient = getTable()
      if (!tableClient) {
        return fallback.list(query)
      }

      let request = tableClient.select('*') as SupabaseSelectQuery
      if (query?.userId) {
        request = request.eq('user_id', query.userId)
      }

      if (query?.filter) {
        for (const [key, value] of Object.entries(query.filter)) {
          request = request.eq(key, value)
        }
      }

      const { data, error } = await request
      return error ? fallback.list(query) : result(toRows<T>(data))
    },

    async getById(id) {
      const tableClient = getTable()
      if (!tableClient) {
        return fallback.getById(id)
      }

      const request = tableClient.select('*') as SupabaseSingleQuery
      const { data, error } = await request.eq('id', id).maybeSingle()
      return error ? fallback.getById(id) : result(data ? toEntity<T>(data) : null)
    },

    async create(draft: EntityDraft<T>) {
      const tableClient = getTable()
      if (!tableClient) {
        return fallback.create(draft)
      }

      const { data, error } = await tableClient.insert(draft as SupabaseRow).select('*').single()
      return error || !data ? fallback.create(draft) : result(toEntity<T>(data))
    },

    async update(id, patch) {
      const tableClient = getTable()
      if (!tableClient) {
        return fallback.update(id, patch)
      }

      const { data, error } = await tableClient.update(patch as SupabaseRow).eq('id', id).select('*').maybeSingle()
      return error ? fallback.update(id, patch) : result(data ? toEntity<T>(data) : null)
    },

    async delete(id) {
      const tableClient = getTable()
      if (!tableClient) {
        return fallback.delete(id)
      }

      const { error } = await tableClient.delete().eq('id', id)
      return error ? fallback.delete(id) : result(true)
    },
  }
}
