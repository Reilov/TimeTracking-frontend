<script setup>
// import { ref, onMounted } from 'vue'
// import axios from 'axios'
import Header from '@/components/Header.vue'
import Timer from './Timer.vue'
// import UserProfileDrawer from '@/components/UserProfileDrawer.vue'

import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

// const users = ref([])
// const isLoading = ref(true)
// const error = ref(null)

// const selectedUser = ref(null) // выбранный пользователь
// const isDrawerOpen = ref(false)

// const fetchUsers = async () => {
//   try {
//     const response = await axios.get('/api/users.php')
//     users.value = response.data.users
//   } catch (err) {
//     error.value = 'Ошибка при загрузке пользователей'
//     console.error(err)
//   } finally {
//     isLoading.value = false
//   }
// }

// const openUserProfile = (user) => {
//   selectedUser.value = user
//   isDrawerOpen.value = true
// }

// const closeUserProfile = () => {
//   isDrawerOpen.value = false
//   selectedUser.value = null
// }

// onMounted(() => {
//   fetchUsers()
// })
</script>

<template>
  <Header />

  <div class="pt-6">
    <Timer :user-id="authStore.user.id" />
    <!-- <h2 class="text-2xl font-bold mb-4">Список пользователей</h2>

    <div v-if="isLoading" class="text-gray-500">Загрузка...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <ul v-else class="space-y-4">
      <li
        v-for="user in users"
        :key="user.id"
        class="p-4 border rounded-lg shadow hover:shadow-md transition cursor-pointer"
        @click="openUserProfile(user)"
      >
        <h3 class="text-lg font-semibold text-gray-800">{{ user.name }}</h3>
        <p class="text-gray-600">{{ user.email }}</p>
      </li>
    </ul> -->
    <!-- <UserProfileDrawer
      v-show="isDrawerOpen && selectedUser"
      :user-profile="selectedUser"
      @toggleUserProfile="closeUserProfile"
    /> -->
  </div>
</template>
