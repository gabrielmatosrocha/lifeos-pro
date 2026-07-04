"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import MemoryDashboard from '@/components/memory/MemoryDashboard'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import FeedbackState from '@/components/ui/FeedbackState'
import { getCurrentUser, signOut } from '@/features/auth/services/auth.service'
import { getMemoryEngineMock } from '@/features/memory/services/memory.service'

export default function PerfilPage() {
  const router = useRouter()
  const [memory] = useState(() => getMemoryEngineMock())
  const [userEmail, setUserEmail] = useState('')
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

      <MemoryDashboard memory={memory} />

      <Card className="border-white/15 bg-white/[0.05]">
        <Button type="button" variant="danger" onClick={() => void handleLogout()} className="w-full">
          Sair da conta
        </Button>
      </Card>
    </main>
  )
}
