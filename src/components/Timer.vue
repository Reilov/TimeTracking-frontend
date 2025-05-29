<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '@/api/axios'
import Button from '@/components/Button.vue'
import TextInput from '@/components/TextInput.vue'
import Message from '@/components/Message.vue'

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

const syncWithServer = async () => {
  try {
    const response = await api.get('/sessions/active', {
      params: { user_id: props.userId },
    })

    elapsedTime.value = response.data.elapsed_seconds || 0
    isRunning.value = response.data.active || false

    if (isRunning.value) {
      startFrontendTimer()
    } else {
      clearInterval(timer)
    }
  } catch (error) {
    console.error('Ошибка синхронизации:', error)
  }
}

onMounted(async () => {
  await syncWithServer()
})

const startTimer = async () => {
  if (isRunning.value) return

  try {
    await syncWithServer()

    await api.post('/sessions', {
      action: 'start',
      user_id: props.userId,
      elapsed_seconds: elapsedTime.value,
    })

    await syncWithServer()
  } catch (error) {
    console.error('Ошибка старта:', error)
  }
}

const pauseTimer = async () => {
  try {
    await api.post('/sessions', {
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
    await api.post('/sessions', {
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

const hoursToAdd = ref(0)
const minutesToAdd = ref(0)
const message = ref(null)

const addTime = async () => {
  try {
    message.value = null

    const totalSecondsToAdd = hoursToAdd.value * 3600 + minutesToAdd.value * 60

    if (isRunning.value) {
      message.value = 'Таймер запущен. Остановите время и повторите попытку'
      return
    }

    if (totalSecondsToAdd <= 0) {
      message.value = 'Пожалуйста, введите корректное время'
      return
    }

    await syncWithServer()

    const newTotalSeconds = elapsedTime.value + totalSecondsToAdd

    await api.post('/sessions', {
      action: 'add_time',
      user_id: props.userId,
      elapsed_seconds: newTotalSeconds,
    })

    await syncWithServer()

    hoursToAdd.value = 0
    minutesToAdd.value = 0
  } catch (error) {
    console.error('Ошибка добавления времени:', error)
    alert('Не удалось добавить время')
  }
}
</script>

<template>
  <div class="flex items-center justify-center gap-40">
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

    <div class="">
      <div class="flex gap-4 mb-4">
        <text-input v-model.number="hoursToAdd" type="number" min="0" label="Часы" />
        <text-input v-model.number="minutesToAdd" type="number" min="0" max="59" label="Минуты" />
      </div>
      <Button textButton="Добавить" size="big" variant="primary" @click="addTime" class="mb-2" />
      <Message v-if="message" :message="message" error="message" />
    </div>
  </div>
</template>
