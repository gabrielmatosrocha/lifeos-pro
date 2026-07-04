import { runRepository, workoutRepository } from '@/features/activity/repositories/activity.repository'
import type { ActivityCalendarDay, ActivityEngineState, ActivitySummary, RunRecord, WorkoutRecord } from '@/features/activity/types/activity.types'

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

function buildSummary(workouts: WorkoutRecord[], runs: RunRecord[]): ActivitySummary {
  return {
    weeklyWorkouts: workouts.filter((workout) => workout.status === 'completed').length,
    weeklyRuns: runs.filter((run) => run.status === 'completed').length,
    weeklyVolume: workouts.reduce((sum, workout) => sum + workout.volume, 0),
    totalMinutes: workouts.reduce((sum, workout) => sum + workout.duration_minutes, 0) + runs.reduce((sum, run) => sum + run.duration_minutes, 0),
    totalDistanceKm: Number(runs.reduce((sum, run) => sum + run.distance_km, 0).toFixed(1)),
  }
}

function buildCalendar(workouts: WorkoutRecord[], runs: RunRecord[]): ActivityCalendarDay[] {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

  return days.map((label, index) => {
    const date = index === 5 ? 'Sábado' : index === 6 ? 'Domingo' : index === 0 ? new Date().toISOString().slice(0, 10) : label

    return {
      date,
      label,
      workoutCount: workouts.filter((workout) => workout.date === date).length,
      runCount: runs.filter((run) => run.date === date).length,
    }
  })
}

export async function getActivityEngineState(userId = DEMO_USER_ID): Promise<ActivityEngineState> {
  const workoutsResult = await workoutRepository.list({ userId })
  const runsResult = await runRepository.list({ userId })
  const workouts = workoutsResult.data.length > 0 ? workoutsResult.data : demoWorkouts
  const runs = runsResult.data.length > 0 ? runsResult.data : demoRuns

  return {
    workouts,
    runs,
    summary: buildSummary(workouts, runs),
    calendar: buildCalendar(workouts, runs),
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

export const createWorkout = workoutRepository.create
export const updateWorkout = workoutRepository.update
export const deleteWorkout = workoutRepository.delete
export const createRun = runRepository.create
export const updateRun = runRepository.update
export const deleteRun = runRepository.delete
