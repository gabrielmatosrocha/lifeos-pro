import { AppNav } from '@/components/layout/AppNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen pb-20">
      {children}
      <AppNav />
    </main>
  )
}
