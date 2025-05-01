<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.checkAuth()
})
</script>

<template>
  <div class="h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
    <router-view></router-view>
  </div>
</template>
