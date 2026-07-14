import type { PersistedEntity } from './persistence'

export type WorkoutStatus = 'planned' | 'completed' | 'skipped' | 'archived'
export type ActivityKind = 'corrida' | 'caminhada'
export type ActivityStatus = 'planned' | 'completed' | 'mock-ready'

export type ActivityRoutePoint = {
  latitude: number
  longitude: number
  accuracy?: number
  timestamp: number
}

export type ExerciseRecord = {
  id: string
  name: string
  sets?: number
  reps?: string
  load?: string
  notes?: string
}

export type WorkoutRecord = PersistedEntity & {
  title: string
  date: string
  muscle_groups: string[]
  exercises: ExerciseRecord[]
  duration_minutes: number
  volume: number
  status: WorkoutStatus
  notes?: string
}

export type RunRecord = PersistedEntity & {
  kind: ActivityKind
  date: string
  distance_km: number
  duration_minutes: number
  pace: string
  status: ActivityStatus
  notes?: string
  route_preview?: string
  route_points?: ActivityRoutePoint[]
  started_at?: string
  ended_at?: string
  average_speed_kmh?: number
  calories?: number
}

export type ActivitySummary = {
  weeklyWorkouts: number
  weeklyRuns: number
  weeklyVolume: number
  totalMinutes: number
  totalDistanceKm: number
}

export type ActivityCalendarDay = {
  date: string
  label: string
  workoutCount: number
  runCount: number
}

export type ActivityEngineState = {
  workouts: WorkoutRecord[]
  runs: RunRecord[]
  summary: ActivitySummary
  calendar: ActivityCalendarDay[]
  integrations: {
    gps: 'planned' | 'enabled'
    appleWatch: 'planned'
    strava: 'planned'
    healthKit: 'planned'
    googleFit: 'planned'
  }
}
