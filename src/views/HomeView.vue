<template>
  <div class="home-view min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-quest-darker via-quest-dark to-quest-darker">
      <!-- Floating particles -->
      <div class="absolute inset-0">
        <div 
          v-for="i in 20" 
          :key="i"
          class="absolute rounded-full bg-neon-green opacity-20 animate-pulse"
          :style="{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            animationDelay: Math.random() * 2 + 's'
          }"
        ></div>
      </div>
    </div>

    <!-- Hero Content -->
    <div class="relative z-10 text-center max-w-4xl mx-auto px-4">
      <!-- Logo -->
      <div class="mb-8 animate-bounce-slow">
        <div class="text-8xl mb-4">🎮</div>
        <h1 class="text-6xl font-bold text-neon-green mb-4 glitch">
          Quest Scheduler
        </h1>
        <p class="text-xl text-quest-accent font-bold">
          Level Up Your Productivity! 🚀
        </p>
      </div>

      <!-- Hero Description -->
      <div class="mb-12 max-w-2xl mx-auto">
        <p class="text-lg text-gray-300 mb-6">
          Turn your boring to-do list into an epic adventure! 
          Gain XP, unlock achievements, and become the ultimate productivity hero!
        </p>
        
        <!-- Feature Highlights -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="retro-screen p-4">
            <div class="text-3xl mb-2">⚔️</div>
            <h3 class="font-bold text-neon-blue mb-2">Epic Quests</h3>
            <p class="text-sm text-gray-300">Transform tasks into thrilling adventures</p>
          </div>
          
          <div class="retro-screen p-4">
            <div class="text-3xl mb-2">🏆</div>
            <h3 class="font-bold text-neon-pink mb-2">Achievements</h3>
            <p class="text-sm text-gray-300">Unlock badges and celebrate victories</p>
          </div>
          
          <div class="retro-screen p-4">
            <div class="text-3xl mb-2">📈</div>
            <h3 class="font-bold text-neon-green mb-2">Level Up</h3>
            <p class="text-sm text-gray-300">Gain XP and evolve your productivity skills</p>
          </div>
        </div>
      </div>

      <!-- CTA Buttons -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/login"
            class="btn-primary text-lg px-8 py-4 transform hover:scale-110 transition-all duration-300"
          >
            🚀 Start Your Quest!
          </router-link>
          
          <button 
            @click="showDemo = true"
            class="btn-secondary text-lg px-8 py-4 transform hover:scale-110 transition-all duration-300"
          >
            👀 See Demo
          </button>
        </div>
        
        <p class="text-sm text-gray-400">
          Join thousands of productivity heroes on their quest to get stuff done! 🎯
        </p>
      </div>

      <!-- Fun Stats -->
      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        <div class="text-center">
          <div class="text-2xl font-bold text-neon-green">10,000+</div>
          <div class="text-sm text-gray-400">Quests Completed</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-neon-blue">500+</div>
          <div class="text-sm text-gray-400">Heroes Leveled Up</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-neon-pink">99%</div>
          <div class="text-sm text-gray-400">Fun Guaranteed</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-retro-orange">∞</div>
          <div class="text-sm text-gray-400">Dorky Jokes</div>
        </div>
      </div>
    </div>

    <!-- Demo Modal -->
    <div 
      v-if="showDemo"
      class="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
      @click="showDemo = false"
    >
      <div class="bg-quest-dark p-8 rounded-lg max-w-2xl mx-4 border-2 border-quest-primary">
        <h3 class="text-2xl font-bold text-neon-green mb-4">✨ Demo Coming Soon! ✨</h3>
        <p class="text-gray-300 mb-6">
          We're still crafting the perfect demo experience! 
          In the meantime, jump right in and start your quest - it's more fun than watching! 🎮
        </p>
        <button 
          @click="showDemo = false"
          class="btn-primary w-full"
        >
          Got it! Let's Quest! 🚀
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showDemo = ref(false)
</script>

<style scoped>
.home-view {
  background: radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
}

.glitch:hover {
  animation: glitch 0.5s ease-in-out;
}

@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}
</style>