import { createAuthRepository } from '@/features/auth/repositories/auth.repository'

const authRepository = createAuthRepository()

export async function getActiveUserId() {
  return authRepository.getActiveUserId()
}

export async function signInWithPassword(email: string, password: string) {
  return authRepository.signInWithPassword(email, password)
}

export async function signUpWithPassword(email: string, password: string) {
  return authRepository.signUpWithPassword(email, password)
}

export async function sendPasswordReset(email: string) {
  return authRepository.sendPasswordReset(email)
}

export async function signOut() {
  return authRepository.signOut()
}

export async function getCurrentUser() {
  return authRepository.getCurrentUser()
}
