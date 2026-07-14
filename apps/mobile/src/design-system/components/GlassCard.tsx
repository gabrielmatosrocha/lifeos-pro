import { BlurView } from 'expo-blur'
import { StyleSheet, ViewStyle } from 'react-native'
import { colors, radius, spacing } from '@/design-system/tokens'

type GlassCardProps = {
  children: React.ReactNode
  style?: ViewStyle
}

export function GlassCard({ children, style }: GlassCardProps) {
  return (
    <BlurView intensity={24} tint="dark" style={[styles.card, style]}>
      {children}
    </BlurView>
  )
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
})
