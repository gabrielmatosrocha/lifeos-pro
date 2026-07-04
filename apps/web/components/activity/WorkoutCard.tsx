import { Dumbbell } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { WorkoutRecord } from '@/features/activity/types/activity.types'

export default function WorkoutCard({ workout }: { workout: WorkoutRecord }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/55">Treino</p>
          <h3 className="mt-1 text-lg font-bold text-white">{workout.title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{workout.muscle_groups.join(' + ')} • {workout.duration_minutes} min</p>
        </div>
        <Dumbbell className="h-5 w-5 text-cyan-100" />
      </div>
      <div className="mt-4 space-y-2">
        {workout.exercises.map((exercise) => (
          <div key={exercise.id} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-sm text-zinc-300">
            <span className="font-medium text-white">{exercise.name}</span>
            {exercise.sets ? <span className="text-zinc-500"> • {exercise.sets} séries</span> : null}
            {exercise.reps ? <span className="text-zinc-500"> • {exercise.reps}</span> : null}
          </div>
        ))}
      </div>
    </Card>
  )
}
