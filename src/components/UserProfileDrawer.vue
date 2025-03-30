<script setup>
import { defineProps } from 'vue'
import AvatarProfile from '@/components/AvatarProfile.vue'

defineProps({
  userProfile: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['toggleUserProfile'])
</script>

<template>
  <Transition name="slide-fade">
    <div v-show="userProfile">
      <div
        class="fixed top-0 left-0 bg-black w-full h-full z-10 opacity-50"
        @click="emit('toggleUserProfile')"
      ></div>
      <div class="bg-white w-2/3 h-full fixed right-0 top-0 z-20 p-8">
        <h2 class="text-xl font-bold mb-4">Профиль</h2>
        <AvatarProfile :avatar="userProfile.avatar" size="big" :avatarText="userProfile.name[0]" />
        <p class="text-lg font-semibold">{{ userProfile.name }}</p>
        <p class="text-gray-600">{{ userProfile.email }}</p>
      </div>
    </div>
  </Transition>
  <!-- <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8 overflow-y-auto">
    <div class="flex justify-between items-start mb-6">
      <h2 class="text-xl font-bold">Профиль</h2>
      <button @click="emit('toggleUserProfile')" class="text-gray-400 hover:text-gray-600">
        <XMarkIcon class="h-6 w-6" />
      </button>
    </div>

    <div class="flex flex-col items-center mb-8">
      <AvatarProfile :avatar="userProfile.avatar" size="big" :avatarText="userProfile.name[0]" />
      <p class="text-lg font-semibold mt-4">{{ userProfile.name }}</p>
      <p class="text-gray-600">{{ userProfile.email }}</p>
    </div>

    <div class="space-y-6">
      <div>
        <h3 class="font-medium text-gray-500 mb-2">Личная информация</h3>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="mb-2">
            <span class="text-gray-500">Должность:</span> {{ userProfile.position || 'Не указана' }}
          </p>
          <p><span class="text-gray-500">Часовой пояс:</span> UTC+3</p>
        </div>
      </div>

      <div>
        <h3 class="font-medium text-gray-500 mb-2">Настройки</h3>
        <div class="space-y-4">
          <label class="flex items-center justify-between cursor-pointer">
            <span>Темная тема</span>
            <div class="relative">
              <input type="checkbox" class="sr-only" />
              <div class="block bg-gray-300 w-12 h-6 rounded-full"></div>
              <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
            </div>
          </label>

          <label class="flex items-center justify-between cursor-pointer">
            <span>Уведомления</span>
            <div class="relative">
              <input type="checkbox" checked class="sr-only" />
              <div class="block bg-orange-500 w-12 h-6 rounded-full"></div>
              <div
                class="dot absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition"
              ></div>
            </div>
          </label>
        </div>
      </div>

      <button
        @click="handleLogout"
        class="w-full bg-gray-100 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all"
      >
        Выйти из аккаунта
      </button>
    </div>
  </div> -->
</template>

<style scoped>
/* Анимация появления/исчезания фона */
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease;
}

/* Анимация боковой панели */
.slide-fade-enter-from .bg-white,
.slide-fade-leave-to .bg-white {
  transform: translateX(100%);
}

.slide-fade-enter-active .bg-white,
.slide-fade-leave-active .bg-white {
  transition: transform 0.3s ease;
}
</style>
