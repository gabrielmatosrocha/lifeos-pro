"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import BackgroundGlow from '@/components/layout/BackgroundGlow'
import Button from '@/components/ui/Button'
import { fieldClassName, panelSurfaceClassName } from '@/components/ui/fieldStyles'
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

  const isLogin = mode === 'login'

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_48%,#09090b_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <BackgroundGlow />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden max-w-2xl lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200/80">LifeOS Pro</p>
          <h1 className="mt-4 text-5xl font-bold leading-[1.05] text-white">
            Seu sistema operacional pessoal.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-300">
            Entre no cockpit diário para alinhar disciplina, fé, metas e evolução em um só lugar.
          </p>
          <p className="mt-4 text-base font-medium text-white/90">Mais um passo em direção aos seus sonhos.</p>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {['Ritmo', 'Direção', 'Evolução'].map((item) => (
              <div key={item} className="rounded-[22px] border border-white/[0.14] bg-white/[0.055] px-4 py-3 text-sm font-medium text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,.10)] backdrop-blur-xl">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className={`${panelSurfaceClassName} mx-auto w-full max-w-md p-6 sm:p-8`}>
          <div className="mb-7">
            <p className="font-semibold text-cyan-300">LifeOS Pro</p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              {isLogin ? 'Entrar' : 'Criar conta'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {isLogin
                ? 'Acesse seu espaço pessoal e continue seu dia com clareza.'
                : 'Crie seu acesso local para começar a organizar sua vida.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-zinc-300">
              <span className="mb-2 block">E-mail</span>
              <input
                className={fieldClassName}
                type="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="block text-sm font-medium text-zinc-300">
              <span className="mb-2 block">Senha</span>
              <input
                className={fieldClassName}
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
              />
            </label>

            {error ? (
              <p className="rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </p>
            ) : null}

            <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
              {isSubmitting ? 'Aguarde...' : isLogin ? 'Entrar no LifeOS' : 'Criar minha conta'}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => {
              setError(null)
              setMode(isLogin ? 'signup' : 'login')
            }}
            className="mt-5 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-zinc-300 transition hover:border-cyan-300/30 hover:bg-white/[0.07] hover:text-white"
          >
            {isLogin ? 'Ainda não tem conta? Criar conta' : 'Já possui conta? Entrar'}
          </button>
        </section>
      </div>
    </main>
  )
}
