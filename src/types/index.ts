// Player Types
export interface Player {
  id: string
  username: string
  email: string
  level: number
  xp: number
  xpToNextLevel: number
  totalXp: number
  coins: number
  avatar: string
  title: string
  createdAt: string
  lastActive: string
}

// Quest/Task Types
export interface Quest {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic' | 'Legendary'
  xpReward: number
  coinReward: number
  dueDate: string
  completedAt?: string
  isCompleted: boolean
  isRecurring: boolean
  recurringPattern?: RecurringPattern
  tags: string[]
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  estimatedTime: number // in minutes
  category: string
  playerId: string
  createdAt: string
  updatedAt: string
}

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly'
  interval: number
  daysOfWeek?: number[] // 0-6 (Sunday-Saturday)
  dayOfMonth?: number
}

// Achievement Types
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  xpReward: number
  coinReward: number
  category: AchievementCategory
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary'
  condition: AchievementCondition
  unlockedAt?: string
  playerId?: string
}

export interface AchievementCondition {
  type: 'quests_completed' | 'streak' | 'level_reached' | 'xp_earned' | 'special'
  target: number
  category?: string
}

export type AchievementCategory = 
  | 'productivity' 
  | 'consistency' 
  | 'speed' 
  | 'dedication' 
  | 'social' 
  | 'special'

// Notification Types
export interface Notification {
  id: string
  type: 'achievement' | 'levelUp' | 'questComplete' | 'reminder' | 'streak'
  title: string
  message: string
  icon?: string
  createdAt: string
  isRead: boolean
}

// Stats Types
export interface PlayerStats {
  questsCompleted: number
  currentStreak: number
  longestStreak: number
  totalTimeSpent: number // in minutes
  averageQuestTime: number
  productivityScore: number
  categoryStats: Record<string, number>
}

// Level System
export interface LevelInfo {
  level: number
  title: string
  xpRequired: number
  description: string
  rewards: {
    coins: number
    features: string[]
  }
}

// Fun Messages
export interface FunMessage {
  type: 'motivation' | 'celebration' | 'encouragement' | 'quirky'
  message: string
  context: 'questComplete' | 'levelUp' | 'streak' | 'idle' | 'overdue'
}