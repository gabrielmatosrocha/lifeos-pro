import ActivityCalendar from '@/components/activity/ActivityCalendar'
import ActivitySummary from '@/components/activity/ActivitySummary'
import RunHistory from '@/components/activity/RunHistory'
import WorkoutHistory from '@/components/activity/WorkoutHistory'
import Card from '@/components/ui/Card'
import type { ActivityEngineState } from '@/features/activity/types/activity.types'

export default function ActivityDashboard({ state }: { state: ActivityEngineState }) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-medium text-cyan-100/75">Activity Engine</p>
        <h2 className="mt-1 text-xl font-bold text-white">Academia e corrida</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">Arquitetura preparada para GPS, Apple Watch, Strava, HealthKit e Google Fit.</p>
      </div>

      <ActivitySummary summary={state.summary} />

      <Card className="p-4 sm:p-5">
        <ActivityCalendar days={state.calendar} />
      </Card>

      <WorkoutHistory workouts={state.workouts} />
      <RunHistory runs={state.runs} />
    </section>
  )
}
