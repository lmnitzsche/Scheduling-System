<template>
  <div class="calendar-view p-6 min-h-screen bg-quest-darker">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-neon-green mb-2">Quest Calendar 📅</h1>
        <p class="text-gray-300">Plan your adventures across time and space!</p>
      </div>

      <!-- Coming Soon Message -->
      <div class="text-center py-20">
        <div class="text-8xl mb-6">📅</div>
        <h2 class="text-3xl font-bold text-quest-accent mb-4">Time Portal Under Construction!</h2>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Our time wizards are building the most magical calendar interface! 
          Soon you'll be able to schedule quests across dimensions and timelines.
        </p>
        <router-link to="/dashboard" class="btn-primary text-lg px-8 py-4">
          🏠 Back to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Calendar view - coming soon!
</script>