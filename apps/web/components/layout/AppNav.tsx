import Link from 'next/link'
import { Home, TrendingUp, Target, BookOpen, User } from 'lucide-react'

const items = [
  { label: 'Hoje', href: '/app/hoje', icon: Home },
  { label: 'Evolução', href: '/app/evolucao', icon: TrendingUp },
  { label: 'Metas', href: '/app/metas', icon: Target },
  { label: 'Diário', href: '/app/diario', icon: BookOpen },
  { label: 'Perfil', href: '/app/perfil', icon: User },
]

export function AppNav() {
  return (
    <nav className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-md rounded-[28px] border border-white/10 bg-zinc-900/70 px-3 py-3 shadow-2xl shadow-black/40 backdrop-blur-2xl">
      <div className="grid grid-cols-5 text-center">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              <Icon size={20} strokeWidth={2} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
