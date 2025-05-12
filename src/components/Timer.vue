<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import Button from '@/components/Button.vue'

const props = defineProps({
  userId: Number,
})

const elapsedTime = ref(0)
const isRunning = ref(false)
let timer = null
let lastActiveTime

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInterval(timer)
    lastActiveTime = Date.now()
  } else if (isRunning.value) {
    const timeInactive = Math.floor((Date.now() - lastActiveTime) / 1000)
    elapsedTime.value += timeInactive
    startFrontendTimer()
  }
})

const startFrontendTimer = () => {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    elapsedTime.value += 1
  }, 1000)
}
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

onMounted(async () => {
  try {
    const response = await axios.get('/api/sessions/active', {
      params: { user_id: props.userId },
      withCredentials: true,
    })
    if (response.data.active) {
      elapsedTime.value = response.data.elapsed_seconds
      isRunning.value = true
      startFrontendTimer()
    } else if (!response.data.active && response.data.elapsed_seconds) {
      elapsedTime.value = response.data.elapsed_seconds
    }
  } catch (error) {
    console.error('Ошибка загрузки сессии:', error)
  }
})

const startTimer = async () => {
  if (isRunning.value) return

  try {
    const sessionResponse = await axios.get('/api/sessions/active', {
      params: { user_id: props.userId },
    })
    if (sessionResponse.data.active) {
      elapsedTime.value = sessionResponse.data.elapsed_seconds
    } else {
      await axios.post('/api/sessions', {
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
    await axios.post('/api/sessions', {
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
    await axios.post('/api/sessions', {
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
  <div class="flex flex-col items-center">
    <div class="text-5xl font-bold mb-6 font-mono">{{ formattedTime }}</div>
    <div class="flex gap-4 flex-wrap justify-center">
      <Button
        textButton="Старт"
        size="big"
        variant="primaryMinimal"
        @click="startTimer"
        :disabled="isRunning"
      />
      <Button
        textButton="Пауза"
        size="big"
        variant="secondary"
        @click="pauseTimer"
        :disabled="!isRunning"
      />
      <Button
        textButton="Стоп"
        size="big"
        variant="secondary"
        @click="stopTimer"
        :disabled="elapsedTime === 0"
      />
    </div>
  </div>
</template>
