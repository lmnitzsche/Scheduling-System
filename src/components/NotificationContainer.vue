<template>
  <div class="notification-container fixed top-4 right-4 z-50 space-y-2">
    <TransitionGroup
      name="notification"
      tag="div"
      class="space-y-2"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'notification transform transition-all duration-500',
          getNotificationClass(notification.type)
        ]"
        @click="removeNotification(notification.id)"
      >
        <div class="flex items-center space-x-3">
          <div class="text-2xl">
            {{ getNotificationIcon(notification.type) }}
          </div>
          <div class="flex-1">
            <h4 class="font-bold text-sm">{{ notification.title }}</h4>
            <p class="text-xs opacity-90">{{ notification.message }}</p>
          </div>
          <button class="text-white/60 hover:text-white transition-colors">
            ✕
          </button>
        </div>
        
        <!-- Special effects for achievements and level ups -->
        <div 
          v-if="notification.type === 'achievement' || notification.type === 'levelUp'"
          class="absolute inset-0 pointer-events-none"
        >
          <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent 
                      transform -skew-x-12 animate-pulse"></div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import type { Notification } from '@/types'

const playerStore = usePlayerStore()
const notifications = computed(() => playerStore.notifications)

const removeNotification = (id: string) => {
  playerStore.notifications = playerStore.notifications.filter(n => n.id !== id)
}

const getNotificationClass = (type: Notification['type']) => {
  switch (type) {
    case 'achievement':
      return 'notification-achievement bg-gradient-to-r from-purple-600 to-pink-600 border-2 border-yellow-400'
    case 'levelUp':
      return 'notification-levelup bg-gradient-to-r from-green-500 to-blue-500 border-2 border-neon-green'
    case 'questComplete':
      return 'notification success border-2 border-green-400'
    case 'reminder':
      return 'notification warning border-2 border-yellow-400'
    case 'streak':
      return 'notification-streak bg-gradient-to-r from-orange-500 to-red-500 border-2 border-orange-300'
    default:
      return 'notification'
  }
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'achievement':
      return '🏆'
    case 'levelUp':
      return '⭐'
    case 'questComplete':
      return '✅'
    case 'reminder':
      return '⏰'
    case 'streak':
      return '🔥'
    default:
      return '📢'
  }
}
</script>

<style scoped>
.notification {
  @apply p-4 rounded-lg shadow-lg max-w-sm cursor-pointer backdrop-blur-sm;
  animation: slideIn 0.5s ease-out;
}

.notification-achievement {
  animation: achievement 0.8s ease-out;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
}

.notification-levelup {
  animation: levelup 1s ease-out;
  box-shadow: 0 0 30px rgba(57, 255, 20, 0.7);
}

.notification-streak {
  box-shadow: 0 0 25px rgba(255, 165, 0, 0.6);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes achievement {
  0% {
    transform: scale(0.8) rotate(-5deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) rotate(2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes levelup {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  25% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(0.9);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Transition group animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.5s ease;
}
</style>