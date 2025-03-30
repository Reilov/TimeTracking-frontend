<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import TextInput from '@/components/TextInput.vue'
import MailIcon from '@/components/icons/MailIcon.vue'
import LockIcon from '@/components/icons/LockIcon.vue'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref(null)

const handleSubmit = async () => {
  error.value = null

  const response = await axios.post('http://backenddiplom/login.php', {
    email: email.value,
    password: password.value,
  })

  if (response.data.status === 'success') {
    error.value = null
    router.push(authStore.returnUrl || '/dashboard')
    authStore.setAuthData(response.data)
  } else {
    error.value = response.data.message || 'Ошибка входа. Пожалуйста, проверьте свои данные.'
  }
}
</script>
<template>
  <div class="h-screen flex items-center justify-center">
    <div
      class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all hover:scale-103"
    >
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Вход в систему</h1>
        <p class="text-gray-600">Введите свои данные для доступа</p>
      </div>
      <form @submit.prevent="handleSubmit">
        <TextInput
          v-model="email"
          type="email"
          placeholder="Введите ваш email"
          label="Email"
          :icon="MailIcon"
        />
        <TextInput
          v-model="password"
          type="password"
          placeholder="Введите ваш пароль"
          label="Пароль"
          :icon="LockIcon"
        />
        <p v-if="error" class="text-red-600 text-sm font-medium mb-2 text-center">{{ error }}</p>
        <button
          type="submit"
          class="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105"
        >
          Войти
        </button>
      </form>
    </div>
  </div>
</template>
