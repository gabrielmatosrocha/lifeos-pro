import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { calculateRhythm } from '@lifeos/core'
import { PlatformScreen } from '@/screens/PlatformScreen'
import { listGoals, listHabits, listJournalEntries } from '@/features/data/mobile-data.service'

export default function DashboardScreen() {
  const [summary, setSummary] = useState({
    habits: 0,
    completed: 0,
    goals: 0,
    journal: 0,
  })

  useFocusEffect(
    useCallback(() => {
      let active = true

      async function load() {
        const [habitState, goals, journal] = await Promise.all([listHabits(), listGoals(), listJournalEntries()])
        if (!active) {
          return
        }

        setSummary({
          habits: habitState.summary.active,
          completed: habitState.summary.completedToday,
          goals: goals.filter((goal) => goal.status === 'active').length,
          journal: journal.length,
        })
      }

      load()
      return () => {
        active = false
      }
    }, []),
  )

  const rhythm = calculateRhythm(summary.completed + summary.goals + Math.min(summary.journal, 2))

  return (
    <PlatformScreen
      eyebrow="Hoje"
      title="Seu dia no LifeOS"
      description="Resumo vivo usando os mesmos modelos de dados do Web: hábitos, metas e diário."
      stats={[
        { label: 'Ritmo', value: `${rhythm}` },
        { label: 'Hábitos', value: `${summary.completed}/${summary.habits}` },
        { label: 'Metas', value: `${summary.goals}` },
      ]}
      notes={[
        summary.completed > 0 ? 'Você já colocou o dia em movimento.' : 'Comece por um hábito pequeno para ganhar ritmo.',
        summary.journal > 0 ? 'Seu diário já está alimentando contexto para o LifeOS.' : 'Uma reflexão curta hoje já melhora sua clareza.',
      ]}
    />
  )
}
