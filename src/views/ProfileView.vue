<template>
  <div class="profile-view p-6 min-h-screen bg-quest-darker">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-neon-green mb-2">Hero Profile 👤</h1>
        <p class="text-gray-300">Customize your legendary character!</p>
      </div>

      <!-- Coming Soon Message -->
      <div class="text-center py-20">
        <div class="text-8xl mb-6">👤</div>
        <h2 class="text-3xl font-bold text-quest-accent mb-4">Character Customization Forge!</h2>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Our character designers are creating the ultimate hero customization experience! 
          Soon you'll be able to change avatars, titles, and unlock epic cosmetics.
        </p>
        <router-link to="/dashboard" class="btn-primary text-lg px-8 py-4">
          🏠 Back to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Profile view - coming soon!
</script>