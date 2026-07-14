import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { Button } from '@/design-system/components/Button'
import { GlassCard } from '@/design-system/components/GlassCard'
import { Input } from '@/design-system/components/Input'
import { Screen } from '@/design-system/components/Screen'
import { LifeText } from '@/design-system/components/Text'
import { colors, spacing } from '@/design-system/tokens'
import { completeHabit, createHabit, listHabits } from '@/features/data/mobile-data.service'
import type { HabitEngineState, HabitRecord } from '@lifeos/core'

export default function HabitsScreen() {
  const [state, setState] = useState<HabitEngineState | null>(null)
  const [title, setTitle] = useState('')

  async function refresh() {
    setState(await listHabits())
  }

  useFocusEffect(
    useCallback(() => {
      refresh()
    }, []),
  )

  async function handleCreate() {
    if (!title.trim()) {
      return
    }

    setState(await createHabit({
      title,
      description: 'Criado pelo LifeOS Mobile.',
      frequency: 'daily',
      checklist: ['Concluir hoje'],
      weight: 6,
      priority: 'media',
    }))
    setTitle('')
  }

  async function handleComplete(habit: HabitRecord) {
    setState(await completeHabit(habit))
  }

  return (
    <Screen>
      <LifeText variant="eyebrow">Hábitos</LifeText>
      <LifeText variant="title">Missões do dia</LifeText>
      <GlassCard>
        <LifeText variant="caption">Concluídos hoje</LifeText>
        <LifeText variant="subtitle">{state?.summary.completedToday ?? 0} de {state?.summary.active ?? 0}</LifeText>
      </GlassCard>
      <GlassCard>
        <LifeText variant="subtitle">Novo hábito</LifeText>
        <Input onChangeText={setTitle} placeholder="Ex: Beber água" value={title} />
        <Button disabled={!title.trim()} onPress={handleCreate}>Criar hábito</Button>
      </GlassCard>
      {(state?.habits ?? []).map((habit) => (
        <GlassCard key={habit.id}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <LifeText variant="subtitle">{habit.title}</LifeText>
              <LifeText variant="caption">{habit.description ?? 'Hábito do LifeOS'} · streak {habit.streak}</LifeText>
            </View>
            <LifeText variant="caption" style={styles.priority}>{habit.priority}</LifeText>
          </View>
          <Button onPress={() => handleComplete(habit)}>Concluir hoje</Button>
        </GlassCard>
      ))}
    </Screen>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  priority: {
    color: colors.cyan,
  },
})
