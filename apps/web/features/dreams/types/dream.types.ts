export type DreamStatus = 'active' | 'paused' | 'completed' | 'at_risk'

export type DreamPriority = 'alta' | 'media' | 'baixa'

export type DreamLifeArea =
  | 'Idiomas'
  | 'Saúde'
  | 'Corrida'
  | 'Fé'
  | 'Finanças'
  | 'Leitura'
  | 'Educação'
  | 'Propósito'

export type DreamPlan = {
  annualGoal: string
  monthlyGoal: string
  weeklyGoal: string
  dailyHabit: string
  nextStep: string
}

export type DreamRecord = {
  id: string
  title: string
  why: string
  deadline: string
  lifeArea: DreamLifeArea
  priority: DreamPriority
  progress: number
  status: DreamStatus
  nextAction: string
  plan: DreamPlan
}

export type DreamInsight = {
  title: string
  message: string
  signal: string
}

export type DreamEngineMock = {
  dreams: DreamRecord[]
  featuredDreamId: string
  insight: DreamInsight
}
