<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { useTheme } from '@/composables/useTheme'
import { useAvatarUpload } from '@/composables/useAvatarUpload'
import { useFormState } from '@/composables/useFormState'

import AvatarProfile from '@/components/AvatarProfile.vue'
import Button from '@/components//Button.vue'
import TextInput from '@/components//TextInput.vue'
import Message from '@/components//Message.vue'
import BlockMain from '@/components//BlockMain.vue'

const { isDark, toggleTheme } = useTheme()

const { tempAvatar, selectedAvatar, fileInput, handleFileChange, triggerFileInput, resetAvatar } =
  useAvatarUpload()
const { isError, message, isLoading, setError, setSuccess, resetState } = useFormState()

const authStore = useAuthStore()
const userProfile = ref(JSON.parse(JSON.stringify(authStore.user)))
const originalProfileData = JSON.parse(JSON.stringify(authStore.user))

const fieldsConfig = computed(() => [
  { key: 'name', label: 'ФИО', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'birth_date', label: 'Дата рождения', type: 'date' },
  { key: 'phone', label: 'Телефон', type: 'tel' },
  { key: 'about', label: 'Обо мне', type: 'textarea' },
])

const hasFieldChanges = computed(() => {
  return fieldsConfig.value.some(
    (field) => userProfile.value[field.key] !== originalProfileData[field.key],
  )
})

const hasChanges = computed(() => {
  return tempAvatar.value !== null || hasFieldChanges.value
})

const saveChanges = async () => {
  try {
    isLoading.value = true
    resetState()

    const formData = new FormData()
    if (selectedAvatar.value) {
      formData.append('avatar', selectedAvatar.value)
    }

    const changedFields = {}
    fieldsConfig.value.forEach((field) => {
      if (userProfile.value[field.key] !== originalProfileData[field.key]) {
        changedFields[field.key] = userProfile.value[field.key]
      }
    })

    if (Object.keys(changedFields).length > 0) {
      formData.append('profileData', JSON.stringify(changedFields))
    }

    formData.append('user_id', authStore.user.id)

    const response = await axios.post('/api/update-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })

    if (response.data.status === 'success') {
      setSuccess('Профиль успешно обновлён')

      if (response.data.profile) {
        if (response.data.profile.avatar) {
          const freshAvatarUrl = response.data.profile.avatar + '?t=' + Date.now()
          response.data.profile.avatar = freshAvatarUrl
          authStore.user.avatar = freshAvatarUrl
        }

        Object.assign(authStore.user, response.data.profile)
        Object.assign(userProfile.value, authStore.user)
        Object.assign(originalProfileData, JSON.parse(JSON.stringify(authStore.user)))

        resetAvatar()
      }
    } else {
      setError('Не удалось обновить профиль')
    }
  } catch (error) {
    setError(error.response?.data?.message || 'Произошла ошибка при сохранении изменений')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const cancelChanges = () => {
  fieldsConfig.value.forEach((field) => {
    userProfile.value[field.key] = originalProfileData[field.key]
  })

  resetAvatar()
  resetState()
}

const handleAvatarChange = async (event) => {
  const result = handleFileChange(event)
  if (result?.error) {
    setError(result.message)
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}
</script>

<template>
  <div class="flex justify-center items-start gap-8 flex-wrap">
    <BlockMain title="Настройки профиля" class="max-w-2xl w-full">
      <div class="flex flex-col space-y-4 mb-8">
        <div class="relative group rounded-full self-center" @click="triggerFileInput">
          <AvatarProfile
            :avatar="tempAvatar || authStore.user.avatar"
            :avatar-text="authStore.user?.name[0]"
            size="big"
            class="transition-opacity group-hover:opacity-80"
          />
          <div
            class="rounded-full cursor-pointer absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button textButton="Изменить" variant="primaryMinimal" size="small" />
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg, image/png, image/gif"
            class="hidden"
            @change="handleAvatarChange"
          />
        </div>

        <TextInput
          v-for="field in fieldsConfig"
          :key="field.key"
          :label="field.label"
          v-model="userProfile[field.key]"
          :type="field.type"
          :placeholder="'Введите ' + field.label.toLowerCase()"
          class="w-full"
        />

        <Message v-if="message" :message="message" :error="isError" />

        <div class="flex space-x-3 self-end">
          <Button
            textButton="Отмена"
            variant="secondary"
            size="big"
            @click="cancelChanges"
            :class="hasChanges ? 'block' : 'hidden'"
          />
          <Button
            textButton="Сохранить"
            variant="primary"
            :isLoading="isLoading"
            :disabled="!hasChanges || isLoading"
            size="big"
            @click="saveChanges"
          />
        </div>
      </div>
    </BlockMain>

    <BlockMain title="Внешний вид" class="max-w-sm w-full">
      <p class="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-200">Тема</p>
      <div class="flex items-center space-x-2">
        <svg
          v-if="isDark"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-orange-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-yellow-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clip-rule="evenodd"
          />
        </svg>
        <button
          @click="toggleTheme"
          type="button"
          class="cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          :class="isDark ? 'bg-orange-600' : 'bg-gray-200'"
          :aria-label="`Переключить на ${isDark ? 'светлую' : 'тёмную'} тему`"
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            :class="isDark ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
      </div>
    </BlockMain>
  </div>
</template>
