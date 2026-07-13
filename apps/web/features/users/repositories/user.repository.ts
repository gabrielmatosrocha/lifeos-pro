import { getActiveUserId, getCurrentUser } from '@/features/auth/services/auth.service'
import type { UserRepository } from '@/features/users/types/user.types'

export function createUserRepository(): UserRepository {
  return {
    async getCurrent() {
      return getCurrentUser()
    },

    async getCurrentId() {
      return getActiveUserId()
    },
  }
}
