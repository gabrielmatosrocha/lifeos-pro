import RunCard from '@/components/activity/RunCard'
import type { RunRecord } from '@/features/activity/types/activity.types'

export default function RunHistory({ runs }: { runs: RunRecord[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {runs.map((run) => (
        <RunCard key={run.id} run={run} />
      ))}
    </div>
  )
}
