import type { Pillar } from '@/features/actions/types/action.types'

export type DailyActionRecord = {
  id: string
  user_id: string
  type: string
  pillar: Pillar
  title: string
  value: number | null
  unit: string | null
  occurred_at: string
  source: string
  notes: string | null
  created_at?: string
  status?: 'completed' | 'pending'
  category?: Pillar
}
