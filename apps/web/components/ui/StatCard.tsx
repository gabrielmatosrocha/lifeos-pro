type Props = {
  title: string
  value: string
  subtitle: string
}

export default function StatCard({
  title,
  value,
  subtitle,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.05] p-8 backdrop-blur-3xl shadow-[0_30px_80px_rgba(0,0,0,.45)]">

      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10" />

      <div className="relative">

        <p className="text-zinc-400 text-sm">
          {title}
        </p>

        <div className="mt-4 flex items-end gap-4">

          <h2 className="text-8xl font-bold tracking-tight">
            {value}
          </h2>

          <div className="mb-4 rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-300">
            +12%
          </div>

        </div>

        <p className="mt-3 text-xl font-medium">
          {subtitle}
        </p>

        <div className="mt-8 h-3 rounded-full bg-white/10 overflow-hidden">

          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-400"
            style={{ width: `${value}%` }}
          />

        </div>

      </div>

    </section>
  )
}