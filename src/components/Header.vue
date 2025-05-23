<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AvatarProfile from '@/components/AvatarProfile.vue'
import UserProfileDrawer from '@/components/UserProfileDrawer.vue'
import Logo from '@/components/Logo.vue'
import MenuProfile from '@/components/MenuProfile.vue'
import NavTabs from './NavTabs.vue'

const authStore = useAuthStore()
const userProfileMenu = ref(false)
const userProfile = ref(false)

const baseNavItems = [
  { path: '/', name: 'Главная' },
  { path: '/users', name: 'Сотрудники' },
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
</script>

<template>
  <header
    class="bg-white shadow-md p-4 flex justify-between items-center rounded-xl dark:bg-gray-800 dark:text-white transition-colors duration-300"
  >
    <div class="flex items-center gap-8">
      <Logo />

      <nav class="hidden md:flex gap-4">
        <NavTabs
          :items="navItems.map((item) => ({ id: item.path, label: item.name, path: item.path }))"
          :active-item="$route.path"
          type="router-link"
        />
      </nav>
    </div>

    <div class="relative">
      <div
        class="flex gap-2 md:gap-3 items-center p-3 relative cursor-pointer rounded-lg hover:bg-gray-100 transition-all dark:hover:bg-gray-700"
        @click="toggleUserProfileMenu"
      >
        <AvatarProfile :avatar="authStore.user?.avatar" :avatar-text="authStore.user?.name[0]" />
        <div class="flex flex-col">
          <span class="text-base md:text-lg">{{ authStore.user?.name }}</span>
          <span class="text-gray-400 text-xs" v-if="authStore.user?.position_name">
            {{ authStore.user?.position_name }}
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
