import { TrendingUp } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { AnalyticsInsight } from '@/features/evolution/types/evolution.types'

export default function AnalyticsDashboard({ insights }: { insights: AnalyticsInsight[] }) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-emerald-200" />
        <h2 className="text-xl font-bold text-white">Life Analytics</h2>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {insights.map((insight) => (
          <div key={insight.id} className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
            <p className="text-sm text-zinc-500">{insight.title}</p>
            <p className="mt-2 text-3xl font-bold text-white">{insight.metric}</p>
            <p className="mt-2 text-sm text-zinc-400">{insight.description}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
