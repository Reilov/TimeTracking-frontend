<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  authStore.checkAuth()
})
</script>

<template>
  <header>
    <nav>
      <ul class="flex space-x-4 bg-gray-800 text-white p-4">
        <li><router-link to="/dashboard">Главная</router-link></li>
        <li><router-link to="/profile">Профиль</router-link></li>
        <li><router-link to="/settings">Настройки</router-link></li>
      </ul>
    </nav>
  </header>
  <h1>Добро пожаловать, {{ authStore.user?.name }}!</h1>
  <button @click="handleLogout">Выйти</button>
</template>
