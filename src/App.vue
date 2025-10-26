<template>
  <div id="app" class="min-h-screen bg-quest-darker">
    <!-- Main App Container -->
    <div class="relative">
      <!-- Navigation -->
      <NavBar v-if="showNavigation" />
      
      <!-- Achievement Notifications -->
      <NotificationContainer />
      
      <!-- Router View -->
      <main class="pb-20">
        <RouterView />
      </main>
      
      <!-- Floating Quest Helper -->
      <QuestHelper v-if="showQuestHelper" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useQuestStore } from '@/stores/quest'
import NavBar from '@/components/NavBar.vue'
import NotificationContainer from '@/components/NotificationContainer.vue'
import QuestHelper from '@/components/QuestHelper.vue'

const route = useRoute()
const playerStore = usePlayerStore()
const questStore = useQuestStore()

// Show navigation except on home and login pages
const showNavigation = computed(() => {
  return !['home', 'login'].includes(route.name as string)
})

// Show quest helper for new players or when they're stuck
const showQuestHelper = computed(() => {
  return showNavigation.value && (playerStore.currentLevel <= 3 || questStore.hasUncompletedOverdueTasks)
})

onMounted(async () => {
  // Initialize the app if authenticated
  if (showNavigation.value) {
    await playerStore.loadPlayerData()
    await questStore.loadQuests()
    
    // Welcome new players with a fun message
    if (playerStore.isNewPlayer) {
      playerStore.showAchievement('Welcome, brave scheduler!', 'Your quest begins now! 🎮')
    }
  }
})
</script>