import { getSupabaseClient } from '@/lib/supabase/client'
import { createPersistenceRepository } from '@/features/persistence/repositories/repository-factory'
import type { ProfileDraft, UserPreferences, UserProfile } from '@/features/profile/types/profile.types'

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  coachEnabled: true,
  spiritualContentEnabled: true,
  notificationFrequency: 'normal',
  primaryFocus: 'equilibrio',
}

const localProfileRepository = createPersistenceRepository<UserProfile>('profiles', 'profile')

function normalizePreferences(preferences?: Partial<UserPreferences>): UserPreferences {
  return {
    ...defaultPreferences,
    ...preferences,
    theme: 'dark',
  }
}

function normalizeProfile(row: {
  id?: string
  user_id?: string
  email?: string | null
  full_name?: string | null
  avatar_url?: string | null
  preferences?: Partial<UserPreferences> | null
  created_at?: string
  updated_at?: string
}): UserProfile {
  const userId = row.user_id ?? row.id ?? 'demo'

  return {
    id: row.id ?? userId,
    user_id: userId,
    email: row.email ?? '',
    full_name: row.full_name ?? null,
    avatar_url: row.avatar_url ?? null,
    preferences: normalizePreferences(row.preferences ?? undefined),
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export function createProfileRepository() {
  return {
    async getByUserId(userId: string) {
      const supabase = getSupabaseClient()

      if (supabase) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        if (!error && data) {
          return normalizeProfile(data)
        }
      }

      const local = await localProfileRepository.list({ userId })
      return local.data[0] ?? null
    },

    async upsert(profile: ProfileDraft) {
      const nextProfile = normalizeProfile({
        id: profile.user_id,
        user_id: profile.user_id,
        email: profile.email,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        preferences: profile.preferences,
      })
      const supabase = getSupabaseClient()

      if (supabase) {
        const { data, error } = await supabase
          .from('profiles')
          .upsert({
            id: nextProfile.user_id,
            email: nextProfile.email,
            full_name: nextProfile.full_name,
            avatar_url: nextProfile.avatar_url,
            preferences: nextProfile.preferences,
          })
          .select('*')
          .single()

        if (!error && data) {
          return normalizeProfile(data)
        }
      }

      const existing = await localProfileRepository.list({ userId: nextProfile.user_id })
      if (existing.data[0]) {
        const updated = await localProfileRepository.update(existing.data[0].id, nextProfile)
        return updated.data ?? nextProfile
      }

      const created = await localProfileRepository.create(nextProfile)
      return created.data
    },
  }
}
