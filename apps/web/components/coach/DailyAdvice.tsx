"use client"

import { motion } from 'framer-motion'
import { Brain, CheckCircle2, HeartPulse, Sparkles, Target } from 'lucide-react'
import type { CoachAdvice, CoachDomain, CoachTone } from '@/features/coach/types/coach.types'

const domainLabel: Record<CoachDomain, string> = {
  executivo: 'Execução',
  saude: 'Saúde',
  espiritual: 'Espiritual',
  mental: 'Mental',
  estrategico: 'Estratégia',
}

const toneLabel: Record<CoachTone, string> = {
  elogio: 'Elogio',
  incentivo: 'Incentivo',
  firme: 'Firme',
  alerta: 'Alerta',
  calmo: 'Calmo',
}

const domainIcon: Record<CoachDomain, typeof Target> = {
  executivo: Target,
  saude: HeartPulse,
  espiritual: Sparkles,
  mental: Brain,
  estrategico: CheckCircle2,
}

export default function DailyAdvice({ advice }: { advice: CoachAdvice }) {
  const Icon = domainIcon[advice.domain]

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.45, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-[30px] border border-cyan-200/15 bg-[linear-gradient(135deg,rgba(34,211,238,.105),rgba(255,255,255,.04)_44%,rgba(168,85,247,.08))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.14),0_20px_60px_rgba(0,0,0,.30)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/45 to-transparent" />
      <div className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-cyan-400/[0.08] blur-3xl" />

      <div className="relative grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-start">
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,.12)]">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-cyan-100/85">{advice.title}</p>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs text-zinc-300">
              {domainLabel[advice.domain]}
            </span>
            <span className="rounded-full border border-cyan-200/15 bg-cyan-300/10 px-2.5 py-1 text-xs text-cyan-100">
              Tom {toneLabel[advice.tone].toLowerCase()}
            </span>
          </div>

          <p className="mt-2 max-w-3xl text-base font-semibold leading-6 text-white sm:text-lg">
            {advice.message}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.10] bg-white/[0.045] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/55">Ação</p>
              <p className="mt-1 text-sm leading-5 text-zinc-200">{advice.action}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.10] bg-white/[0.035] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Motivo</p>
              <p className="mt-1 text-sm leading-5 text-zinc-400">{advice.reason}</p>
            </div>
          </div>
        </div>

        <div className="hidden rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-zinc-400 md:block">
          Life Coach V2
        </div>
      </div>
    </motion.section>
  )
}
