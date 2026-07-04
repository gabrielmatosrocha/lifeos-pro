export type MemoryCategory =
  | 'sonho'
  | 'hábito'
  | 'rotina'
  | 'treino'
  | 'espiritualidade'
  | 'estudo'
  | 'saúde'
  | 'meta'
  | 'preferência'

export type MemoryOrigin =
  | 'Dream Engine'
  | 'Diário'
  | 'Check-in'
  | 'Metas'
  | 'Perfil'
  | 'Life Engine'

export type MemoryConfidence = 'alta' | 'média' | 'baixa'

export type MemoryRecord = {
  id: string
  title: string
  description: string
  category: MemoryCategory
  origin: MemoryOrigin
  confidence: MemoryConfidence
  updatedAt: string
}

export type MemoryInsight = {
  title: string
  message: string
  recommendation: string
}

export type MemoryTimelineEvent = {
  id: string
  date: string
  title: string
  description: string
  source: MemoryOrigin
}

export type MemoryEngineMock = {
  memories: MemoryRecord[]
  insight: MemoryInsight
  timeline: MemoryTimelineEvent[]
}
