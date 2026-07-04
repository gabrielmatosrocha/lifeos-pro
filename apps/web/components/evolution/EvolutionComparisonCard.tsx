import { ArrowUpRight, Scale } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { EvolutionComparison } from '@/features/evolution/types/evolution.types'

export default function EvolutionComparisonCard({ comparisons }: { comparisons: EvolutionComparison[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-cyan-100/80">Comparação de períodos</p>
          <h2 className="mt-1 text-xl font-bold text-white">Onde você melhorou</h2>
        </div>
        <Scale className="h-5 w-5 text-cyan-100" />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {comparisons.map((comparison) => (
          <div key={comparison.id} className="rounded-[20px] border border-white/[0.13] bg-white/[0.055] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold leading-5 text-white">{comparison.label}</p>
              <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-100">
                <ArrowUpRight className="h-3.5 w-3.5" />
                +{comparison.delta}
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-zinc-500">{comparison.currentLabel}</p>
                <p className="text-3xl font-bold text-white">{comparison.currentScore}</p>
              </div>
              <div className="pb-1 text-right">
                <p className="text-xs text-zinc-500">{comparison.previousLabel}</p>
                <p className="text-lg font-semibold text-zinc-300">{comparison.previousScore}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-5 text-zinc-400">{comparison.summary}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
