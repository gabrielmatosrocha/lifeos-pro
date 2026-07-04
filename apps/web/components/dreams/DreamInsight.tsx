import { Sparkles } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { DreamInsight as DreamInsightType } from '@/features/dreams/types/dream.types'

export default function DreamInsight({ insight }: { insight: DreamInsightType }) {
  return (
    <Card className="border-cyan-300/20 p-4 bg-[linear-gradient(145deg,rgba(34,211,238,.12),rgba(255,255,255,.035)_55%,rgba(16,185,129,.08))] sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,.12)] sm:h-11 sm:w-11">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-cyan-100/80">Dream Insight</p>
          <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">{insight.title}</h2>
          <p className="mt-1.5 text-sm leading-6 text-zinc-300 sm:mt-2">{insight.message}</p>
          <p className="mt-2 hidden text-xs leading-5 text-zinc-500 sm:mt-3 sm:block">{insight.signal}</p>
        </div>
      </div>
    </Card>
  )
}
