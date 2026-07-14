import { StyleSheet } from 'react-native'
import { Button } from '@/design-system/components/Button'
import { GlassCard } from '@/design-system/components/GlassCard'
import { Screen } from '@/design-system/components/Screen'
import { LifeText } from '@/design-system/components/Text'
import { spacing } from '@/design-system/tokens'
import { useAuth } from '@/features/auth/context/AuthContext'
import { listGoals, listHabits, listJournalEntries } from '@/features/data/mobile-data.service'
import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const [stats, setStats] = useState({ habits: 0, goals: 0, journal: 0 })

  useFocusEffect(
    useCallback(() => {
      let active = true

      async function load() {
        const [habits, goals, journal] = await Promise.all([listHabits(), listGoals(), listJournalEntries()])
        if (active) {
          setStats({
            habits: habits.summary.active,
            goals: goals.length,
            journal: journal.length,
          })
        }
      }

      load()
      return () => {
        active = false
      }
    }, []),
  )

  return (
    <Screen>
      <LifeText variant="eyebrow">Perfil</LifeText>
      <LifeText variant="title">Conta LifeOS</LifeText>
      <GlassCard style={styles.card}>
        <LifeText variant="subtitle">{user?.email ?? 'Usuario LifeOS'}</LifeText>
        <LifeText variant="caption">
          Sessao persistente ativa com Supabase quando configurado e fallback local quando necessario.
        </LifeText>
        <LifeText variant="caption">Hábitos: {stats.habits} · Metas: {stats.goals} · Diário: {stats.journal}</LifeText>
        <Button onPress={signOut} variant="secondary">Sair</Button>
      </GlassCard>
    </Screen>
  )
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
})
