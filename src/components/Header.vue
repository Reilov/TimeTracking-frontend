<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AvatarProfile from '@/components/AvatarProfile.vue'
import UserProfileDrawer from '@/components/UserProfileDrawer.vue'

const authStore = useAuthStore()

const router = useRouter()
const userProfileMenu = ref(false)
const userProfile = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  authStore.checkAuth()
})

const toggleUserProfileMenu = () => {
  userProfileMenu.value = !userProfileMenu.value
}

const toggleUserProfile = () => {
  userProfileMenu.value = false
  userProfile.value = !userProfile.value
}

const handleUpload = (e) => {
  const file = e.target.files[0]
  authStore.updateAvatar(file)
}
</script>

<template>
  <header class="bg-white shadow-md p-4 flex justify-between items-center rounded-xl">
    <h1 class="text-2xl font-bold text-orange-500">TimeTrack</h1>
    <div class="relative">
      <div
        class="flex gap-3 items-center p-3 relative cursor-pointer rounded-lg hover:bg-gray-200 transition-all"
        @click="toggleUserProfileMenu"
      >
        <AvatarProfile :avatar="authStore.user.avatar" :avatar-text="authStore.user.name[0]" />
        <div class="flex flex-col">
          <span class="text-lg">{{ authStore.user?.name }}</span>
          <span class="text-gray-400 text-xs" v-if="authStore.user?.position">{{
            authStore.user?.position
          }}</span>
        </div>
      </div>
      <ul
        v-if="userProfileMenu"
        class="bg-gray-100 absolute top-full right-0 shadow-lg rounded-lg mt-2 p-4"
      >
        <li class="py-2 px-4 hover:bg-gray-200 cursor-pointer" @click="toggleUserProfile">
          Профиль
        </li>
        <li class="py-2 px-4 hover:bg-gray-200 cursor-pointer">Настройки</li>
        <li class="py-2 px-4 hover:bg-gray-200 cursor-pointer" @click="handleLogout">Выйти</li>
      </ul>
    </div>
  </header>

  <UserProfileDrawer
    v-show="userProfile"
    :user-profile="authStore.user"
    @toggleUserProfile="toggleUserProfile"
  />

  <input type="file" @change="handleUpload" accept="image/*" />
</template>
