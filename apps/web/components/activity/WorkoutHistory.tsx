import WorkoutCard from '@/components/activity/WorkoutCard'
import type { WorkoutRecord } from '@/features/activity/types/activity.types'

export default function WorkoutHistory({ workouts }: { workouts: WorkoutRecord[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  )
}
