<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref(null)

const handleSubmit = async () => {
  const response = await authStore.login(email.value, password.value)
  if (response) {
    error.value = null
    router.push(authStore.returnUrl || '/dashboard')
  } else {
    error.value = 'Неверные учетные данные'
  }
}
</script>
<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-700"
  >
    <div
      class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all hover:scale-103"
    >
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Вход в систему</h1>
        <p class="text-gray-600">Введите свои данные для доступа</p>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">Почта</label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              placeholder="Введите вашу почту"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </span>
          </div>
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">Пароль</label>
          <div class="relative">
            <input
              v-model="password"
              type="password"
              placeholder="Введите ваш пароль"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-5 w-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>
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
