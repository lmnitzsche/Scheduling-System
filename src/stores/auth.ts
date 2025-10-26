import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth } from '@/lib/supabase'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  const setError = (message: string) => {
    error.value = message
    setTimeout(() => {
      error.value = null
    }, 5000)
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await auth.signIn(email, password)
      if (result?.user) {
        user.value = {
          id: result.user.id,
          email: result.user.email!,
          name: result.user.user_metadata?.name,
          createdAt: result.user.created_at
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
      throw err
    } finally {
      loading.value = false
    }
  }

  const signUp = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await auth.signUp(email, password)
      if (result?.user) {
        user.value = {
          id: result.user.id,
          email: result.user.email!,
          name: result.user.user_metadata?.name,
          createdAt: result.user.created_at
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
      throw err
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    
    try {
      await auth.signOut()
      user.value = null
    } catch (err: any) {
      setError(err.message || 'Failed to sign out')
    } finally {
      loading.value = false
    }
  }

  const initializeAuth = () => {
    return auth.onAuthStateChange((authUser) => {
      if (authUser) {
        user.value = {
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name,
          createdAt: authUser.created_at
        }
      } else {
        user.value = null
      }
    })
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    initializeAuth,
    setError
  }
})