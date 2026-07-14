import type { EvolutionHistory } from '@/features/evolution/types/evolution.types'
import type { CoachContext as CoreCoachContext } from '@lifeos/core'

export type {
  CoachAdvice,
  CoachDomain,
  CoachReview,
  CoachSignal,
  CoachTone,
} from '@lifeos/core'

export type CoachContext = CoreCoachContext<EvolutionHistory>
