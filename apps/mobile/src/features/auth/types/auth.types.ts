export type AuthUser = {
  id: string
  email: string
}

export type AuthResult = {
  user: AuthUser | null
  error: string | null
}

export type AuthService = {
  getCurrentUser(): Promise<AuthUser | null>
  signIn(email: string, password: string): Promise<AuthResult>
  signUp(email: string, password: string): Promise<AuthResult>
  signOut(): Promise<void>
}
