import { supabase } from '@/lib/supabase/client'
import { secureStorageAdapter } from '@/features/persistence/storage/secure-storage.adapter'
import type { AuthResult, AuthService, AuthUser } from '@/features/auth/types/auth.types'

const LOCAL_USERS_KEY = 'lifeos.mobile.local-users'
const LOCAL_SESSION_KEY = 'lifeos.mobile.local-session'

type LocalUser = AuthUser & {
  password: string
}

function createId() {
  return `mobile-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizeUser(user: { id: string; email?: string | null }): AuthUser {
  return {
    id: user.id,
    email: user.email ?? '',
  }
}

async function readLocalUsers() {
  const stored = await secureStorageAdapter.getItem(LOCAL_USERS_KEY)
  return stored ? (JSON.parse(stored) as LocalUser[]) : []
}

async function writeLocalUsers(users: LocalUser[]) {
  await secureStorageAdapter.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
}

async function readLocalSession() {
  const stored = await secureStorageAdapter.getItem(LOCAL_SESSION_KEY)
  return stored ? (JSON.parse(stored) as AuthUser) : null
}

async function writeLocalSession(user: AuthUser | null) {
  if (!user) {
    await secureStorageAdapter.removeItem(LOCAL_SESSION_KEY)
    return
  }

  await secureStorageAdapter.setItem(LOCAL_SESSION_KEY, JSON.stringify(user))
}

export const authService: AuthService = {
  async getCurrentUser() {
    if (!supabase) {
      return readLocalSession()
    }

    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) {
      return readLocalSession()
    }

    return normalizeUser(data.user)
  },

  async signIn(email, password): Promise<AuthResult> {
    if (!supabase) {
      const users = await readLocalUsers()
      const match = users.find(
        (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
      )

      if (!match) {
        return { user: null, error: 'E-mail ou senha invalidos.' }
      }

      const user = { id: match.id, email: match.email }
      await writeLocalSession(user)
      return { user, error: null }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { user: null, error: error.message }
    }

    return { user: data.user ? normalizeUser(data.user) : null, error: null }
  },

  async signUp(email, password): Promise<AuthResult> {
    if (!supabase) {
      const users = await readLocalUsers()
      const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase())

      if (exists) {
        return { user: null, error: 'Este e-mail ja esta cadastrado.' }
      }

      const nextUser = { id: createId(), email, password }
      await writeLocalUsers([...users, nextUser])
      await writeLocalSession({ id: nextUser.id, email: nextUser.email })
      return { user: { id: nextUser.id, email: nextUser.email }, error: null }
    }

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      return { user: null, error: error.message }
    }

    return { user: data.user ? normalizeUser(data.user) : null, error: null }
  },

  async signOut() {
    await writeLocalSession(null)
    await supabase?.auth.signOut()
  },
}
