import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { Button } from '@/design-system/components/Button'
import { GlassCard } from '@/design-system/components/GlassCard'
import { Input } from '@/design-system/components/Input'
import { Screen } from '@/design-system/components/Screen'
import { LifeText } from '@/design-system/components/Text'
import { createJournalEntry, listJournalEntries } from '@/features/data/mobile-data.service'
import type { JournalEntry } from '@lifeos/core'

export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [reflection, setReflection] = useState('')
  const [gratitude, setGratitude] = useState('')

  async function refresh() {
    setEntries(await listJournalEntries())
  }

  useFocusEffect(
    useCallback(() => {
      refresh()
    }, []),
  )

  async function handleCreate() {
    if (!reflection.trim()) {
      return
    }

    setEntries(await createJournalEntry({
      title: 'Reflexão do dia',
      mood: 'Bom',
      reflection,
      gratitude,
    }))
    setReflection('')
    setGratitude('')
  }

  return (
    <Screen>
      <LifeText variant="eyebrow">Diário</LifeText>
      <LifeText variant="title">Registro do dia</LifeText>
      <GlassCard>
        <LifeText variant="subtitle">Nova reflexão</LifeText>
        <Input multiline onChangeText={setReflection} placeholder="O que você aprendeu hoje?" value={reflection} />
        <Input onChangeText={setGratitude} placeholder="Uma gratidão" value={gratitude} />
        <Button disabled={!reflection.trim()} onPress={handleCreate}>Salvar reflexão</Button>
      </GlassCard>
      {entries.map((entry) => (
        <GlassCard key={entry.id}>
          <LifeText variant="subtitle">{entry.title}</LifeText>
          <LifeText variant="caption">{entry.entry_date} · {entry.mood}</LifeText>
          <LifeText variant="body">{entry.reflection}</LifeText>
          {entry.gratitude ? <LifeText variant="caption">Gratidão: {entry.gratitude}</LifeText> : null}
        </GlassCard>
      ))}
    </Screen>
  )
}
