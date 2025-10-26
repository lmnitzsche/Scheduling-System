<template>
  <div 
    class="quest-helper fixed bottom-6 right-6 z-40 floating-animation"
    v-if="shouldShow"
  >
    <!-- Helper Character -->
    <div class="relative">
      <!-- Chat Bubble -->
      <div 
        v-if="showMessage"
        class="bg-quest-primary text-white p-3 rounded-lg mb-2 max-w-xs shadow-lg border-2 border-neon-green
               relative transform transition-all duration-300"
        :class="{ 'animate-wiggle': isExcited }"
      >
        <p class="text-sm font-bold">{{ currentMessage.title }}</p>
        <p class="text-xs opacity-90">{{ currentMessage.message }}</p>
        
        <!-- Speech bubble arrow -->
        <div class="absolute bottom-0 right-4 transform translate-y-full">
          <div class="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-quest-primary"></div>
        </div>
        
        <!-- Close button -->
        <button 
          @click="dismissMessage"
          class="absolute -top-2 -right-2 bg-quest-danger rounded-full w-6 h-6 text-xs hover:bg-red-600 transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- Helper Character Avatar -->
      <div 
        @click="toggleMessage"
        class="bg-quest-secondary rounded-full p-4 shadow-lg cursor-pointer transform transition-all duration-200 
               hover:scale-110 border-4 border-neon-blue"
        :class="{ 'animate-bounce': hasNewTip }"
      >
        <div class="text-3xl">{{ currentCharacter.emoji }}</div>
        
        <!-- Notification badge -->
        <div 
          v-if="hasNewTip && !showMessage"
          class="absolute -top-1 -right-1 bg-quest-danger rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse"
        >
          !
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useQuestStore } from '@/stores/quest'

const playerStore = usePlayerStore()
const questStore = useQuestStore()

const showMessage = ref(false)
const hasNewTip = ref(true)
const isExcited = ref(false)
const currentMessageIndex = ref(0)

// Helper characters that change based on level
const characters = [
  { level: 1, emoji: '🤖', name: 'Robo-Helper', personality: 'encouraging' },
  { level: 3, emoji: '🧙‍♂️', name: 'Wizard Guide', personality: 'wise' },
  { level: 5, emoji: '🦸‍♀️', name: 'Super Scheduler', personality: 'heroic' },
  { level: 7, emoji: '🐉', name: 'Productivity Dragon', personality: 'fierce' },
  { level: 10, emoji: '👑', name: 'The Schedule King', personality: 'royal' }
]

const currentCharacter = computed(() => {
  const level = playerStore.currentLevel
  return characters.reverse().find(char => level >= char.level) || characters[0]
})

// Different types of helpful messages
const helpMessages = {
  newPlayer: [
    {
      title: "Welcome, brave adventurer! 🎮",
      message: "I'm here to help you conquer your tasks! Click on me for tips!"
    },
    {
      title: "Let's start your quest! ⚔️",
      message: "Create your first task to begin earning XP and leveling up!"
    }
  ],
  hasOverdue: [
    {
      title: "Uh oh! ⚠️",
      message: "You have overdue quests! Complete them to get back on track!"
    },
    {
      title: "Time to catch up! 🏃‍♂️",
      message: "Those overdue tasks won't complete themselves! You've got this!"
    }
  ],
  motivation: [
    {
      title: "You're doing great! 💪",
      message: "Keep up the momentum! Each completed task makes you stronger!"
    },
    {
      title: "Level up incoming! ⭐",
      message: "You're so close to the next level! Just a few more quests!"
    },
    {
      title: "Productivity master! 🧠",
      message: "Your scheduling skills are legendary! The realm depends on you!"
    }
  ],
  tips: [
    {
      title: "Pro tip! 💡",
      message: "Break large tasks into smaller quests for more XP rewards!"
    },
    {
      title: "Secret strategy! 🤫",
      message: "Complete tasks early for bonus XP! Time management = more rewards!"
    },
    {
      title: "Achievement unlocked! 🏆",
      message: "Try completing 3 tasks in one day for a special achievement!"
    },
    {
      title: "Power move! ⚡",
      message: "Set recurring quests for daily habits - passive XP gain!"
    }
  ]
}

const currentMessage = computed(() => {
  const level = playerStore.currentLevel
  const isNew = playerStore.isNewPlayer
  const hasOverdue = questStore.hasUncompletedOverdueTasks
  
  if (isNew) {
    return helpMessages.newPlayer[currentMessageIndex.value % helpMessages.newPlayer.length]
  } else if (hasOverdue) {
    return helpMessages.hasOverdue[currentMessageIndex.value % helpMessages.hasOverdue.length]
  } else if (level < 5) {
    return helpMessages.motivation[currentMessageIndex.value % helpMessages.motivation.length]
  } else {
    return helpMessages.tips[currentMessageIndex.value % helpMessages.tips.length]
  }
})

const shouldShow = computed(() => {
  const level = playerStore.currentLevel
  const hasOverdue = questStore.hasUncompletedOverdueTasks
  const completedToday = questStore.completedQuestsToday.length
  
  // Show for new players, when there are overdue tasks, or periodically for encouragement
  return level <= 5 || hasOverdue || completedToday === 0
})

const toggleMessage = () => {
  showMessage.value = !showMessage.value
  hasNewTip.value = false
  
  if (showMessage.value) {
    isExcited.value = true
    setTimeout(() => {
      isExcited.value = false
    }, 1000)
  }
}

const dismissMessage = () => {
  showMessage.value = false
  hasNewTip.value = false
}

// Cycle through messages periodically
const cycleMessages = () => {
  currentMessageIndex.value = (currentMessageIndex.value + 1) % 10
  hasNewTip.value = true
}

// Watch for quest completions to show congratulations
watch(() => questStore.completedQuestsToday.length, (newCount, oldCount) => {
  if (newCount > oldCount && newCount > 0) {
    isExcited.value = true
    hasNewTip.value = true
    setTimeout(() => {
      isExcited.value = false
    }, 2000)
  }
})

onMounted(() => {
  // Cycle messages every 30 seconds
  setInterval(cycleMessages, 30000)
  
  // Show initial message for new players
  if (playerStore.isNewPlayer) {
    setTimeout(() => {
      showMessage.value = true
    }, 2000)
  }
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { 
    transform: translateY(0px); 
  }
  50% { 
    transform: translateY(-10px); 
  }
}

.floating-animation {
  animation: float 3s ease-in-out infinite;
}
</style>