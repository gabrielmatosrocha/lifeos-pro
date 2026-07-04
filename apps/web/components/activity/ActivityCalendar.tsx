import type { ActivityCalendarDay } from '@/features/activity/types/activity.types'

export default function ActivityCalendar({ days }: { days: ActivityCalendarDay[] }) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => (
        <div key={day.label} className="min-h-20 rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-center">
          <p className="text-xs text-zinc-500">{day.label}</p>
          <div className="mt-3 flex justify-center gap-1">
            {day.workoutCount > 0 ? <span className="h-2 w-2 rounded-full bg-cyan-300" /> : null}
            {day.runCount > 0 ? <span className="h-2 w-2 rounded-full bg-emerald-300" /> : null}
          </div>
        </div>
      ))}
    </div>
  )
}
