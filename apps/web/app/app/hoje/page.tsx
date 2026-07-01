import { demoActions } from '@/features/demo/demo-data'
import { runLifeEngine } from '@/features/life-engine/services/life-engine.service'

const week = [
  { day: 'Seg', value: 42 },
  { day: 'Ter', value: 58 },
  { day: 'Qua', value: 64 },
  { day: 'Qui', value: 71 },
  { day: 'Sex', value: 84 },
  { day: 'Sáb', value: 76 },
  { day: 'Dom', value: 88 },
]

const missions = [
  { title: 'Palavra', detail: '5 min', done: true },
  { title: 'Água', detail: '2 L', done: true },
  { title: 'Estudo', detail: '60 min', done: true },
  { title: 'Gratidão', detail: 'Hoje', done: false },
]

export default function HojePage() {
  const summary = runLifeEngine(demoActions)

  return (
    <main className="min-h-screen overflow-hidden bg-[#09090B] px-4 pb-32 pt-6 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(10,132,255,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(48,209,88,0.12),transparent_35%)]" />

      <div className="relative mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">Hoje • LifeOS</p>
            <h1 className="mt-1 text-4xl font-bold tracking-tight">
              Bom dia, Gabriel ☀️
            </h1>
            <p className="mt-1 text-zinc-400">
              Viva com propósito. Evolua com constância.
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xl backdrop-blur-xl">
            G
          </div>
        </header>

        <section className="rounded-[36px] border border-white/10 bg-white/[0.08] p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm text-zinc-400">Life Score</p>
              <div className="mt-3 flex items-end gap-3">
                <p className="text-7xl font-bold tracking-tight">
                  {summary.rhythmIndex}
                </p>
                <span className="mb-3 rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-300">
                  +12%
                </span>
              </div>
              <p className="mt-2 text-lg text-zinc-300">
                {summary.classification}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-zinc-400">Índice interno</p>
              <p className="mt-2 text-3xl font-bold">{summary.lifeScore}</p>
            </div>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"
              style={{ width: `${summary.rhythmIndex}%` }}
            />
          </div>

          <p className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
            {summary.insight}
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Missão do dia</h2>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                3/4
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {missions.map((mission) => (
                <div
                  key={mission.title}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full ${
                        mission.done
                          ? 'bg-emerald-500 text-black'
                          : 'bg-white/10 text-zinc-500'
                      }`}
                    >
                      {mission.done ? '✓' : '○'}
                    </span>
                    <div>
                      <p className="font-semibold">{mission.title}</p>
                      <p className="text-xs text-zinc-400">{mission.detail}</p>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500">Hoje</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
            <h2 className="text-xl font-bold">Últimos 7 dias</h2>

            <div className="mt-6 flex h-40 items-end justify-between gap-3">
              {week.map((item) => (
                <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-32 w-full items-end rounded-full bg-white/5">
                    <div
                      className="w-full rounded-full bg-gradient-to-t from-blue-500 to-emerald-400"
                      style={{ height: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
          <h2 className="text-xl font-bold">Pilares</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {Object.entries(summary.pillarScores).map(([pillar, value]) => (
              <div key={pillar} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span>{pillar}</span>
                  <span className="text-zinc-400">{value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}