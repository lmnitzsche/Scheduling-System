<template>
  <div class="dashboard-view min-h-screen bg-quest-darker p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-neon-green mb-2">
          Welcome back, {{ playerStore.player?.username || 'Hero' }}! 🎮
        </h1>
        <p class="text-gray-300">
          Ready to conquer today's quests? Your productivity adventure awaits!
        </p>
      </div>

      <!-- Top Stats Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Player Progress -->
        <div class="lg:col-span-2">
          <XpBar />
        </div>
        
        <!-- Quick Actions -->
        <div class="card">
          <h3 class="text-lg font-bold text-neon-blue mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <button 
              @click="showCreateQuest = true"
              class="btn-primary w-full py-2 text-sm"
            >
              ⚔️ Create New Quest
            </button>
            <router-link 
              to="/calendar"
              class="btn-secondary w-full py-2 text-sm block text-center"
            >
              📅 View Calendar
            </router-link>
            <router-link 
              to="/achievements"
              class="bg-quest-accent hover:bg-yellow-600 text-quest-darker w-full py-2 text-sm block text-center rounded transition-colors"
            >
              🏆 Achievements
            </router-link>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Today's Quests -->
        <div class="lg:col-span-2">
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-neon-green">Today's Quests 📋</h2>
              <div class="text-sm text-gray-400">
                {{ completedToday.length }} / {{ todaysQuests.length }} completed
              </div>
            </div>

            <!-- Progress Bar for Today -->
            <div class="progress-bar mb-6">
              <div 
                class="progress-fill"
                :style="{ width: `${todayProgress}%` }"
              ></div>
            </div>

            <!-- Quest List -->
            <div v-if="todaysQuests.length === 0" class="text-center py-12">
              <div class="text-6xl mb-4">🎯</div>
              <h3 class="text-xl font-bold text-gray-400 mb-2">No quests for today!</h3>
              <p class="text-gray-500 mb-4">Time to create some epic adventures!</p>
              <button 
                @click="showCreateQuest = true"
                class="btn-primary"
              >
                Create Your First Quest! 🚀
              </button>
            </div>

            <div v-else class="space-y-4">
              <QuestCard
                v-for="quest in todaysQuests"
                :key="quest.id"
                :quest="quest"
                @complete="completeQuest"
                @edit="editQuest"
                @delete="deleteQuest"
              />
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Overdue Quests Warning -->
          <div v-if="overdueQuests.length > 0" class="card border-red-500 bg-red-900/20">
            <div class="flex items-center space-x-2 mb-3">
              <span class="text-2xl">⚠️</span>
              <h3 class="text-lg font-bold text-red-400">Overdue Quests!</h3>
            </div>
            <p class="text-sm text-gray-300 mb-4">
              You have {{ overdueQuests.length }} overdue quest{{ overdueQuests.length !== 1 ? 's' : '' }}. 
              Complete them to get back on track!
            </p>
            <router-link 
              to="/quests"
              class="btn-danger w-full text-center block"
            >
              View Overdue Quests
            </router-link>
          </div>

          <!-- Daily Streak -->
          <div class="card">
            <div class="flex items-center space-x-2 mb-3">
              <span class="text-2xl">🔥</span>
              <h3 class="text-lg font-bold text-neon-pink">Daily Streak</h3>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-neon-pink">{{ playerStore.stats?.currentStreak || 0 }}</div>
              <div class="text-sm text-gray-400">days in a row!</div>
            </div>
            <div class="mt-4 text-xs text-gray-400">
              {{ streakMessage }}
            </div>
          </div>

          <!-- Recent Achievements -->
          <div class="card">
            <div class="flex items-center space-x-2 mb-4">
              <span class="text-2xl">🏆</span>
              <h3 class="text-lg font-bold text-quest-accent">Recent Achievements</h3>
            </div>
            
            <div v-if="recentAchievements.length === 0" class="text-center py-4">
              <div class="text-gray-400 text-sm">
                Complete quests to unlock achievements! 🎯
              </div>
            </div>
            
            <div v-else class="space-y-2">
              <div 
                v-for="achievement in recentAchievements" 
                :key="achievement.id"
                class="bg-quest-darker p-3 rounded-lg border-l-4 border-quest-accent"
              >
                <div class="flex items-center space-x-2">
                  <span class="text-lg">{{ achievement.icon }}</span>
                  <div>
                    <div class="font-bold text-sm">{{ achievement.name }}</div>
                    <div class="text-xs text-gray-400">{{ achievement.description }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <router-link 
              to="/achievements"
              class="btn-secondary w-full mt-4 text-center block text-sm"
            >
              View All Achievements
            </router-link>
          </div>

          <!-- Productivity Tip -->
          <div class="card border-quest-accent bg-yellow-900/10">
            <div class="flex items-center space-x-2 mb-3">
              <span class="text-2xl">💡</span>
              <h3 class="text-lg font-bold text-quest-accent">Pro Tip</h3>
            </div>
            <p class="text-sm text-gray-300">
              {{ dailyTip }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Quest Modal -->
    <div 
      v-if="showCreateQuest"
      class="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
      @click.self="showCreateQuest = false"
    >
      <div class="bg-quest-dark p-6 rounded-lg max-w-md w-full border-2 border-quest-primary">
        <h3 class="text-xl font-bold text-neon-green mb-4">Create New Quest 🎯</h3>
        
        <!-- Quick Quest Form -->
        <form @submit.prevent="createQuest">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-gray-300 mb-2">Quest Title</label>
              <input 
                v-model="newQuest.title"
                type="text" 
                class="w-full p-3 bg-quest-darker border-2 border-quest-primary rounded-lg text-white"
                placeholder="Enter your epic quest..."
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-bold text-gray-300 mb-2">Difficulty</label>
              <select 
                v-model="newQuest.difficulty"
                class="w-full p-3 bg-quest-darker border-2 border-quest-primary rounded-lg text-white"
              >
                <option value="Easy">Easy (25 XP)</option>
                <option value="Medium">Medium (50 XP)</option>
                <option value="Hard">Hard (100 XP)</option>
                <option value="Epic">Epic (200 XP)</option>
                <option value="Legendary">Legendary (500 XP)</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-bold text-gray-300 mb-2">Due Date</label>
              <input 
                v-model="newQuest.dueDate"
                type="datetime-local" 
                class="w-full p-3 bg-quest-darker border-2 border-quest-primary rounded-lg text-white"
                required
              >
            </div>
          </div>
          
          <div class="flex space-x-3 mt-6">
            <button type="submit" class="btn-primary flex-1">
              🚀 Create Quest!
            </button>
            <button 
              type="button"
              @click="showCreateQuest = false"
              class="btn-secondary px-4"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useQuestStore } from '@/stores/quest'
import XpBar from '@/components/XpBar.vue'
import QuestCard from '@/components/QuestCard.vue'

const playerStore = usePlayerStore()
const questStore = useQuestStore()

const showCreateQuest = ref(false)
const newQuest = ref({
  title: '',
  description: '',
  difficulty: 'Medium' as const,
  dueDate: new Date().toISOString().slice(0, 16),
  priority: 'Medium' as const,
  category: 'General',
  estimatedTime: 60,
  tags: [] as string[]
})

// Computed properties
const todaysQuests = computed(() => questStore.todaysQuests)
const overdueQuests = computed(() => questStore.overdueTasks)
const completedToday = computed(() => questStore.completedQuestsToday)

const todayProgress = computed(() => {
  if (todaysQuests.value.length === 0) return 0
  return (completedToday.value.length / todaysQuests.value.length) * 100
})

const streakMessage = computed(() => {
  const streak = playerStore.stats?.currentStreak || 0
  if (streak === 0) return "Start your streak today! 💪"
  if (streak < 3) return "Keep it up! 🔥"
  if (streak < 7) return "You're on fire! 🚀"
  if (streak < 14) return "Incredible consistency! ⭐"
  return "You're a productivity legend! 👑"
})

// Mock achievements for demo
const recentAchievements = ref([
  { id: '1', name: 'First Blood', description: 'Completed first quest', icon: '🗡️' },
  { id: '2', name: 'Early Bird', description: 'Completed quest before due date', icon: '🐦' }
])

const dailyTips = [
  "Break large tasks into smaller quests for more XP!",
  "Complete tasks early for bonus XP rewards!",
  "Set recurring quests for daily habits!",
  "Use different difficulty levels to match your energy!",
  "Check your achievements to see what you can unlock!",
  "The early quest gets the XP! Start your day strong!",
  "Don't forget to celebrate your victories, no matter how small!",
  "Productivity is a superpower - use it wisely!"
]

const dailyTip = computed(() => {
  const today = new Date().getDate()
  return dailyTips[today % dailyTips.length]
})

// Actions
const createQuest = async () => {
  const xpRewards = {
    Easy: 25,
    Medium: 50,
    Hard: 100,
    Epic: 200,
    Legendary: 500
  }

  const questData = {
    ...newQuest.value,
    description: newQuest.value.description || `Complete this ${newQuest.value.difficulty.toLowerCase()} quest to gain XP!`,
    xpReward: xpRewards[newQuest.value.difficulty],
    coinReward: Math.floor(xpRewards[newQuest.value.difficulty] / 2),
    isCompleted: false,
    isRecurring: false
  }

  await questStore.createQuest(questData)
  
  // Reset form
  newQuest.value.title = ''
  newQuest.value.description = ''
  newQuest.value.difficulty = 'Medium'
  newQuest.value.dueDate = new Date().toISOString().slice(0, 16)
  
  showCreateQuest.value = false
}

const completeQuest = async (questId: string) => {
  await questStore.completeQuest(questId)
}

const editQuest = (questId: string) => {
  // TODO: Implement edit functionality
  console.log('Edit quest:', questId)
}

const deleteQuest = async (questId: string) => {
  if (confirm('Are you sure you want to delete this quest?')) {
    await questStore.deleteQuest(questId)
  }
}

onMounted(() => {
  // Load data
  playerStore.loadPlayerData()
  questStore.loadQuests()
})
</script>