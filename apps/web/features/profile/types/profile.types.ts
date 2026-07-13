import type { PersistedEntity } from '@/features/persistence/types/persistence.types'

export type UserPreferences = {
  theme: 'dark'
  coachEnabled: boolean
  spiritualContentEnabled: boolean
  notificationFrequency: 'low' | 'normal' | 'high'
  primaryFocus: 'saude' | 'estudo' | 'espiritualidade' | 'execucao' | 'equilibrio'
}

export type UserProfile = PersistedEntity & {
  email: string
  full_name?: string | null
  avatar_url?: string | null
  preferences: UserPreferences
}

export type ProfileDraft = {
  user_id: string
  email: string
  full_name?: string | null
  avatar_url?: string | null
  preferences?: Partial<UserPreferences>
}

export type ProfileRepository = {
  getByUserId(userId: string): Promise<UserProfile | null>
  upsert(profile: ProfileDraft): Promise<UserProfile>
}
