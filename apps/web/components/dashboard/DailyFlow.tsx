"use client"

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { BookOpenText, CalendarCheck2, Dumbbell, Flag, PenLine, Route, Sparkles, Target } from 'lucide-react'
import Button from '@/components/ui/Button'

type DailyMission = {
  title: string
  category: string
  impact: number
  icon: ReactNode
  onOpen: () => void
}

type DailyFlowProps = {
  missions: DailyMission[]
  pendingHabits: number
  priorityGoal?: {
    title: string
    progress: number
    nextAction: string
  }
  workout?: {
    title: string
    detail: string
  }
  review?: {
    title: string
    nextStep: string
  }
  journalTitle?: string
  onOpenGoals: () => void
  onOpenCheckIn: () => void
  onOpenJournal: () => void
  onOpenEvolution: () => void
}

const tileClassName =
  'rounded-2xl border border-white/[0.12] bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.12)] transition hover:-translate-y-0.5 hover:border-cyan-200/30 hover:bg-white/[0.08]'

export default function DailyFlow({
  missions,
  pendingHabits,
  priorityGoal,
  workout,
  review,
  journalTitle,
  onOpenGoals,
  onOpenCheckIn,
  onOpenJournal,
  onOpenEvolution,
}: DailyFlowProps) {
  const visibleMissions = missions.slice(0, 3)

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.5, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-[32px] border border-white/[0.13] bg-[linear-gradient(145deg,rgba(255,255,255,.095),rgba(255,255,255,.035)_52%,rgba(34,211,238,.055))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_26px_80px_rgba(0,0,0,.38)] backdrop-blur-2xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
            <Sparkles className="h-4 w-4" />
            Fluxo do dia
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">Tudo que importa hoje, sem ruído.</h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-zinc-400">
          Conselho, missões, meta, treino, check-in, diário e revisão em uma sequência simples.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <div className={tileClassName}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Missões e hábitos</p>
              <p className="text-xs text-zinc-400">{pendingHabits} hábitos pendentes para fechar o ritmo.</p>
            </div>
            <CalendarCheck2 className="h-5 w-5 text-cyan-100" />
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {visibleMissions.length > 0 ? (
              visibleMissions.map((mission) => (
                <button
                  key={mission.title}
                  type="button"
                  onClick={mission.onOpen}
                  className="min-h-[108px] rounded-2xl border border-white/[0.10] bg-black/10 p-3 text-left transition hover:border-cyan-200/30 hover:bg-white/[0.075] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-cyan-50">{mission.icon}</span>
                  <span className="mt-3 line-clamp-2 block text-sm font-semibold text-white">{mission.title}</span>
                  <span className="mt-1 block text-xs text-zinc-400">{mission.category} · {mission.impact} pts</span>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-white/[0.10] bg-black/10 p-4 text-sm text-zinc-400 sm:col-span-3">
                Nenhum hábito ativo encontrado. Abra Metas para definir o próximo movimento.
              </div>
            )}
          </div>
        </div>

        <div className={tileClassName}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Meta prioritária</p>
              <p className="text-xs text-zinc-400">O próximo passo que mais move seu mês.</p>
            </div>
            <Target className="h-5 w-5 text-amber-100" />
          </div>
          <h3 className="text-lg font-bold text-white">{priorityGoal?.title ?? 'Definir uma meta prioritária'}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{priorityGoal?.nextAction ?? 'Escolha uma meta executável para acompanhar hoje.'}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-cyan-300" style={{ width: `${priorityGoal?.progress ?? 0}%` }} />
          </div>
          <Button type="button" variant="secondary" size="sm" className="mt-4 w-full" onClick={onOpenGoals}>
            <Flag className="h-4 w-4" />
            Abrir metas
          </Button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <div className={tileClassName}>
          <Dumbbell className="h-5 w-5 text-violet-100" />
          <p className="mt-3 text-sm font-semibold text-white">Treino sugerido</p>
          <p className="mt-1 text-sm leading-6 text-zinc-400">{workout?.title ?? 'Treino leve de manutenção'}</p>
          <p className="mt-2 text-xs text-zinc-500">{workout?.detail ?? 'Ajuste no módulo Evolução.'}</p>
        </div>

        <div className={tileClassName}>
          <Route className="h-5 w-5 text-emerald-100" />
          <p className="mt-3 text-sm font-semibold text-white">Check-in rápido</p>
          <p className="mt-1 text-sm leading-6 text-zinc-400">Registre treino, corrida ou caminhada em poucos toques.</p>
          <Button type="button" variant="secondary" size="sm" className="mt-4 w-full" onClick={onOpenCheckIn}>
            Fazer check-in
          </Button>
        </div>

        <div className={tileClassName}>
          <PenLine className="h-5 w-5 text-sky-100" />
          <p className="mt-3 text-sm font-semibold text-white">Diário</p>
          <p className="mt-1 text-sm leading-6 text-zinc-400">{journalTitle ?? 'Feche o dia com uma reflexão curta.'}</p>
          <Button type="button" variant="ghost" size="sm" className="mt-4 w-full" onClick={onOpenJournal}>
            Escrever
          </Button>
        </div>

        <div className={tileClassName}>
          <BookOpenText className="h-5 w-5 text-cyan-100" />
          <p className="mt-3 text-sm font-semibold text-white">{review?.title ?? 'Life Review'}</p>
          <p className="mt-1 text-sm leading-6 text-zinc-400">{review?.nextStep ?? 'Revise o dia e escolha uma melhoria simples.'}</p>
          <Button type="button" variant="ghost" size="sm" className="mt-4 w-full" onClick={onOpenEvolution}>
            Ver evolução
          </Button>
        </div>
      </div>
    </motion.section>
  )
}
