import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppNav } from '@/components/layout/AppNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <main className="min-h-screen pb-20">
        {children}
        <AppNav />
      </main>
    </AuthGuard>
  )
}
