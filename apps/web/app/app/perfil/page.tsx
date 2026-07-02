"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { getCurrentUser, signOut } from '@/features/auth/services/auth.service'

export default function PerfilPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser()
      setUserEmail(user?.email ?? '')
    }

    void loadUser()
  }, [])

  async function handleLogout() {
    await signOut()
    router.replace('/login')
  }

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <header>
        <p className="text-slate-500">Conta</p>
        <h1 className="text-3xl font-bold">Perfil</h1>
      </header>

      <Card>
        <p className="text-sm text-slate-500">Usuário</p>
        <h2 className="mt-1 text-xl font-bold">{userEmail || 'Usuário autenticado'}</h2>
        <p className="mt-1 text-slate-500">Disciplina • Fé • Evolução</p>
      </Card>

      <Card>
        <button type="button" onClick={() => void handleLogout()} className="w-full rounded-xl bg-rose-600 px-4 py-3 font-semibold text-white">
          Sair da conta
        </button>
      </Card>
    </main>
  )
}
