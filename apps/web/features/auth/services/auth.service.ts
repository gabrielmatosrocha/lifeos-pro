import { getSupabaseClient } from '@/lib/supabase/client'

const LOCAL_USERS_KEY = 'lifeos.local-users'
const LOCAL_SESSION_KEY = 'lifeos.local-session'

type LocalUser = {
  id: string
  email: string
  password: string
}

type LocalSession = {
  id: string
  email: string
}

function getLocalStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
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
  const storage = getLocalStorage()
  if (!storage) {
    return
  }

  storage.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
}

function readLocalSession(): LocalSession | null {
  const storage = getLocalStorage()
  if (!storage) {
    return null
  }

  try {
    const parsed = storage.getItem(LOCAL_SESSION_KEY)
    return parsed ? (JSON.parse(parsed) as LocalSession) : null
  } catch {
    return null
  }
}

function writeLocalSession(session: LocalSession | null) {
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

export async function getActiveUserId() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    const session = readLocalSession()
    return session?.id ?? 'demo'
  }

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    const session = readLocalSession()
    return session?.id ?? 'demo'
  }

  return user.id
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = getSupabaseClient()

  if (!supabase) {
    const users = readLocalUsers()
    const match = users.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password)

    if (!match) {
      return {
        data: null,
        error: { message: 'E-mail ou senha inválidos.' },
      }
    }

    const session = { id: match.id, email: match.email }
    writeLocalSession(session)

    return {
      data: { user: { id: match.id, email: match.email } },
      error: null,
    }
  }

  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithPassword(email: string, password: string) {
  const supabase = getSupabaseClient()

  if (!supabase) {
    const users = readLocalUsers()

    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      return {
        data: null,
        error: { message: 'Este e-mail já está cadastrado.' },
      }
    }

    const nextUser: LocalUser = {
      id: createLocalUserId(),
      email,
      password,
    }

    writeLocalUsers([...users, nextUser])
    writeLocalSession({ id: nextUser.id, email: nextUser.email })

    return {
      data: { user: { id: nextUser.id, email: nextUser.email } },
      error: null,
    }
  }

  return supabase.auth.signUp({ email, password })
}

export async function signOut() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    writeLocalSession(null)
    return { error: null }
  }

  return supabase.auth.signOut()
}

export async function getCurrentUser() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    const session = readLocalSession()
    if (!session) {
      return null
    }

    return { id: session.id, email: session.email }
  }

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    const session = readLocalSession()
    if (!session) {
      return null
    }

    return { id: session.id, email: session.email }
  }

  return user
}
