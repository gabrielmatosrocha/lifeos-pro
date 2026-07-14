import { Pressable, StyleSheet, Text } from 'react-native'
import { colors, radius, spacing } from '@/design-system/tokens'

type ButtonProps = {
  children: string
  onPress: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export function Button({ children, onPress, variant = 'primary', disabled }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.label, variant === 'secondary' ? styles.secondaryLabel : null]}>{children}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.md,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  primary: {
    backgroundColor: colors.cyan,
  },
  secondary: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  label: {
    color: '#06111f',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryLabel: {
    color: colors.text,
  },
})
