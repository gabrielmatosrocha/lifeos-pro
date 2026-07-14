import { runRepository, workoutRepository } from '@/features/activity/repositories/activity.repository'
import type { ActivityEngineState, RunRecord, WorkoutRecord } from '@/features/activity/types/activity.types'
import { getActiveUserId } from '@/features/auth/services/auth.service'
import {
  buildActivityCalendar,
  buildActivitySummary,
  getActivityLifeEngineSignals as getCoreActivityLifeEngineSignals,
} from '@lifeos/core'

const DEMO_USER_ID = 'demo'

export const demoWorkouts: WorkoutRecord[] = [
  {
    id: 'workout-chest-triceps',
    user_id: DEMO_USER_ID,
    title: 'Peito e tríceps',
    date: new Date().toISOString().slice(0, 10),
    muscle_groups: ['peito', 'tríceps'],
    exercises: [
      { id: 'bench', name: 'Supino reto', sets: 4, reps: '8-10', load: 'moderado' },
      { id: 'triceps', name: 'Tríceps corda', sets: 3, reps: '12', load: 'controle' },
    ],
    duration_minutes: 62,
    volume: 18,
    status: 'completed',
    notes: 'Execução controlada e boa energia.',
  },
  {
    id: 'workout-legs',
    user_id: DEMO_USER_ID,
    title: 'Pernas',
    date: 'Ontem',
    muscle_groups: ['pernas'],
    exercises: [
      { id: 'squat', name: 'Agachamento', sets: 4, reps: '8', load: 'progressivo' },
      { id: 'legpress', name: 'Leg press', sets: 4, reps: '10' },
    ],
    duration_minutes: 70,
    volume: 22,
    status: 'completed',
  },
]

export const demoRuns: RunRecord[] = [
  {
    id: 'run-saturday',
    user_id: DEMO_USER_ID,
    kind: 'corrida',
    date: 'Sábado',
    distance_km: 5.2,
    duration_minutes: 32,
    pace: '6:05/km',
    status: 'completed',
    route_preview: 'Parque da Cidade',
  },
  {
    id: 'walk-sunday',
    user_id: DEMO_USER_ID,
    kind: 'caminhada',
    date: 'Domingo',
    distance_km: 4.1,
    duration_minutes: 42,
    pace: '10:19/km',
    status: 'completed',
    notes: 'Recuperação ativa.',
  },
]

export async function getActivityEngineState(userId?: string): Promise<ActivityEngineState> {
  const scopedUserId = userId ?? await getActiveUserId()
  const workoutsResult = await workoutRepository.list({ userId: scopedUserId })
  const runsResult = await runRepository.list({ userId: scopedUserId })
  const workouts = workoutsResult.data.length > 0 ? workoutsResult.data : demoWorkouts
  const runs = runsResult.data.length > 0 ? runsResult.data : demoRuns

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
  return getCoreActivityLifeEngineSignals(state)
}

export const createWorkout = workoutRepository.create
export const updateWorkout = workoutRepository.update
export const deleteWorkout = workoutRepository.delete
export const createRun = runRepository.create
export const updateRun = runRepository.update
export const deleteRun = runRepository.delete
