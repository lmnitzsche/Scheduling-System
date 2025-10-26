<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Welcome to TaskMaster
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Professional task management made simple
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="authStore.error" class="bg-danger-50 border border-danger-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <ExclamationCircleIcon class="h-5 w-5 text-danger-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm text-danger-800">{{ authStore.error }}</p>
          </div>
        </div>
      </div>

      <!-- Auth Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="input mt-1"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              class="input mt-1"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div class="space-y-4">
          <button
            type="submit"
            :disabled="authStore.loading"
            class="btn-primary w-full"
          >
            <span v-if="!authStore.loading">
              {{ isSignUp ? 'Create Account' : 'Sign In' }}
            </span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSignUp ? 'Creating...' : 'Signing in...' }}
            </span>
          </button>

          <button
            type="button"
            @click="guestLogin"
            class="btn-secondary w-full"
          >
            Continue as Guest
          </button>
        </div>

        <div class="text-center">
          <button
            type="button"
            @click="isSignUp = !isSignUp"
            class="text-sm text-primary-600 hover:text-primary-500"
          >
            {{ isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isSignUp = ref(false)

const handleSubmit = async () => {
  try {
    if (isSignUp.value) {
      await authStore.signUp(email.value, password.value)
    } else {
      await authStore.signIn(email.value, password.value)
    }
    router.push('/dashboard')
  } catch (error) {
    // Error is handled by the store
  }
}

const guestLogin = () => {
  router.push('/dashboard')
}
</script>