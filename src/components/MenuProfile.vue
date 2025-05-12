<script setup>
import { useRouter } from 'vue-router'
import { defineProps, defineEmits } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import ProfileIcon from '@/components/icons/ProfileIcon.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'

const router = useRouter()
const authStore = useAuthStore()

defineProps({
  userProfileMenu: {
    type: Boolean,
    required: true,
  },
})

const logout = async () => {
  await axios.post('/api/logout', {
    withCredentials: true,
  })
  authStore.clearAuthData()
  router.push('/login')
}

const emit = defineEmits(['toggleProfile', 'toggleUserProfileMenu'])

const openSettings = () => {
  emit('toggleUserProfileMenu')
  router.push('/settings')
}

const menuItems = [
  {
    id: 1,
    label: 'Профиль',
    icon: ProfileIcon,
    action: () => emit('toggleProfile'),
    class: 'group-hover:bg-orange-100 dark:group-hover:bg-orange-800',
  },
  {
    id: 2,
    label: 'Настройки',
    icon: SettingsIcon,
    action: () => openSettings(),
    class: 'group-hover:bg-blue-100 dark:group-hover:bg-blue-800',
  },
  {
    id: 3,
    label: 'Выйти',
    icon: LogoutIcon,
    action: () => logout(),
    class: 'group-hover:bg-red-100 dark:group-hover:bg-red-800',
    textClass: 'text-red-500 dark:text-red-400',
  },
]
</script>

<template>
  <transition
    enter-active-class="transition duration-100 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-75 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <ul
      v-if="userProfileMenu"
      class="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-xl backdrop-blur-sm bg-opacity-90 border border-gray-100 overflow-hidden z-50 dark:bg-gray-800 dark:border-gray-700"
    >
      <li
        v-for="item in menuItems"
        :key="item.id"
        class="border-b border-gray-100 last:border-b-0 dark:border-gray-700"
      >
        <button
          @click="item.action && item.action()"
          class="cursor-pointer w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-gray-100 transition-all duration-200 group dark:hover:bg-gray-700"
          :class="item.textClass"
        >
          <div
            class="p-1.5 rounded-lg bg-gray-100 transition-colors dark:bg-gray-700"
            :class="item.class"
          >
            <component :is="item.icon" />
          </div>
          <span>{{ item.label }}</span>
        </button>
      </li>
    </ul>
  </transition>
</template>
