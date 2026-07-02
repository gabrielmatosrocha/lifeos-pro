"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signInWithPassword, signUpWithPassword } from '@/features/auth/services/auth.service'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const action = mode === 'login' ? signInWithPassword(email, password) : signUpWithPassword(email, password)
    const { data, error } = await action

    setIsSubmitting(false)

    if (error) {
      setError(error.message ?? 'Falha na autenticação.')
      return
    }

    if (data?.user) {
      router.replace('/app/hoje')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-white">
      <section className="w-full max-w-md rounded-[28px] border border-white/10 bg-zinc-900/80 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <p className="font-semibold text-cyan-400">LifeOS Pro</p>
        <h1 className="mt-2 text-2xl font-bold">{mode === 'login' ? 'Entrar' : 'Criar conta'}</h1>
        <p className="mt-2 text-sm text-zinc-400">Acesse seu espaço pessoal com autenticação real.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-white outline-none"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-white outline-none"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-cyan-600 py-3 font-semibold text-white disabled:opacity-70">
            {isSubmitting ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="mt-4 text-sm text-zinc-400">
          {mode === 'login' ? 'Ainda não tem conta? Criar conta' : 'Já possui conta? Entrar'}
        </button>
      </section>
    </main>
  )
}
