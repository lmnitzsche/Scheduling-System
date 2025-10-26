<template>
  <div 
    class="quest-card transform transition-all duration-300 hover:scale-105 relative overflow-hidden"
    :class="[
      difficultyClass,
      { 'opacity-50': quest.isCompleted },
      { 'border-red-500 animate-pulse': isOverdue }
    ]"
  >
    <!-- Completion Overlay -->
    <div 
      v-if="quest.isCompleted"
      class="absolute inset-0 bg-quest-success/20 flex items-center justify-center z-10"
    >
      <div class="text-6xl opacity-50">✅</div>
    </div>

    <!-- Difficulty Badge -->
    <div class="absolute top-2 right-2 z-20">
      <span :class="difficultyBadgeClass" class="px-2 py-1 rounded-full text-xs font-bold">
        {{ quest.difficulty }}
      </span>
    </div>

    <!-- Quest Content -->
    <div class="p-4">
      <!-- Title and Description -->
      <div class="mb-3">
        <h3 class="font-bold text-lg mb-1" :class="{ 'line-through': quest.isCompleted }">
          {{ quest.title }}
        </h3>
        <p class="text-sm text-gray-300 line-clamp-2">
          {{ quest.description }}
        </p>
      </div>

      <!-- Tags -->
      <div v-if="quest.tags.length" class="flex flex-wrap gap-1 mb-3">
        <span 
          v-for="tag in quest.tags" 
          :key="tag"
          class="bg-quest-darker px-2 py-1 rounded-full text-xs text-quest-accent"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Quest Details -->
      <div class="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
        <div class="flex items-center space-x-1">
          <span>⏱️</span>
          <span>{{ quest.estimatedTime }}min</span>
        </div>
        <div class="flex items-center space-x-1">
          <span>📅</span>
          <span>{{ formatDate(quest.dueDate) }}</span>
        </div>
        <div class="flex items-center space-x-1">
          <span>⭐</span>
          <span>{{ quest.xpReward }} XP</span>
        </div>
        <div class="flex items-center space-x-1">
          <span>💰</span>
          <span>{{ quest.coinReward }} coins</span>
        </div>
      </div>

      <!-- Priority Indicator -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-1">
          <span>🎯</span>
          <span :class="priorityClass" class="text-xs font-bold">
            {{ quest.priority }}
          </span>
        </div>
        
        <!-- Category -->
        <span class="bg-quest-primary px-2 py-1 rounded text-xs">
          {{ quest.category }}
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-2">
        <button 
          v-if="!quest.isCompleted"
          @click="$emit('complete', quest.id)"
          class="btn-success flex-1 py-2 text-sm transform hover:scale-105 transition-all"
        >
          Complete Quest! 🎉
        </button>
        <button 
          v-else
          disabled
          class="bg-gray-600 text-gray-300 flex-1 py-2 rounded text-sm cursor-not-allowed"
        >
          Completed! ✨
        </button>
        
        <button 
          @click="$emit('edit', quest.id)"
          class="bg-quest-secondary hover:bg-cyan-600 px-4 py-2 rounded text-sm transition-colors"
        >
          ✏️
        </button>
        
        <button 
          @click="$emit('delete', quest.id)"
          class="bg-quest-danger hover:bg-red-600 px-4 py-2 rounded text-sm transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>

    <!-- Overdue Warning -->
    <div 
      v-if="isOverdue && !quest.isCompleted"
      class="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-center text-xs py-1 font-bold"
    >
      ⚠️ OVERDUE! ⚠️
    </div>

    <!-- Animated Border for Epic/Legendary quests -->
    <div 
      v-if="quest.difficulty === 'Epic' || quest.difficulty === 'Legendary'"
      class="absolute inset-0 pointer-events-none"
    >
      <div class="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-lg animate-pulse opacity-30"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import type { Quest } from '@/types'

interface Props {
  quest: Quest
}

const props = defineProps<Props>()

defineEmits<{
  complete: [questId: string]
  edit: [questId: string]
  delete: [questId: string]
}>()

const isOverdue = computed(() => {
  return !props.quest.isCompleted && new Date(props.quest.dueDate) < new Date()
})

const difficultyClass = computed(() => {
  switch (props.quest.difficulty) {
    case 'Easy':
      return 'border-green-500 bg-green-900/20'
    case 'Medium':
      return 'border-yellow-500 bg-yellow-900/20'
    case 'Hard':
      return 'border-orange-500 bg-orange-900/20'
    case 'Epic':
      return 'border-purple-500 bg-purple-900/20'
    case 'Legendary':
      return 'border-pink-500 bg-pink-900/20'
    default:
      return 'border-quest-primary'
  }
})

const difficultyBadgeClass = computed(() => {
  switch (props.quest.difficulty) {
    case 'Easy':
      return 'bg-green-600 text-white'
    case 'Medium':
      return 'bg-yellow-600 text-black'
    case 'Hard':
      return 'bg-orange-600 text-white'
    case 'Epic':
      return 'bg-purple-600 text-white animate-pulse'
    case 'Legendary':
      return 'bg-pink-600 text-white animate-pulse'
    default:
      return 'bg-quest-primary text-white'
  }
})

const priorityClass = computed(() => {
  switch (props.quest.priority) {
    case 'Critical':
      return 'text-red-500'
    case 'High':
      return 'text-orange-500'
    case 'Medium':
      return 'text-yellow-500'
    case 'Low':
      return 'text-green-500'
    default:
      return 'text-gray-500'
  }
})

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, HH:mm')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.quest-card {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%);
  backdrop-filter: blur(10px);
}
</style>