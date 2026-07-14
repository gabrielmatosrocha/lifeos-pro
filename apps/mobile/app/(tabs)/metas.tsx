import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { Button } from '@/design-system/components/Button'
import { GlassCard } from '@/design-system/components/GlassCard'
import { Input } from '@/design-system/components/Input'
import { Screen } from '@/design-system/components/Screen'
import { LifeText } from '@/design-system/components/Text'
import { spacing } from '@/design-system/tokens'
import { createGoal, listGoals, updateGoalProgress } from '@/features/data/mobile-data.service'
import type { GoalRecord } from '@lifeos/core'

export default function GoalsScreen() {
  const [goals, setGoals] = useState<GoalRecord[]>([])
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('10')

  async function refresh() {
    setGoals(await listGoals())
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

    setGoals(await createGoal({
      title,
      description: 'Meta criada pelo LifeOS Mobile.',
      deadline: 'Próximos 90 dias',
      priority: 'media',
      pillar: 'Propósito',
      horizon: '90 dias',
      target_value: Math.max(1, Number(target) || 1),
      unit: 'ações',
      status: 'active',
    }))
    setTitle('')
  }

  return (
    <Screen>
      <LifeText variant="eyebrow">Metas</LifeText>
      <LifeText variant="title">Objetivos executáveis</LifeText>
      <GlassCard>
        <LifeText variant="subtitle">Nova meta</LifeText>
        <Input onChangeText={setTitle} placeholder="Ex: Correr 10 km" value={title} />
        <Input keyboardType="numeric" onChangeText={setTarget} placeholder="Alvo" value={target} />
        <Button disabled={!title.trim()} onPress={handleCreate}>Criar meta</Button>
      </GlassCard>
      {goals.map((goal) => {
        const progress = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))

        return (
          <GlassCard key={goal.id}>
            <View style={styles.row}>
              <View style={styles.flex}>
                <LifeText variant="subtitle">{goal.title}</LifeText>
                <LifeText variant="caption">{goal.current_value}/{goal.target_value} {goal.unit} · {progress}%</LifeText>
              </View>
              <LifeText variant="caption">{goal.priority ?? 'media'}</LifeText>
            </View>
            <Button onPress={() => updateGoalProgress(goal, Math.min(goal.target_value, goal.current_value + 1)).then(setGoals)}>
              Avançar progresso
            </Button>
          </GlassCard>
        )
      })}
    </Screen>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
})
