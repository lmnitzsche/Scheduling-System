<template>
  <div class="login-view min-h-screen flex items-center justify-center bg-quest-darker relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-gradient-to-br from-quest-primary/20 via-transparent to-quest-secondary/20"></div>
      <!-- Floating elements -->
      <div 
        v-for="i in 15" 
        :key="i"
        class="absolute rounded-full bg-neon-green opacity-10 animate-pulse"
        :style="{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          width: Math.random() * 6 + 4 + 'px',
          height: Math.random() * 6 + 4 + 'px',
          animationDelay: Math.random() * 3 + 's'
        }"
      ></div>
    </div>

    <!-- Login Form -->
    <div class="relative z-10 w-full max-w-md mx-auto p-6">
      <div class="retro-screen p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="text-6xl mb-4 animate-bounce-slow">🎮</div>
          <h1 class="text-3xl font-bold text-neon-green mb-2">Quest Login</h1>
          <p class="text-gray-300">Enter the realm of productivity!</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-bold text-gray-300 mb-2">
              🧙‍♂️ Hero Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full p-4 bg-quest-darker border-2 border-quest-primary rounded-lg text-white 
                     focus:border-neon-green focus:outline-none transition-colors"
              placeholder="your.email@questland.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-bold text-gray-300 mb-2">
              🗝️ Secret Spell
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full p-4 bg-quest-darker border-2 border-quest-primary rounded-lg text-white 
                     focus:border-neon-green focus:outline-none transition-colors"
              placeholder="Enter your magical password"
            />
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <button 
              type="submit"
              :disabled="isLoading"
              class="btn-primary w-full py-4 text-lg relative overflow-hidden"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
            >
              <span v-if="!isLoading" class="flex items-center justify-center space-x-2">
                <span>🚀</span>
                <span>Begin Quest!</span>
              </span>
              <span v-else class="flex items-center justify-center space-x-2">
                <span class="animate-spin">⚡</span>
                <span>Entering the realm...</span>
              </span>
              
              <!-- Loading overlay -->
              <div 
                v-if="isLoading"
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                       transform -skew-x-12 animate-pulse"
              ></div>
            </button>

            <div class="text-center">
              <span class="text-gray-400 text-sm">or</span>
            </div>

            <button 
              type="button"
              @click="handleGuestLogin"
              class="btn-secondary w-full py-4 text-lg"
            >
              <span class="flex items-center justify-center space-x-2">
                <span>👤</span>
                <span>Enter as Guest Hero</span>
              </span>
            </button>
          </div>
        </form>

        <!-- Sign Up Link -->
        <div class="text-center mt-8 pt-6 border-t border-quest-primary">
          <p class="text-gray-400 text-sm mb-2">New to the realm?</p>
          <button 
            @click="handleSignUp"
            class="text-neon-green hover:text-green-300 font-bold transition-colors"
          >
            Create Your Hero Account! ⚔️
          </button>
        </div>

        <!-- Fun Facts -->
        <div class="mt-8 text-center">
          <div class="bg-quest-darker p-4 rounded-lg border border-quest-primary">
            <h3 class="text-sm font-bold text-quest-accent mb-2">⚡ Fun Fact</h3>
            <p class="text-xs text-gray-400">
              {{ randomFact }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Toast -->
    <div 
      v-if="errorMessage"
      class="fixed top-4 right-4 bg-quest-danger border-2 border-red-300 text-white p-4 rounded-lg z-50
             transform transition-all duration-300"
    >
      <div class="flex items-center space-x-2">
        <span>⚠️</span>
        <span>{{ errorMessage }}</span>
        <button @click="errorMessage = ''" class="ml-2 hover:text-red-200">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'

const router = useRouter()
const playerStore = usePlayerStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const funFacts = [
  "The average quest completion gives you more satisfaction than eating chocolate! 🍫",
  "Studies show that gamified productivity increases completion rates by 300%! 📈",
  "Every level up releases real dopamine - it's like natural candy for your brain! 🧠",
  "The most productive heroes complete their hardest quests in the morning! 🌅",
  "Legendary quests are rare but give the most epic rewards! 🏆",
  "Your quest streak is more powerful than any magic spell! ✨",
  "Even mighty dragons need to organize their treasure hoards! 🐉",
  "The secret to productivity? Making it fun, obviously! 🎉"
]

const randomFact = computed(() => {
  return funFacts[Math.floor(Math.random() * funFacts.length)]
})

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = "Please enter both email and password, brave hero!"
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // TODO: Implement Supabase authentication
    // For now, simulate login
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
    
    // Mock successful login
    await playerStore.loadPlayerData()
    
    // Show success message
    playerStore.showNotification({
      id: Date.now().toString(),
      type: 'achievement',
      title: 'Welcome back, hero! 🎉',
      message: 'Your quest continues...',
      createdAt: new Date().toISOString(),
      isRead: false
    })

    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = "Login failed! Check your credentials, young adventurer! 🔍"
  } finally {
    isLoading.value = false
  }
}

const handleGuestLogin = async () => {
  isLoading.value = true
  
  try {
    // Create a guest player
    await playerStore.loadPlayerData()
    
    playerStore.showNotification({
      id: Date.now().toString(),
      type: 'achievement',
      title: 'Welcome, Guest Hero! 👋',
      message: 'Explore the realm of productivity!',
      createdAt: new Date().toISOString(),
      isRead: false
    })

    router.push('/dashboard')
  } finally {
    isLoading.value = false
  }
}

const handleSignUp = () => {
  // TODO: Implement sign up functionality
  errorMessage.value = "Sign up coming soon! Use Guest mode for now! 🚧"
}

onMounted(() => {
  // Check if already logged in
  if (playerStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>

<style scoped>
.retro-screen {
  box-shadow: 
    0 0 30px rgba(139, 92, 246, 0.3),
    inset 0 0 20px rgba(57, 255, 20, 0.1);
}

input:focus {
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
}
</style>