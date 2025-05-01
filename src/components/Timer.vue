<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  userId: Number,
})

const elapsedTime = ref(0)
const isRunning = ref(false)
let timer = null

const formattedTime = computed(() => {
  const hours = Math.floor(elapsedTime.value / 3600)
  const minutes = Math.floor((elapsedTime.value % 3600) / 60)
  const seconds = elapsedTime.value % 60

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':')
})

// Загрузка активной сессии
onMounted(async () => {
  try {
    const response = await axios.get(`/api/get_active_session.php?user_id=${props.userId}`)
    if (response.data.active) {
      elapsedTime.value = response.data.elapsed_seconds
      isRunning.value = true
      startFrontendTimer()
    } else if (!response.data.active && response.data.status === 'paused') {
      elapsedTime.value = response.data.elapsed_seconds
    }
  } catch (error) {
    console.error('Ошибка загрузки сессии:', error)
  }
})

// Только для визуального обновления
const startFrontendTimer = () => {
  if (timer) clearInterval(timer)

  timer = setInterval(() => {
    elapsedTime.value += 1
  }, 1000)
}

const startTimer = async () => {
  if (isRunning.value) return

  try {
    const sessionResponse = await axios.get(`/api/get_active_session.php?user_id=${props.userId}`)

    if (sessionResponse.data.active) {
      elapsedTime.value = sessionResponse.data.elapsed_seconds
    } else {
      await axios.post('/api/session_action.php', {
        action: 'start',
        user_id: props.userId,
        elapsed_seconds: 0,
      })
    }

    isRunning.value = true
    startFrontendTimer()
  } catch (error) {
    console.error('Ошибка старта:', error)
  }
}

const pauseTimer = async () => {
  try {
    await axios.post('/api/session_action.php', {
      action: 'pause',
      user_id: props.userId,
      elapsed_seconds: elapsedTime.value,
    })

    isRunning.value = false
    clearInterval(timer)
  } catch (error) {
    console.error('Ошибка паузы:', error)
  }
}

const stopTimer = async () => {
  clearInterval(timer)
  isRunning.value = false

  try {
    await axios.post('/api/session_action.php', {
      action: 'stop',
      user_id: props.userId,
      elapsed_seconds: elapsedTime.value,
    })
    elapsedTime.value = 0
  } catch (error) {
    console.error('Ошибка остановки:', error)
  }
}

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex flex-col items-center">
      <div class="text-5xl font-bold mb-6 font-mono">{{ formattedTime }}</div>
      <div class="flex gap-4 flex-wrap justify-center">
        <button
          @click="startTimer"
          class="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all"
          :disabled="isRunning"
        >
          Старт
        </button>
        <button
          @click="pauseTimer"
          class="bg-gray-100 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
          :disabled="!isRunning"
        >
          Пауза
        </button>
        <button
          @click="stopTimer"
          class="bg-gray-100 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
          :disabled="elapsedTime === 0"
        >
          Стоп
        </button>
      </div>
    </div>
  </div>
</template>
