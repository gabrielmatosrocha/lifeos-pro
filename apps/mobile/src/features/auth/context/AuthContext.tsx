import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '@/features/auth/services/auth.service'
import type { AuthUser } from '@/features/auth/types/auth.types'

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  signIn(email: string, password: string): Promise<string | null>
  signUp(email: string, password: string): Promise<string | null>
  signOut(): Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(setUser)
      .finally(() => setIsLoading(false))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      async signIn(email, password) {
        const result = await authService.signIn(email, password)
        setUser(result.user)
        return result.error
      },
      async signUp(email, password) {
        const result = await authService.signUp(email, password)
        setUser(result.user)
        return result.error
      },
      async signOut() {
        await authService.signOut()
        setUser(null)
      },
    }),
    [isLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
