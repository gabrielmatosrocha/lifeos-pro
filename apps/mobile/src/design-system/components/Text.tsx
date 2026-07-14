import { Text as NativeText, StyleSheet, TextProps } from 'react-native'
import { colors } from '@/design-system/tokens'

type Variant = 'eyebrow' | 'title' | 'subtitle' | 'body' | 'caption'

type LifeTextProps = TextProps & {
  variant?: Variant
}

export function LifeText({ variant = 'body', style, ...props }: LifeTextProps) {
  return <NativeText {...props} style={[styles.base, styles[variant], style]} />
}

const styles = StyleSheet.create({
  base: {
    color: colors.text,
  },
  eyebrow: {
    color: colors.cyan,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  subtitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  body: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
})
