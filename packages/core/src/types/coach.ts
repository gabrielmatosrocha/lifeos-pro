import type { LifeAction } from './actions'
import type { DreamRecord } from './dream'
import type { MemoryRecord } from './memory'
import type { PillarScores } from '../engines/life-engine'

export type CoachDomain = 'executivo' | 'saude' | 'espiritual' | 'mental' | 'estrategico'
export type CoachTone = 'elogio' | 'incentivo' | 'firme' | 'alerta' | 'calmo'

export type CoachSignal = {
  id: string
  source: 'life-engine' | 'dream-engine' | 'memory-engine' | 'evolution' | 'actions'
  domain: CoachDomain
  confidence: 'baixa' | 'media' | 'alta'
  urgency: 'baixa' | 'media' | 'alta'
  summary: string
}

export type CoachAdvice = {
  id: string
  title: string
  message: string
  domain: CoachDomain
  tone: CoachTone
  action: string
  reason: string
  signal: CoachSignal
}

export type CoachReview = {
  id: string
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  title: string
  summary: string
  wins: string[]
  risks: string[]
  nextAdjustment: string
}

export type CoachContext<TEvolution = unknown> = {
  actions: LifeAction[]
  dreams: DreamRecord[]
  memories: MemoryRecord[]
  evolution: TEvolution
  lifeScore: number
  rhythmIndex: number
  pillarScores: PillarScores
  completedHabits: number
  pendingHabits: number
  spiritualEnabled?: boolean
}
