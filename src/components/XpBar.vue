<template>
  <div class="xp-bar-container p-4 bg-quest-dark rounded-lg border-2 border-quest-primary">
    <!-- Player Info Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div class="text-3xl">{{ player?.avatar || '🎮' }}</div>
        <div>
          <h3 class="text-lg font-bold text-neon-green">{{ player?.username || 'Hero' }}</h3>
          <p class="text-sm text-quest-accent">{{ currentTitle }}</p>
        </div>
      </div>
      
      <div class="text-right">
        <div class="flex items-center space-x-2">
          <span class="text-yellow-400">💰</span>
          <span class="font-bold text-quest-accent">{{ player?.coins || 0 }}</span>
        </div>
      </div>
    </div>

    <!-- Level and XP Display -->
    <div class="mb-2">
      <div class="flex justify-between items-center mb-1">
        <span class="text-sm font-bold text-neon-blue">Level {{ currentLevel }}</span>
        <span class="text-xs text-gray-300">
          {{ Math.floor(xpProgress) }}% to Level {{ currentLevel + 1 }}
        </span>
      </div>
      
      <!-- XP Progress Bar -->
      <div class="xp-bar">
        <div 
          class="progress-fill transition-all duration-1000 ease-out relative overflow-hidden"
          :style="{ width: `${Math.min(xpProgress, 100)}%` }"
        >
          <!-- Animated shimmer effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                      transform -skew-x-12 animate-pulse"></div>
        </div>
      </div>
      
      <!-- XP Numbers -->
      <div class="flex justify-between text-xs text-gray-400 mt-1">
        <span>{{ currentXp }} XP</span>
        <span>{{ xpToNextLevel }} XP to next level</span>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-3 gap-2 text-center text-xs">
      <div class="bg-quest-darker rounded p-2">
        <div class="text-quest-success font-bold">{{ stats?.questsCompleted || 0 }}</div>
        <div class="text-gray-400">Quests</div>
      </div>
      <div class="bg-quest-darker rounded p-2">
        <div class="text-neon-pink font-bold">{{ stats?.currentStreak || 0 }}</div>
        <div class="text-gray-400">Streak</div>
      </div>
      <div class="bg-quest-darker rounded p-2">
        <div class="text-neon-blue font-bold">{{ Math.floor((stats?.totalTimeSpent || 0) / 60) }}h</div>
        <div class="text-gray-400">Time</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()

const player = computed(() => playerStore.player)
const stats = computed(() => playerStore.stats)
const currentLevel = computed(() => playerStore.currentLevel)
const currentXp = computed(() => playerStore.currentXp)
const xpToNextLevel = computed(() => playerStore.xpToNextLevel)
const currentTitle = computed(() => playerStore.currentTitle)
const xpProgress = computed(() => playerStore.xpProgress)
</script>

<style scoped>
.xp-bar-container {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
}

.progress-fill {
  background: linear-gradient(90deg, 
    #10B981 0%, 
    #39FF14 50%, 
    #00BFFF 100%
  );
  box-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
}
</style>