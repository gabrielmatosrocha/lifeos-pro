export type AuthUser = {
  id: string
  email: string
}

export type AuthResult = {
  data: { user: AuthUser | null } | null
  error: { message: string } | null
}

export type PasswordResetResult = {
  error: { message: string } | null
}

export type AuthRepository = {
  getCurrentUser(): Promise<AuthUser | null>
  getActiveUserId(): Promise<string>
  signInWithPassword(email: string, password: string): Promise<AuthResult>
  signUpWithPassword(email: string, password: string): Promise<AuthResult>
  sendPasswordReset(email: string): Promise<PasswordResetResult>
  signOut(): Promise<PasswordResetResult>
}
