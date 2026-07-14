import { StyleSheet, View } from 'react-native'
import { GlassCard } from '@/design-system/components/GlassCard'
import { Screen } from '@/design-system/components/Screen'
import { StatPill } from '@/design-system/components/StatPill'
import { LifeText } from '@/design-system/components/Text'
import { spacing } from '@/design-system/tokens'

type PlatformScreenProps = {
  eyebrow: string
  title: string
  description: string
  stats?: { label: string; value: string }[]
  notes?: string[]
}

export function PlatformScreen({ eyebrow, title, description, stats = [], notes = [] }: PlatformScreenProps) {
  return (
    <Screen>
      <View style={styles.header}>
        <LifeText variant="eyebrow">{eyebrow}</LifeText>
        <LifeText variant="title">{title}</LifeText>
        <LifeText variant="caption">{description}</LifeText>
      </View>

      {stats.length ? (
        <View style={styles.stats}>
          {stats.map((item) => (
            <StatPill key={item.label} label={item.label} value={item.value} />
          ))}
        </View>
      ) : null}

      <GlassCard>
        <LifeText variant="subtitle">Base mobile pronta</LifeText>
        {notes.map((note) => (
          <LifeText key={note} variant="caption">
            {note}
          </LifeText>
        ))}
      </GlassCard>
    </Screen>
  )
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
})
