import { Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'
import { useAuth } from '@/features/auth/context/AuthContext'
import { colors } from '@/design-system/tokens'

export default function IndexRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.cyan} />
      </View>
    )
  }

  return <Redirect href={user ? '/dashboard' : '/login'} />
}
