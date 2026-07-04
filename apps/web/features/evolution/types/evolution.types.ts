export type EvolutionRange = 'daily' | 'weekly' | 'monthly' | 'yearly'

export type WorkoutType =
  | 'peito'
  | 'peito e tríceps'
  | 'costas'
  | 'costas e bíceps'
  | 'pernas'
  | 'ombro'
  | 'cardio'
  | 'full body'
  | 'personalizado'

export type ActivityMode = 'corrida' | 'caminhada'

export type EvolutionPeriod = {
  id: string
  label: string
  range: EvolutionRange
  lifeScore: number
  habitsCompleted: number
  workouts: number
  runs: number
  checkIns: number
  streak: number
  summary: string
  comparison: string
}

export type EvolutionComparison = {
  id: string
  label: string
  currentLabel: string
  previousLabel: string
  currentScore: number
  previousScore: number
  delta: number
  summary: string
}

export type GymCheckInRecord = {
  id: string
  date: string
  time: string
  workout: WorkoutType
  notes: string
  photoUrl?: string
}

export type RunCheckInRecord = {
  id: string
  date: string
  activityType: ActivityMode
  distanceKm: number
  duration: string
  pace: string
  notes: string
  photoUrl?: string
}

export type ActivitySession = {
  id: string
  mode: ActivityMode
  status: 'mock-ready' | 'planned'
  duration: string
  distanceKm: number
  pace: string
  speedKmh: number
  altitudeGainM?: number
  calories: number
  mapPreview: string
  routeName: string
  startedAt: string
}

export type CoachInsight = {
  id: string
  title: string
  description: string
  category: 'treino' | 'hábitos' | 'descanso' | 'alimentação' | 'rotina'
}

export type SmartReminderRecord = {
  id: string
  category: 'Saúde' | 'Academia' | 'Corrida' | 'Hábitos' | 'Metas' | 'Estudos' | 'Espiritualidade' | 'Motivação'
  message: string
  timing: string
  tone: 'elogio' | 'incentivo' | 'reduzir frequência'
}

export type DailyVerse = {
  reference: string
  text: string
  gratitudePrompt: string
  prayerPrompt: string
  enabled: boolean
  frequency: 'diária' | 'semanal' | 'manual'
}

export type AnalyticsInsight = {
  id: string
  title: string
  metric: string
  trend: 'up' | 'down' | 'stable'
  description: string
}

export type EvolutionHistory = {
  periods: EvolutionPeriod[]
  comparisons: EvolutionComparison[]
  gymCheckIns: GymCheckInRecord[]
  runCheckIns: RunCheckInRecord[]
  activitySession: ActivitySession
  coachInsights: CoachInsight[]
  reminders: SmartReminderRecord[]
  dailyVerse: DailyVerse
  analytics: AnalyticsInsight[]
}
