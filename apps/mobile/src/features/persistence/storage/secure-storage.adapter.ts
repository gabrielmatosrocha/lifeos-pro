import * as SecureStore from 'expo-secure-store'
import type { KeyValueStorage } from '@/features/persistence/types/persistence.types'

export const secureStorageAdapter: KeyValueStorage = {
  getItem(key) {
    return SecureStore.getItemAsync(key)
  },
  setItem(key, value) {
    return SecureStore.setItemAsync(key, value)
  },
  removeItem(key) {
    return SecureStore.deleteItemAsync(key)
  },
}
