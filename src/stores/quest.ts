import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Quest, Achievement } from '@/types'
import { usePlayerStore } from './player'

export const useQuestStore = defineStore('quest', () => {
  // State
  const quests = ref<Quest[]>([])
  const achievements = ref<Achievement[]>([])
  const isLoading = ref(false)
  const selectedDate = ref(new Date())

  // Get player store
  const playerStore = usePlayerStore()

  // Fun quest prefixes and suffixes for auto-generation
  const questPrefixes = [
    'Epic', 'Legendary', 'Mighty', 'Super', 'Ultra', 'Mega', 'Divine', 'Sacred',
    'Ancient', 'Mystical', 'Heroic', 'Noble', 'Grand', 'Supreme', 'Ultimate'
  ]

  const questSuffixes = [
    'of Productivity', 'of Excellence', 'of Achievement', 'of Victory', 'of Glory',
    'of Triumph', 'of Success', 'of Mastery', 'of Greatness', 'of Legend'
  ]

  // Computed
  const todaysQuests = computed(() => {
    const today = new Date().toDateString()
    return quests.value.filter(quest => 
      new Date(quest.dueDate).toDateString() === today
    )
  })

  const overdueTasks = computed(() => {
    const now = new Date()
    return quests.value.filter(quest => 
      !quest.isCompleted && new Date(quest.dueDate) < now
    )
  })

  const hasUncompletedOverdueTasks = computed(() => overdueTasks.value.length > 0)

  const completedQuestsToday = computed(() => {
    const today = new Date().toDateString()
    return quests.value.filter(quest => 
      quest.isCompleted && 
      quest.completedAt &&
      new Date(quest.completedAt).toDateString() === today
    )
  })

  const questsByDifficulty = computed(() => {
    return {
      Easy: quests.value.filter(q => q.difficulty === 'Easy'),
      Medium: quests.value.filter(q => q.difficulty === 'Medium'),
      Hard: quests.value.filter(q => q.difficulty === 'Hard'),
      Epic: quests.value.filter(q => q.difficulty === 'Epic'),
      Legendary: quests.value.filter(q => q.difficulty === 'Legendary')
    }
  })

  // Actions
  const loadQuests = async () => {
    isLoading.value = true
    try {
      // TODO: Load from Supabase
      // For now, create some example quests
      if (quests.value.length === 0) {
        quests.value = [
          {
            id: '1',
            title: 'Complete project documentation',
            description: 'Write comprehensive docs for the new feature',
            difficulty: 'Medium',
            xpReward: 50,
            coinReward: 25,
            dueDate: new Date().toISOString(),
            isCompleted: false,
            isRecurring: false,
            tags: ['work', 'documentation'],
            priority: 'High',
            estimatedTime: 120,
            category: 'Work',
            playerId: '1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      }
    } finally {
      isLoading.value = false
    }
  }

  const createQuest = async (questData: Omit<Quest, 'id' | 'createdAt' | 'updatedAt' | 'playerId'>) => {
    const newQuest: Quest = {
      ...questData,
      id: Date.now().toString(),
      playerId: playerStore.player?.id || '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    quests.value.push(newQuest)
    
    // TODO: Save to Supabase
    
    playerStore.showNotification({
      id: Date.now().toString(),
      type: 'questComplete',
      title: 'New Quest Created! 📝',
      message: `"${newQuest.title}" has been added to your quest log!`,
      createdAt: new Date().toISOString(),
      isRead: false
    })

    return newQuest
  }

  const completeQuest = async (questId: string) => {
    const quest = quests.value.find(q => q.id === questId)
    if (!quest || quest.isCompleted) return

    quest.isCompleted = true
    quest.completedAt = new Date().toISOString()

    // Calculate bonus XP for early completion
    let bonusMultiplier = 1
    const timeUntilDue = new Date(quest.dueDate).getTime() - new Date().getTime()
    if (timeUntilDue > 0) {
      bonusMultiplier = 1.2 // 20% bonus for completing early
    }

    const xpGained = Math.floor(quest.xpReward * bonusMultiplier)
    const coinsGained = quest.coinReward

    // Reward the player
    playerStore.gainXp(xpGained, `Completed: ${quest.title}`)
    playerStore.gainCoins(coinsGained, `Quest reward: ${quest.title}`)

    // Check for achievements
    checkAchievements()

    // Show completion celebration
    const celebrationMessages = [
      'Outstanding! You crushed that quest! 💪',
      'Victory is yours! The realm rejoices! 🎉',
      'Quest completed! Your legend grows! ⭐',
      'Brilliant work! The productivity gods smile upon you! 😄',
      'Mission accomplished! Time to level up! 🚀'
    ]
    
    const randomMessage = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)]
    
    playerStore.showNotification({
      id: Date.now().toString(),
      type: 'questComplete',
      title: 'Quest Complete! 🏆',
      message: randomMessage,
      createdAt: new Date().toISOString(),
      isRead: false
    })

    // TODO: Save to Supabase
  }

  const deleteQuest = async (questId: string) => {
    const index = quests.value.findIndex(q => q.id === questId)
    if (index !== -1) {
      quests.value.splice(index, 1)
      // TODO: Delete from Supabase
    }
  }

  const updateQuest = async (questId: string, updates: Partial<Quest>) => {
    const quest = quests.value.find(q => q.id === questId)
    if (quest) {
      Object.assign(quest, { ...updates, updatedAt: new Date().toISOString() })
      // TODO: Update in Supabase
    }
  }

  const generateFunQuestTitle = (originalTitle: string): string => {
    const prefix = questPrefixes[Math.floor(Math.random() * questPrefixes.length)]
    const suffix = questSuffixes[Math.floor(Math.random() * questSuffixes.length)]
    return `${prefix} ${originalTitle} ${suffix}`
  }

  const checkAchievements = () => {
    const completedCount = quests.value.filter(q => q.isCompleted).length
    
    // First quest achievement
    if (completedCount === 1) {
      playerStore.showAchievement('First Blood! 🗡️', 'You completed your first quest!')
    }
    
    // Milestone achievements
    if (completedCount === 5) {
      playerStore.showAchievement('Quest Novice! 🎯', 'Five quests conquered!')
    }
    
    if (completedCount === 10) {
      playerStore.showAchievement('Task Terminator! 🤖', 'Ten quests eliminated!')
    }
    
    if (completedCount === 25) {
      playerStore.showAchievement('Productivity Prodigy! 🧠', 'Twenty-five quests mastered!')
    }
    
    if (completedCount === 50) {
      playerStore.showAchievement('Quest Overlord! 👑', 'Fifty quests dominated!')
    }
    
    // Check daily completion streak
    const todayCompleted = completedQuestsToday.value.length
    if (todayCompleted >= 3) {
      playerStore.showAchievement('Daily Destroyer! 🔥', 'Three quests completed today!')
    }
  }

  return {
    // State
    quests,
    achievements,
    isLoading,
    selectedDate,
    
    // Computed
    todaysQuests,
    overdueTasks,
    hasUncompletedOverdueTasks,
    completedQuestsToday,
    questsByDifficulty,
    
    // Actions
    loadQuests,
    createQuest,
    completeQuest,
    deleteQuest,
    updateQuest,
    generateFunQuestTitle,
    checkAchievements
  }
})