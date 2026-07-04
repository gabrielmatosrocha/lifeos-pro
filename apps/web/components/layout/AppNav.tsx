"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, Target, BookOpen, User } from 'lucide-react'

const items = [
  { label: 'Hoje', href: '/app/hoje', icon: Home },
  { label: 'Evolução', href: '/app/evolucao', icon: TrendingUp },
  { label: 'Metas', href: '/app/metas', icon: Target },
  { label: 'Diário', href: '/app/diario', icon: BookOpen },
  { label: 'Perfil', href: '/app/perfil', icon: User },
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-4 left-3 right-3 z-50 mx-auto max-w-md overflow-hidden rounded-[28px] border border-white/[0.14] bg-zinc-950/78 px-2 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_24px_80px_rgba(0,0,0,.48)] backdrop-blur-3xl sm:bottom-6 sm:left-4 sm:right-4 sm:px-3 sm:py-3">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
      <div className="grid grid-cols-5 text-center">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 rounded-2xl px-1.5 py-2 text-[11px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 sm:px-2 sm:text-xs ${
                isActive
                  ? 'bg-cyan-400/15 text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_0_30px_rgba(34,211,238,.18)]'
                  : 'text-zinc-400 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
