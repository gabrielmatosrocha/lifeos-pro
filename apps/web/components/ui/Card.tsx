export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-[28px] border border-white/10 bg-zinc-900/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  )
}
