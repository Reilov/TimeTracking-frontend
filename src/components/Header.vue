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
const mobileMenuOpen = ref(false)

const hrNavItem = [
  { path: '/hr', name: 'HR Панель' },
  { path: '/timesheet', name: 'Табель' },
]

const baseNavItems = computed(() => {
  const items = [{ path: '/', name: 'Главная' }]

  if (!['HR', 'Admin'].includes(authStore.user?.role_name)) {
    items.push({ path: '/users', name: 'Сотрудники' })
  }

  return items
})

const navItems = computed(() => {
  const items = [...baseNavItems.value]
  if (['HR', 'Admin'].includes(authStore.user?.role_name)) {
    items.push(...hrNavItem)
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

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
  <header
    class="bg-white shadow-md p-4 flex justify-between items-center rounded-xl dark:bg-gray-800 dark:text-white transition-colors duration-300"
  >
    <div class="flex items-center gap-4">
      <Logo />

      <!-- Бургер-меню для мобильных -->
      <button
        class="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        @click="toggleMobileMenu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

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

  <!-- Мобильное меню -->
  <div
    v-if="mobileMenuOpen"
    class="md:hidden fixed inset-0 bg-opacity-50 z-40"
    @click="toggleMobileMenu"
  ></div>

  <Transition name="slide-fade">
    <div v-if="mobileMenuOpen" class="fixed inset-0 z-40 overflow-hidden">
      <div class="flex">
        <div class="absolute inset-0 bg-black opacity-50" @click="toggleMobileMenu"></div>
        <div
          class="overflow-y-auto absolute left-0 top-0 h-full w-full max-w-3xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out dark:bg-gray-800 dark:text-white"
        >
          <div
            class="p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-700"
          >
            <Logo />
            <button
              class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="toggleMobileMenu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav class="p-4">
            <NavTabs
              :items="
                navItems.map((item) => ({ id: item.path, label: item.name, path: item.path }))
              "
              :active-item="$route.path"
              type="router-link"
              orientation="vertical"
              @click="toggleMobileMenu"
            />
          </nav>
        </div>
      </div>
    </div>
  </Transition>

  <UserProfileDrawer :user-profile="authStore.user" v-model="userProfile" />
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active .bg-white,
.slide-fade-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.slide-fade-enter-from .bg-white,
.slide-fade-leave-to .bg-white {
  transform: translateX(-100%);
}
</style>
