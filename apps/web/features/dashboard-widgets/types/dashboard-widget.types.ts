import type { ReactNode } from 'react'

export type DashboardWidgetKind =
  | 'today'
  | 'coach'
  | 'next-goal'
  | 'pending-habits'
  | 'workout'
  | 'run'
  | 'weekly-review'
  | 'spiritual'
  | 'journal'
  | 'streak'
  | 'achievement'
  | 'milestone'

export type DashboardWidget = {
  id: string
  kind: DashboardWidgetKind
  title: string
  value: string
  description: string
  icon?: ReactNode
  priority: number
}
