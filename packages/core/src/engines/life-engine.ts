import type { LifeAction, Pillar } from '../types/actions'

export type PillarScores = Record<Pillar, number>

export const lifePillars: Pillar[] = [
  'Fé',
  'Saúde',
  'Mente',
  'Conhecimento',
  'Finanças',
  'Propósito',
  'Consistência',
]

const impactByType: Record<string, number> = {
  WATER_LOGGED: 6,
  PRAYER_DONE: 16,
  BIBLE_READING: 16,
  GRATITUDE_WRITTEN: 12,
  WORKOUT_DONE: 16,
  RUN_COMPLETED: 20,
  STUDY_SESSION: 18,
  MOOD_CHECKIN: 8,
  JOURNAL_ENTRY: 12,
  FINANCE_ENTRY: 10,
  DAY_CLOSED: 12,
}

export function calculateRhythm(actionsCount: number) {
  return Math.min(100, actionsCount * 12)
}

export function runLifeEngine(actions: LifeAction[]) {
  const pillarScores = Object.fromEntries(lifePillars.map((pillar) => [pillar, 0])) as PillarScores

  for (const action of actions) {
    const impact = impactByType[action.type] ?? 4
    pillarScores[action.pillar] = Math.min(100, pillarScores[action.pillar] + impact)
    if (action.type !== 'DAY_CLOSED') {
      pillarScores['Consistência'] = Math.min(100, pillarScores['Consistência'] + 4)
    }
  }

  const lifeScore = Math.round(
    pillarScores.Fé * 0.2 +
      pillarScores.Saúde * 0.2 +
      pillarScores.Mente * 0.15 +
      pillarScores.Conhecimento * 0.15 +
      pillarScores.Finanças * 0.1 +
      pillarScores.Propósito * 0.1 +
      pillarScores.Consistência * 0.1,
  )

  const rhythmIndex = Math.round(lifeScore * 0.65 + calculateRhythm(actions.length) * 0.35)
  const classification = lifeScore >= 90 ? 'Excelente' : lifeScore >= 75 ? 'Bom' : lifeScore >= 50 ? 'Regular' : 'Atenção'
  const weakest = lifePillars.reduce(
    (lowest, pillar) => (pillarScores[pillar] < pillarScores[lowest] ? pillar : lowest),
    lifePillars[0],
  )

  return {
    rhythmIndex,
    lifeScore,
    classification,
    pillarScores,
    insight:
      rhythmIndex >= 80
        ? 'Você está mantendo um bom ritmo. Continue sustentando pequenas ações.'
        : `O pilar ${weakest} merece atenção nos próximos dias.`,
    actions,
  }
}
