<template>
  <nav class="bg-quest-dark border-b-2 border-quest-primary sticky top-0 z-50 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Title -->
        <div class="flex items-center space-x-3">
          <router-link to="/" class="flex items-center space-x-2 hover:text-neon-green transition-colors">
            <div class="text-2xl">🎮</div>
            <div>
              <h1 class="text-xl font-bold text-neon-green">Quest Scheduler</h1>
              <p class="text-xs text-quest-accent -mt-1">Level Up Your Life!</p>
            </div>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-6">
          <router-link 
            v-for="link in navLinks" 
            :key="link.name"
            :to="link.path"
            class="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                   hover:bg-quest-primary hover:text-white transform hover:scale-105"
            :class="{ 'bg-quest-primary text-white': $route.path === link.path }"
          >
            <span class="text-lg">{{ link.icon }}</span>
            <span>{{ link.name }}</span>
          </router-link>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <!-- Quick Stats -->
          <div class="hidden sm:flex items-center space-x-3 text-sm">
            <div class="flex items-center space-x-1 bg-quest-darker px-3 py-1 rounded-full">
              <span>💰</span>
              <span class="font-bold text-quest-accent">{{ playerStore.player?.coins || 0 }}</span>
            </div>
            <div class="flex items-center space-x-1 bg-quest-darker px-3 py-1 rounded-full">
              <span>⭐</span>
              <span class="font-bold text-neon-blue">Lv.{{ playerStore.currentLevel }}</span>
            </div>
          </div>

          <!-- User Avatar/Profile -->
          <div class="relative">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 bg-quest-primary px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <span class="text-lg">{{ playerStore.player?.avatar || '🎮' }}</span>
              <span class="hidden sm:block text-sm font-medium">{{ playerStore.player?.username || 'Hero' }}</span>
              <ChevronDownIcon class="w-4 h-4" />
            </button>

            <!-- Dropdown Menu -->
            <div 
              v-if="showUserMenu"
              v-click-outside="() => showUserMenu = false"
              class="absolute right-0 mt-2 w-48 bg-quest-dark border-2 border-quest-primary rounded-lg shadow-lg z-50"
            >
              <div class="py-1">
                <router-link 
                  to="/profile" 
                  class="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-quest-primary transition-colors"
                  @click="showUserMenu = false"
                >
                  <span>👤</span>
                  <span>Profile</span>
                </router-link>
                <router-link 
                  to="/achievements" 
                  class="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-quest-primary transition-colors"
                  @click="showUserMenu = false"
                >
                  <span>🏆</span>
                  <span>Achievements</span>
                </router-link>
                <hr class="border-quest-primary">
                <button 
                  @click="logout"
                  class="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-quest-danger transition-colors w-full text-left"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button 
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-quest-primary transition-colors"
          >
            <Bars3Icon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div 
        v-if="showMobileMenu"
        class="md:hidden border-t border-quest-primary pt-4 pb-4"
      >
        <div class="space-y-2">
          <router-link 
            v-for="link in navLinks" 
            :key="link.name"
            :to="link.path"
            class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                   hover:bg-quest-primary"
            :class="{ 'bg-quest-primary': $route.path === link.path }"
            @click="showMobileMenu = false"
          >
            <span class="text-lg">{{ link.icon }}</span>
            <span>{{ link.name }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { ChevronDownIcon, Bars3Icon } from '@heroicons/vue/24/outline'

const router = useRouter()
const playerStore = usePlayerStore()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { name: 'Quest Log', path: '/quests', icon: '📋' },
  { name: 'Calendar', path: '/calendar', icon: '📅' },
  { name: 'Achievements', path: '/achievements', icon: '🏆' },
]

const logout = () => {
  // TODO: Implement logout with Supabase
  localStorage.removeItem('supabase.auth.token')
  playerStore.player = null
  router.push('/login')
  showUserMenu.value = false
}

// Click outside directive would need to be implemented
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = function(event: Event) {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
nav {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%);
}
</style>