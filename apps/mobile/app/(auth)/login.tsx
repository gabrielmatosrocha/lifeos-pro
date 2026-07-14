import { Redirect } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { Button } from '@/design-system/components/Button'
import { GlassCard } from '@/design-system/components/GlassCard'
import { Input } from '@/design-system/components/Input'
import { Screen } from '@/design-system/components/Screen'
import { LifeText } from '@/design-system/components/Text'
import { spacing } from '@/design-system/tokens'
import { useAuth } from '@/features/auth/context/AuthContext'

export default function LoginScreen() {
  const { user, signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (user) {
    return <Redirect href="/dashboard" />
  }

  async function handleSubmit() {
    setError(null)
    setIsSubmitting(true)
    const nextError = mode === 'login' ? await signIn(email, password) : await signUp(email, password)
    setError(nextError)
    setIsSubmitting(false)
  }

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
        <View style={styles.hero}>
          <LifeText variant="eyebrow">LifeOS Mobile</LifeText>
          <LifeText variant="title">Seu sistema operacional pessoal no bolso.</LifeText>
          <LifeText variant="caption">
            A mesma plataforma LifeOS, agora preparada para uma experiencia mobile premium.
          </LifeText>
        </View>

        <GlassCard>
          <LifeText variant="subtitle">{mode === 'login' ? 'Entrar' : 'Criar conta'}</LifeText>
          <Input autoCapitalize="none" keyboardType="email-address" onChangeText={setEmail} placeholder="voce@exemplo.com" value={email} />
          <Input onChangeText={setPassword} placeholder="Senha" secureTextEntry value={password} />
          {error ? <LifeText variant="caption" style={styles.error}>{error}</LifeText> : null}
          <Button disabled={isSubmitting || !email || !password} onPress={handleSubmit}>
            {isSubmitting ? 'Aguarde...' : mode === 'login' ? 'Entrar no LifeOS' : 'Criar minha conta'}
          </Button>
          <Button onPress={() => setMode(mode === 'login' ? 'signup' : 'login')} variant="secondary">
            {mode === 'login' ? 'Ainda nao tenho conta' : 'Ja tenho conta'}
          </Button>
        </GlassCard>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  hero: {
    gap: spacing.sm,
  },
  error: {
    color: '#FDA4AF',
  },
})
