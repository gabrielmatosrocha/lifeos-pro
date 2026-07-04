"use client"

import { CheckCircle2, CircleDashed, Flame, Repeat2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { HabitEngineState } from '@/features/habits/types/habit.types'

export default function HabitTracker({ state }: { state: HabitEngineState }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-cyan-100/75">Habits Engine</p>
          <h2 className="mt-1 text-xl font-bold text-white">Acompanhamento de hábitos</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">Checklist, frequência, peso e sequência preparados para persistência real.</p>
        </div>
        <Repeat2 className="h-5 w-5 text-cyan-100" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
          <p className="text-xs text-zinc-500">Concluídos hoje</p>
          <p className="mt-1 text-2xl font-bold text-white">{state.summary.completedToday}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
          <p className="text-xs text-zinc-500">Peso concluído</p>
          <p className="mt-1 text-2xl font-bold text-white">{state.summary.totalWeightCompleted}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
          <p className="text-xs text-zinc-500">Maior sequência</p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-white"><Flame className="h-5 w-5 text-amber-200" />{state.summary.strongestStreak}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {state.habits.map((habit) => (
          <div key={habit.id} className="rounded-2xl border border-white/[0.12] bg-white/[0.045] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{habit.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{habit.description}</p>
              </div>
              {habit.status === 'active' ? <CheckCircle2 className="h-5 w-5 text-emerald-200" /> : <CircleDashed className="h-5 w-5 text-zinc-500" />}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-400">
              <span className="rounded-full bg-white/10 px-2.5 py-1">{habit.frequency}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1">peso {habit.weight}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1">streak {habit.streak}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1">{habit.priority}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
