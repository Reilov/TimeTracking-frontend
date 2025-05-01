<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AvatarProfile from '@/components/AvatarProfile.vue'
import UserProfileDrawer from '@/components/UserProfileDrawer.vue'
import Logo from '@/components/Logo.vue'
import MenuProfile from '@/components/MenuProfile.vue'

const authStore = useAuthStore()

const router = useRouter()
const userProfileMenu = ref(false)
const userProfile = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const toggleUserProfileMenu = () => {
  userProfileMenu.value = !userProfileMenu.value
}

const toggleUserProfile = () => {
  userProfileMenu.value = false
  userProfile.value = !userProfile.value
}
</script>

<template>
  <header class="bg-white shadow-md p-4 flex justify-between items-center rounded-xl">
    <Logo />
    <div class="relative">
      <div
        class="flex gap-2 md:gap-3 items-center p-3 relative cursor-pointer rounded-lg hover:bg-gray-200 transition-all"
        @click="toggleUserProfileMenu"
      >
        <AvatarProfile :avatar="authStore.user.avatar" :avatar-text="authStore.user?.name[0]" />
        <div class="flex flex-col">
          <span class="text-base md:text-lg">{{ authStore.user?.name }}</span>
          <span class="text-gray-400 text-xs" v-if="authStore.user?.position">{{
            authStore.user?.position
          }}</span>
        </div>
      </div>

      <MenuProfile
        :userProfileMenu="userProfileMenu"
        @toggleProfile="toggleUserProfile"
        @logout="handleLogout"
      />
    </div>
  </header>

  <UserProfileDrawer
    v-show="userProfile"
    :user-profile="authStore.user"
    @toggleUserProfile="toggleUserProfile"
  />
</template>
