import type { ActivityCalendarDay, ActivityEngineState, ActivitySummary, RunRecord, WorkoutRecord } from '../types/activity'
import { todayIso } from '../utils/date'

export function buildActivitySummary(workouts: WorkoutRecord[], runs: RunRecord[]): ActivitySummary {
  return {
    weeklyWorkouts: workouts.filter((workout) => workout.status === 'completed').length,
    weeklyRuns: runs.filter((run) => run.status === 'completed').length,
    weeklyVolume: workouts.reduce((sum, workout) => sum + workout.volume, 0),
    totalMinutes:
      workouts.reduce((sum, workout) => sum + workout.duration_minutes, 0) +
      runs.reduce((sum, run) => sum + run.duration_minutes, 0),
    totalDistanceKm: Number(runs.reduce((sum, run) => sum + run.distance_km, 0).toFixed(1)),
  }
}

export function buildActivityCalendar(workouts: WorkoutRecord[], runs: RunRecord[], today = todayIso()): ActivityCalendarDay[] {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

  return days.map((label, index) => {
    const date = index === 5 ? 'Sábado' : index === 6 ? 'Domingo' : index === 0 ? today : label

    return {
      date,
      label,
      workoutCount: workouts.filter((workout) => workout.date === date).length,
      runCount: runs.filter((run) => run.date === date).length,
    }
  })
}

export function createActivityEngineState(workouts: WorkoutRecord[], runs: RunRecord[]): ActivityEngineState {
  return {
    workouts,
    runs,
    summary: buildActivitySummary(workouts, runs),
    calendar: buildActivityCalendar(workouts, runs),
    integrations: {
      gps: 'planned',
      appleWatch: 'planned',
      strava: 'planned',
      healthKit: 'planned',
      googleFit: 'planned',
    },
  }
}

export function getActivityLifeEngineSignals(state: ActivityEngineState) {
  return {
    workoutCount: state.summary.weeklyWorkouts,
    runCount: state.summary.weeklyRuns,
    totalMinutes: state.summary.totalMinutes,
    totalDistanceKm: state.summary.totalDistanceKm,
    weeklyVolume: state.summary.weeklyVolume,
  }
}
