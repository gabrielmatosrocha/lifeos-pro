"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import MemoryDashboard from '@/components/memory/MemoryDashboard'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import FeedbackState from '@/components/ui/FeedbackState'
import { getCurrentUser, signOut } from '@/features/auth/services/auth.service'
import { getMemoryEngineMock } from '@/features/memory/services/memory.service'
import { createProfileRepository } from '@/features/profile/repositories/profile.repository'
import type { UserProfile } from '@/features/profile/types/profile.types'

const profileRepository = createProfileRepository()

export default function PerfilPage() {
  const router = useRouter()
  const [memory] = useState(() => getMemoryEngineMock())
  const [userEmail, setUserEmail] = useState('')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadUser() {
      setIsLoading(true)
      setError(null)
      try {
        const user = await getCurrentUser()
        if (isMounted) {
          setUserEmail(user?.email ?? '')
        }

        if (user) {
          const existingProfile = await profileRepository.getByUserId(user.id)
          const nextProfile = existingProfile ?? await profileRepository.upsert({
            user_id: user.id,
            email: user.email,
          })

          if (isMounted) {
            setProfile(nextProfile)
          }
        }
      } catch {
        if (isMounted) {
          setError('Não foi possível carregar o perfil agora.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadUser()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleLogout() {
    await signOut()
    router.replace('/login')
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 pb-40 pt-6 text-white sm:pb-48">
      <header>
        <p className="text-sm font-medium text-cyan-100/70">Conta</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Perfil</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Sua identidade dentro do LifeOS. Simples agora, preparada para crescer com você.</p>
      </header>

      {isLoading ? <FeedbackState variant="loading" title="Carregando perfil" /> : null}
      {error ? <FeedbackState variant="error" title="Atenção" description={error} /> : null}

      <Card className="border-white/15 bg-white/[0.05]">
        <p className="text-sm text-slate-500">Usuário</p>
        <h2 className="mt-1 text-xl font-bold">{userEmail || 'Usuário autenticado'}</h2>
        <p className="mt-1 text-slate-500">Disciplina • Fé • Evolução</p>
      </Card>

      {profile ? (
        <Card className="border-white/15 bg-white/[0.05]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Preferências</p>
              <h2 className="mt-1 text-xl font-bold">Configurações do LifeOS</h2>
              <p className="mt-1 text-sm text-slate-500">Preparado para personalizar Coach, espiritualidade e foco principal.</p>
            </div>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
              {profile.preferences.primaryFocus}
            </span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
              <p className="text-xs text-zinc-500">Coach</p>
              <p className="mt-1 font-semibold text-white">{profile.preferences.coachEnabled ? 'Ativo' : 'Pausado'}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
              <p className="text-xs text-zinc-500">Espiritualidade</p>
              <p className="mt-1 font-semibold text-white">{profile.preferences.spiritualContentEnabled ? 'Ativa' : 'Desativada'}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
              <p className="text-xs text-zinc-500">Frequência</p>
              <p className="mt-1 font-semibold text-white">{profile.preferences.notificationFrequency}</p>
            </div>
          </div>
        </Card>
      ) : null}

      <MemoryDashboard memory={memory} />

      <Card className="border-white/15 bg-white/[0.05]">
        <Button type="button" variant="danger" onClick={() => void handleLogout()} className="w-full">
          Sair da conta
        </Button>
      </Card>
    </main>
  )
}
