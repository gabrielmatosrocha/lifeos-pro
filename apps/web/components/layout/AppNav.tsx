import Link from 'next/link'

const items = [
  ['Hoje', '/app/hoje', '⌂'],
  ['Evolução', '/app/evolucao', '↗'],
  ['Metas', '/app/metas', '◎'],
  ['Diário', '/app/diario', '✎'],
  ['Perfil', '/app/perfil', '◉'],
]

export function AppNav() {
  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-[28px] border border-white/10 bg-zinc-900/80 px-3 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="grid grid-cols-5 text-center">
        {items.map(([label, href, icon]) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
