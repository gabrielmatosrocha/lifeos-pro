import { AuthGuard } from '@/components/auth/AuthGuard'
import BackgroundGlow from '@/components/layout/BackgroundGlow'
import { AppNav } from '@/components/layout/AppNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(80%_60%_at_18%_0%,rgba(14,165,233,0.18),transparent_58%),radial-gradient(70%_55%_at_92%_100%,rgba(16,185,129,0.13),transparent_55%),linear-gradient(180deg,#020617_0%,#07111f_48%,#09090b_100%)] pb-28 text-white">
        <BackgroundGlow />
        <div className="relative z-10">
          {children}
        </div>
        <AppNav />
      </main>
    </AuthGuard>
  )
}
