"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/features/auth/services/auth.service'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function checkSession() {
      const user = await getCurrentUser()
      if (!isMounted) {
        return
      }

      if (!user) {
        router.replace('/login')
        setIsReady(true)
        setIsAuthed(false)
        return
      }

      setIsAuthed(true)
      setIsReady(true)
    }

    void checkSession()

    return () => {
      isMounted = false
    }
  }, [router])

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <p className="text-sm text-zinc-400">Validando sessão...</p>
      </main>
    )
  }

  if (!isAuthed) {
    return null
  }

  return <>{children}</>
}
