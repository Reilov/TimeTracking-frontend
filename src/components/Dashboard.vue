<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login') // Перенаправляем здесь, а не в сторе
}

onMounted(() => {
  authStore.checkAuth()
})
</script>

<template>
  <div v-if="authStore.isLoggedIn">
    <h1>Добро пожаловать, {{ authStore.user?.name }}!</h1>
    <button @click="handleLogout">Выйти</button>
  </div>
  <div v-else>
    <router-link to="/login">Войти</router-link>
  </div>
</template>
