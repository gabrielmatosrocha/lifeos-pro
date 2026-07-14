import { StyleSheet, View } from 'react-native'
import { colors, radius, spacing } from '@/design-system/tokens'
import { LifeText } from '@/design-system/components/Text'

type StatPillProps = {
  label: string
  value: string
}

export function StatPill({ label, value }: StatPillProps) {
  return (
    <View style={styles.root}>
      <LifeText variant="caption">{label}</LifeText>
      <LifeText variant="subtitle">{value}</LifeText>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
})
