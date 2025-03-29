<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.checkAuth()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-r from-orange-500 to-orange-700">
    <router-view></router-view>
  </div>
</template>
