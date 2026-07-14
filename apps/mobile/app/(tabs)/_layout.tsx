import { Redirect, Tabs } from 'expo-router'
import { useAuth } from '@/features/auth/context/AuthContext'
import { colors } from '@/design-system/tokens'

export default function TabsLayout() {
  const { user, isLoading } = useAuth()

  if (!isLoading && !user) {
    return <Redirect href="/login" />
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.cyan,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: '#020617',
        },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Hoje' }} />
      <Tabs.Screen name="habitos" options={{ title: 'Habitos' }} />
      <Tabs.Screen name="metas" options={{ title: 'Metas' }} />
      <Tabs.Screen name="diario" options={{ title: 'Diario' }} />
      <Tabs.Screen name="evolucao" options={{ title: 'Evolucao' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  )
}
