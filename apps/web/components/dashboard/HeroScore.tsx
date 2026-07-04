"use client"

import { motion } from 'framer-motion'

type HeroScoreProps = {
  score: number
  classification: string
  insight: string
  lifeScore?: number
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)))
}

export default function HeroScore({ score, classification, insight, lifeScore }: HeroScoreProps) {
  const safeScore = clampScore(score)
  const safeLifeScore = typeof lifeScore === 'number' ? clampScore(lifeScore) : null
  const scoreGradient = `conic-gradient(from 180deg, #22d3ee ${safeScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)`

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.55, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-[36px] border border-cyan-200/20 bg-[radial-gradient(circle_at_18%_12%,rgba(103,232,249,0.30),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(168,85,247,0.18),transparent_28%),linear-gradient(135deg,rgba(8,47,73,0.70),rgba(15,23,42,0.86)_45%,rgba(24,24,27,0.92))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_34px_100px_rgba(0,0,0,.46),0_0_80px_rgba(34,211,238,.10)] backdrop-blur-3xl sm:p-7"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10 bg-white/[0.03] blur-sm" />
      <div className="relative grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
        <div
          className="grid h-40 w-40 place-items-center rounded-full p-2 shadow-[0_0_80px_rgba(34,211,238,.20)] sm:h-44 sm:w-44"
          style={{ background: scoreGradient }}
        >
          <div className="grid h-full w-full place-items-center rounded-full border border-white/15 bg-zinc-950/75 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-2xl">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">Ritmo</p>
              <h2 className="mt-1 text-5xl font-bold text-white">{safeScore}</h2>
              <p className="text-sm text-zinc-400">de 100</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-cyan-100/80">Sistema de hoje</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold text-white md:text-4xl">
            {classification}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">{insight}</p>
          <p className="mt-3 text-sm font-medium text-white/90">Mais um passo em direção aos seus sonhos.</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <motion.span
              whileHover={{ y: -1 }}
              title="Mostra como seu dia está fluindo agora."
              aria-label={`Ritmo de hoje: ${safeScore} de 100`}
              className="rounded-full border border-cyan-300/25 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,.12)]"
            >
              Ritmo de hoje: {safeScore}/100
            </motion.span>
            {safeLifeScore !== null ? (
              <motion.span
                whileHover={{ y: -1 }}
                title="Resume o equilíbrio geral das áreas da sua vida."
                aria-label={`Equilíbrio da vida: ${safeLifeScore} de 100`}
                className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-xs font-medium text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,.10)]"
              >
                Equilíbrio da vida: {safeLifeScore}/100
              </motion.span>
            ) : null}
            <motion.span
              whileHover={{ y: -1 }}
              title="Uma pequena ação concluída já melhora o ritmo do dia."
              className="rounded-full border border-emerald-300/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-100 shadow-[inset_0_1px_0_rgba(255,255,255,.10)]"
            >
              Próximo passo: 1 ação rápida
            </motion.span>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
