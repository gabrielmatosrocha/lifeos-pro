export type ReviewPeriod = 'daily' | 'weekly' | 'monthly'

export type LifeReviewSummary = {
  id: string
  period: ReviewPeriod
  title: string
  summary: string
  wins: string[]
  risks: string[]
  nextStep: string
}
