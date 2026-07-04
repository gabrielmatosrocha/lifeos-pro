import { Sparkles } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { MemoryInsight as MemoryInsightType } from '@/features/memory/types/memory.types'

export default function MemoryInsight({ insight }: { insight: MemoryInsightType }) {
  return (
    <Card className="border-cyan-300/20 bg-[linear-gradient(145deg,rgba(34,211,238,.12),rgba(255,255,255,.035)_52%,rgba(139,92,246,.08))] p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-100 sm:h-11 sm:w-11">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-cyan-100/80">Memory Insight</p>
          <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">{insight.title}</h2>
          <p className="mt-2 text-sm leading-5 text-zinc-300 sm:leading-6">{insight.message}</p>
          <p className="mt-3 hidden text-xs leading-5 text-zinc-500 sm:block">{insight.recommendation}</p>
        </div>
      </div>
    </Card>
  )
}
