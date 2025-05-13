<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import AvatarProfile from '@/components/AvatarProfile.vue'
import UserProfileDrawer from '@/components/UserProfileDrawer.vue'
import Logo from '@/components/Logo.vue'
import MenuProfile from '@/components/MenuProfile.vue'

const authStore = useAuthStore()

const route = useRoute()

const userProfileMenu = ref(false)
const userProfile = ref(false)

const baseNavItems = [
  { path: '/', name: 'Главная' },
  { path: '/users', name: 'Пользователи' },
]

const hrNavItem = {
  path: '/hr',
  name: 'HR Панель',
}

const navItems = computed(() => {
  const items = [...baseNavItems]
  if (['HR', 'Admin'].includes(authStore.user?.role_name)) {
    items.push(hrNavItem)
  }
  return items
})
const toggleUserProfileMenu = () => {
  userProfileMenu.value = !userProfileMenu.value
}

const toggleUserProfile = () => {
  userProfileMenu.value = false
  userProfile.value = !userProfile.value
}

const isActive = (path) => {
  return route.path === path
}
</script>

<template>
  <header
    class="bg-white shadow-md p-4 flex justify-between items-center rounded-xl dark:bg-gray-800 dark:text-white transition-colors duration-300"
  >
    <div class="flex items-center gap-8">
      <Logo />

      <nav class="hidden md:flex gap-4">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="px-2 py-1 relative transition-all"
        >
          {{ item.name }}
          <span
            v-if="isActive(item.path)"
            class="absolute left-1/2 bottom-0 w-4/5 h-0.5 bg-orange-500 transform -translate-x-1/2"
          ></span>
        </router-link>
      </nav>
    </div>

    <div class="relative">
      <div
        class="flex gap-2 md:gap-3 items-center p-3 relative cursor-pointer rounded-lg hover:bg-gray-100 transition-all dark:hover:bg-gray-700"
        @click="toggleUserProfileMenu"
      >
        <AvatarProfile :avatar="authStore.user.avatar" :avatar-text="authStore.user?.name[0]" />
        <div class="flex flex-col">
          <span class="text-base md:text-lg">{{ authStore.user?.name }}</span>
          <span class="text-gray-400 text-xs" v-if="authStore.user?.position">
            {{ authStore.user?.position }}
          </span>
        </div>
      </div>

      <MenuProfile
        :userProfileMenu="userProfileMenu"
        @toggleProfile="toggleUserProfile"
        @toggleUserProfileMenu="toggleUserProfileMenu"
      />
    </div>
  </header>

  <UserProfileDrawer :user-profile="authStore.user" v-model="userProfile" />
</template>
