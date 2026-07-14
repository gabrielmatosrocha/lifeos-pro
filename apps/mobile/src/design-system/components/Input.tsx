import { StyleSheet, TextInput, TextInputProps } from 'react-native'
import { colors, radius, spacing } from '@/design-system/tokens'

export function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      {...props}
      style={[styles.input, props.style]}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceStrong,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: spacing.md,
  },
})
