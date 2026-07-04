import { Brain } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { CoachInsight } from '@/features/evolution/types/evolution.types'

export default function CoachDashboard({ insights }: { insights: CoachInsight[] }) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-violet-200" />
        <h2 className="text-xl font-bold text-white">Life Coach</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-400">Arquitetura para IA educativa. Não substitui médicos, nutricionistas ou educadores físicos.</p>
      <div className="mt-5 space-y-3">
        {insights.map((insight) => (
          <div key={insight.id} className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
            <p className="text-xs uppercase text-violet-200">{insight.category}</p>
            <p className="mt-1 font-semibold text-white">{insight.title}</p>
            <p className="mt-1 text-sm text-zinc-400">{insight.description}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
