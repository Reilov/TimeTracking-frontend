<script setup>
import { computed } from 'vue'

import CloseIcon from '@/components/icons/CloseIcon.vue'
import AvatarProfile from '@/components/AvatarProfile.vue'

defineProps({
  userProfile: Object,
})

const emit = defineEmits(['toggleUserProfile'])

const fieldsConfig = computed(() => [
  { key: 'name', label: 'ФИО', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'birth_date', label: 'Дата рождения', type: 'date' },
  { key: 'phone', label: 'Телефон', type: 'tel' },
  { key: 'about', label: 'Обо мне', type: 'textarea' },
])
</script>

<template>
  <Transition name="slide-fade">
    <div v-show="userProfile" class="fixed inset-0 z-40">
      <div class="absolute inset-0 bg-black opacity-50" @click="emit('toggleUserProfile')" />

      <div
        class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
      >
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-800">Профиль</h2>
          <button
            @click="emit('toggleUserProfile')"
            class="p-1 rounded-full hover:bg-gray-100 group cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        <div class="p-6 overflow-y-auto h-[calc(100%-64px)]">
          <div class="flex flex-col items-center mb-8">
            <AvatarProfile
              :avatar="userProfile.avatar"
              size="big"
              :avatarText="userProfile.name?.[0] || '?'"
            />

            <div class="w-full space-y-4">
              <div v-for="field in fieldsConfig" :key="field.key" class="space-y-1">
                <label class="text-sm font-medium text-gray-500">
                  {{ field.label }}
                </label>
                <p class="text-gray-800">
                  {{ userProfile[field.key] || 'Не указано' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
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
  transform: translateX(100%);
}
</style>
