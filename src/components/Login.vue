<script setup>
import api from '@/api/axios'
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Logo from '@/components/Logo.vue'
import Message from '@/components/Message.vue'
import TextInput from '@/components/TextInput.vue'
import Button from '@/components/Button.vue'
import MailIcon from '@/components/icons/MailIcon.vue'
import LockIcon from '@/components/icons/LockIcon.vue'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const message = ref(null)
const isLoading = ref(false)
const error = ref(false)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    const response = await api.post(
      '/login',
      {
        email: email.value,
        password: password.value,
      },
      { withCredentials: true },
    )

    if (response.data.status === 'success') {
      message.value = null
      error.value = false
      authStore.setAuthData(response.data.user)
      await nextTick()
      router.push('/dashboard')
    }
  } catch (err) {
    error.value = true
    message.value = err.response.data.message || 'Произошла ошибка при подключении к серверу'
    isLoading.value = false
  }
}
</script>

<template>
  <div class="h-220 flex items-center justify-center">
    <div class="w-full max-w-md">
      <Logo />
      <div
        class="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl mt-8 dark:bg-gray-800 dark:text-white"
      >
        <div class="h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>
        <div class="p-8">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-2 dark:text-gray-100">
              Добро пожаловать
            </h1>
            <p class="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Введите свои данные для входа в систему
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <TextInput
              v-model="email"
              type="email"
              placeholder="example@mail.com"
              label="Email"
              :icon="MailIcon"
              required
            />
            <TextInput
              v-model="password"
              type="password"
              placeholder="••••••••"
              label="Пароль"
              :icon="LockIcon"
              a
              required
            />

            <Message v-if="message" :message="message" :error="error" />

            <Button textButton="Войти" :isLoading="isLoading" size="big" class="w-full" />
          </form>
        </div>
      </div>
      <div class="mt-8 text-center text-xs text-gray-400">
        © 2025 TimeTracker. Все права защищены.
      </div>
    </div>
  </div>
</template>
