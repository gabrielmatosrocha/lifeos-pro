import Link from 'next/link'
import { ArrowRight, CheckCircle2, Sparkles, Target, TrendingUp } from 'lucide-react'
import BackgroundGlow from '@/components/layout/BackgroundGlow'

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_12%,rgba(34,211,238,0.22),transparent_32%),radial-gradient(circle_at_78%_18%,rgba(168,85,247,0.16),transparent_30%),linear-gradient(180deg,#020617_0%,#07111f_48%,#09090b_100%)] px-5 py-6 text-white sm:px-8">
      <BackgroundGlow />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col justify-center gap-10 lg:grid lg:grid-cols-[1fr_0.92fr] lg:items-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-white/[0.06] px-3 py-1 text-sm font-medium text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-2xl">
            <Sparkles className="h-4 w-4" />
            LifeOS Pro
          </div>

          <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            Seu sistema operacional da vida.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
            Uma experiencia premium para alinhar fe, saude, metas, rotina e evolucao em um lugar calmo, bonito e acionavel.
          </p>

          <p className="mt-4 text-base font-medium text-white/90">
            Hoje e uma oportunidade de crescer.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-[linear-gradient(135deg,#67e8f9,#22d3ee_42%,#38bdf8)] px-6 py-4 font-semibold text-slate-950 shadow-[0_22px_60px_rgba(34,211,238,.26),inset_0_1px_0_rgba(255,255,255,.38)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
            >
              Abrir meu LifeOS
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/app/hoje"
              className="inline-flex items-center justify-center rounded-[22px] border border-white/15 bg-white/[0.07] px-6 py-4 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-2xl transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-200/30 hover:bg-white/[0.105] active:scale-[0.98]"
            >
              Ver meu dia
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -inset-8 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[40px] border border-white/[0.14] bg-[linear-gradient(145deg,rgba(255,255,255,.11),rgba(255,255,255,.04)_48%,rgba(255,255,255,.075))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_40px_120px_rgba(0,0,0,.48)] backdrop-blur-3xl sm:p-6">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
            <div className="rounded-[32px] border border-cyan-200/20 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,.22),transparent_38%),rgba(2,6,23,.55)] p-5">
              <p className="text-sm text-cyan-100/80">Hoje no LifeOS</p>
              <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-5">
                <div className="grid h-32 w-32 place-items-center rounded-full bg-[conic-gradient(from_180deg,#22d3ee_0_270deg,rgba(255,255,255,.10)_270deg)] p-2 shadow-[0_0_60px_rgba(34,211,238,.22)]">
                  <div className="grid h-full w-full place-items-center rounded-full border border-white/15 bg-slate-950/75 backdrop-blur-2xl">
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/70">Ritmo</p>
                      <p className="text-4xl font-bold">74</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Voce esta evoluindo.</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Mais clareza para decidir, executar e refletir sem perder o que importa.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Direcao', value: '3 metas', icon: Target },
                { label: 'Execucao', value: '4 acoes', icon: CheckCircle2 },
                { label: 'Evolucao', value: '+12%', icon: TrendingUp },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="rounded-[24px] border border-white/[0.12] bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.10)]">
                    <Icon className="h-5 w-5 text-cyan-100" />
                    <p className="mt-4 text-sm text-zinc-400">{item.label}</p>
                    <p className="mt-1 text-xl font-bold">{item.value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
