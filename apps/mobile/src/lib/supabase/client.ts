import { createClient } from '@supabase/supabase-js'
import { env, hasSupabaseConfig } from '@/config/env'
import { secureStorageAdapter } from '@/features/persistence/storage/secure-storage.adapter'

export const supabase = hasSupabaseConfig()
  ? createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: true,
        storage: secureStorageAdapter,
      },
    })
  : null
