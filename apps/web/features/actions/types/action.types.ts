export type Pillar =
  | 'Fé'
  | 'Saúde'
  | 'Mente'
  | 'Conhecimento'
  | 'Finanças'
  | 'Propósito'
  | 'Consistência'

export type LifeAction = {
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
}
