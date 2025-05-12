<script setup>
import { useTheme } from '@/composables/useTheme'
useTheme()
</script>

<template>
  <div
    class="min-h-screen h-full bg-gradient-to-br from-orange-50 to-orange-100 p-4 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 transition-colors duration-300"
  >
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>
