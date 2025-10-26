import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Player, PlayerStats, LevelInfo, Notification } from '@/types'

export const usePlayerStore = defineStore('player', () => {
  // State
  const player = ref<Player | null>(null)
  const stats = ref<PlayerStats>({
    questsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalTimeSpent: 0,
    averageQuestTime: 0,
    productivityScore: 100,
    categoryStats: {}
  })
  const notifications = ref<Notification[]>([])
  const isLoading = ref(false)

  // Level system configuration
  const levelSystem = ref<LevelInfo[]>([
    { level: 1, title: 'Procrastination Padawan', xpRequired: 0, description: 'Welcome to your quest!', rewards: { coins: 0, features: ['Basic scheduling'] } },
    { level: 2, title: 'Task Trainee', xpRequired: 100, description: 'Getting the hang of it!', rewards: { coins: 50, features: ['Quest categories'] } },
    { level: 3, title: 'Schedule Squire', xpRequired: 300, description: 'Building good habits!', rewards: { coins: 100, features: ['Recurring quests'] } },
    { level: 4, title: 'Productivity Paladin', xpRequired: 600, description: 'Becoming a true warrior!', rewards: { coins: 150, features: ['Advanced stats'] } },
    { level: 5, title: 'Time Management Mage', xpRequired: 1000, description: 'Mastering the arcane arts!', rewards: { coins: 200, features: ['Custom themes'] } },
    { level: 6, title: 'Efficiency Enchanter', xpRequired: 1500, description: 'Wielding powerful productivity spells!', rewards: { coins: 300, features: ['Team quests'] } },
    { level: 7, title: 'Deadline Dragon Slayer', xpRequired: 2100, description: 'No deadline is too fearsome!', rewards: { coins: 400, features: ['Priority automation'] } },
    { level: 8, title: 'Calendar Crusader', xpRequired: 2800, description: 'Defending the realm from chaos!', rewards: { coins: 500, features: ['AI suggestions'] } },
    { level: 9, title: 'Scheduling Sorcerer Supreme', xpRequired: 3600, description: 'Master of time and space!', rewards: { coins: 750, features: ['Ultimate customization'] } },
    { level: 10, title: 'Legendary Productivity Overlord', xpRequired: 4500, description: 'You have achieved the impossible!', rewards: { coins: 1000, features: ['All features unlocked'] } }
  ])

  // Computed
  const isAuthenticated = computed(() => player.value !== null)
  const isNewPlayer = computed(() => player.value?.level === 1 && stats.value.questsCompleted === 0)
  const currentLevel = computed(() => player.value?.level || 1)
  const currentXp = computed(() => player.value?.xp || 0)
  const xpToNextLevel = computed(() => {
    if (!player.value) return 0
    const nextLevel = levelSystem.value.find(l => l.level === currentLevel.value + 1)
    return nextLevel ? nextLevel.xpRequired - player.value.totalXp : 0
  })
  const currentTitle = computed(() => {
    const level = levelSystem.value.find(l => l.level === currentLevel.value)
    return level?.title || 'Newbie Scheduler'
  })
  const xpProgress = computed(() => {
    if (!player.value) return 0
    const currentLevelInfo = levelSystem.value.find(l => l.level === currentLevel.value)
    const nextLevelInfo = levelSystem.value.find(l => l.level === currentLevel.value + 1)
    
    if (!currentLevelInfo || !nextLevelInfo) return 100
    
    const currentLevelXp = currentLevelInfo.xpRequired
    const nextLevelXp = nextLevelInfo.xpRequired
    const playerTotalXp = player.value.totalXp
    
    return ((playerTotalXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
  })

  // Actions
  const loadPlayerData = async () => {
    isLoading.value = true
    try {
      // TODO: Load from Supabase
      // For now, create a mock player
      if (!player.value) {
        player.value = {
          id: '1',
          username: 'QuestMaster',
          email: 'quest@example.com',
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          totalXp: 0,
          coins: 0,
          avatar: '🎮',
          title: 'Procrastination Padawan',
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  const gainXp = (amount: number, reason: string) => {
    if (!player.value) return
    
    const oldLevel = player.value.level
    player.value.xp += amount
    player.value.totalXp += amount
    
    // Check for level up
    const newLevel = calculateLevel(player.value.totalXp)
    if (newLevel > oldLevel) {
      levelUp(newLevel)
    }
    
    showNotification({
      id: Date.now().toString(),
      type: 'questComplete',
      title: `+${amount} XP!`,
      message: reason,
      createdAt: new Date().toISOString(),
      isRead: false
    })
  }

  const gainCoins = (amount: number, reason: string) => {
    if (!player.value) return
    
    player.value.coins += amount
    showNotification({
      id: Date.now().toString(),
      type: 'questComplete',
      title: `+${amount} coins! 💰`,
      message: reason,
      createdAt: new Date().toISOString(),
      isRead: false
    })
  }

  const levelUp = (newLevel: number) => {
    if (!player.value) return
    
    player.value.level = newLevel
    const levelInfo = levelSystem.value.find(l => l.level === newLevel)
    
    if (levelInfo) {
      player.value.title = levelInfo.title
      player.value.coins += levelInfo.rewards.coins
      
      showNotification({
        id: Date.now().toString(),
        type: 'levelUp',
        title: `LEVEL UP! 🎉`,
        message: `Welcome to level ${newLevel}: ${levelInfo.title}!`,
        createdAt: new Date().toISOString(),
        isRead: false
      })
    }
  }

  const calculateLevel = (totalXp: number): number => {
    let level = 1
    for (const levelInfo of levelSystem.value) {
      if (totalXp >= levelInfo.xpRequired) {
        level = levelInfo.level
      } else {
        break
      }
    }
    return level
  }

  const showNotification = (notification: Notification) => {
    notifications.value.unshift(notification)
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== notification.id)
    }, 5000)
  }

  const showAchievement = (title: string, message: string) => {
    showNotification({
      id: Date.now().toString(),
      type: 'achievement',
      title,
      message,
      icon: '🏆',
      createdAt: new Date().toISOString(),
      isRead: false
    })
  }

  const updateStats = (newStats: Partial<PlayerStats>) => {
    stats.value = { ...stats.value, ...newStats }
  }

  return {
    // State
    player,
    stats,
    notifications,
    isLoading,
    levelSystem,
    
    // Computed
    isAuthenticated,
    isNewPlayer,
    currentLevel,
    currentXp,
    xpToNextLevel,
    currentTitle,
    xpProgress,
    
    // Actions
    loadPlayerData,
    gainXp,
    gainCoins,
    levelUp,
    showNotification,
    showAchievement,
    updateStats
  }
})