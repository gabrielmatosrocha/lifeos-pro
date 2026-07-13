import { getSupabaseClient } from '@/lib/supabase/client'
import type { AuthRepository, AuthResult, AuthUser, PasswordResetResult } from '@/features/auth/types/auth.types'

const LOCAL_USERS_KEY = 'lifeos.local-users'
const LOCAL_SESSION_KEY = 'lifeos.local-session'
const AUTH_REQUEST_TIMEOUT_MS = 2500

type LocalUser = AuthUser & {
  password: string
}

function getLocalStorage() {
  return typeof window === 'undefined' ? null : window.localStorage
}

function readLocalUsers(): LocalUser[] {
  const storage = getLocalStorage()
  if (!storage) {
    return []
  }

  try {
    const parsed = storage.getItem(LOCAL_USERS_KEY)
    return parsed ? (JSON.parse(parsed) as LocalUser[]) : []
  } catch {
    return []
  }
}

function writeLocalUsers(users: LocalUser[]) {
  getLocalStorage()?.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
}

function readLocalSession(): AuthUser | null {
  const storage = getLocalStorage()
  if (!storage) {
    return null
  }

  try {
    const parsed = storage.getItem(LOCAL_SESSION_KEY)
    return parsed ? (JSON.parse(parsed) as AuthUser) : null
  } catch {
    return null
  }
}

function writeLocalSession(session: AuthUser | null) {
  const storage = getLocalStorage()
  if (!storage) {
    return
  }

  if (!session) {
    storage.removeItem(LOCAL_SESSION_KEY)
    return
  }

  storage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session))
}

function createLocalUserId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizeUser(user: { id: string; email?: string | null }): AuthUser {
  return { id: user.id, email: user.email ?? '' }
}

async function withAuthTimeout<T>(request: Promise<T>) {
  return Promise.race([
    request,
    new Promise<null>((resolve) => {
      window.setTimeout(() => resolve(null), AUTH_REQUEST_TIMEOUT_MS)
    }),
  ])
}

export function createAuthRepository(): AuthRepository {
  return {
    async getCurrentUser() {
      const supabase = getSupabaseClient()

      if (!supabase) {
        return readLocalSession()
      }

      const result = await withAuthTimeout(supabase.auth.getUser())
      if (!result) {
        return readLocalSession()
      }

      const { data: { user }, error } = result
      if (error || !user) {
        return readLocalSession()
      }

      return normalizeUser(user)
    },

    async getActiveUserId() {
      const user = await this.getCurrentUser()
      return user?.id ?? 'demo'
    },

    async signInWithPassword(email, password): Promise<AuthResult> {
      const supabase = getSupabaseClient()

      if (!supabase) {
        const match = readLocalUsers().find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password)
        if (!match) {
          return { data: null, error: { message: 'E-mail ou senha inválidos.' } }
        }

        const session = { id: match.id, email: match.email }
        writeLocalSession(session)
        return { data: { user: session }, error: null }
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      return {
        data: { user: data.user ? normalizeUser(data.user) : null },
        error: error ? { message: error.message } : null,
      }
    },

    async signUpWithPassword(email, password): Promise<AuthResult> {
      const supabase = getSupabaseClient()

      if (!supabase) {
        const users = readLocalUsers()
        if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
          return { data: null, error: { message: 'Este e-mail já está cadastrado.' } }
        }

        const nextUser: LocalUser = { id: createLocalUserId(), email, password }
        writeLocalUsers([...users, nextUser])
        writeLocalSession({ id: nextUser.id, email: nextUser.email })
        return { data: { user: { id: nextUser.id, email: nextUser.email } }, error: null }
      }

      const { data, error } = await supabase.auth.signUp({ email, password })
      return {
        data: { user: data.user ? normalizeUser(data.user) : null },
        error: error ? { message: error.message } : null,
      }
    },

    async sendPasswordReset(email): Promise<PasswordResetResult> {
      const supabase = getSupabaseClient()

      if (!supabase) {
        const exists = readLocalUsers().some((user) => user.email.toLowerCase() === email.toLowerCase())
        return exists ? { error: null } : { error: { message: 'E-mail não encontrado no fallback local.' } }
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email)
      return { error: error ? { message: error.message } : null }
    },

    async signOut(): Promise<PasswordResetResult> {
      const supabase = getSupabaseClient()
      writeLocalSession(null)

      if (!supabase) {
        return { error: null }
      }

      const { error } = await supabase.auth.signOut()
      return { error: error ? { message: error.message } : null }
    },
  }
}
