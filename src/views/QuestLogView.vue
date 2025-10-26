<template>
  <div class="quest-log-view p-6 min-h-screen bg-quest-darker">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-neon-green mb-2">Quest Log 📋</h1>
        <p class="text-gray-300">Manage your epic adventures and track your progress!</p>
      </div>

      <!-- Coming Soon Message -->
      <div class="text-center py-20">
        <div class="text-8xl mb-6">🚧</div>
        <h2 class="text-3xl font-bold text-quest-accent mb-4">Epic Quest Management Coming Soon!</h2>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          We're crafting the most amazing quest management system ever seen! 
          For now, use the dashboard to create and manage your daily quests.
        </p>
        <router-link to="/dashboard" class="btn-primary text-lg px-8 py-4">
          🏠 Back to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Quest Log view - coming soon!
</script>