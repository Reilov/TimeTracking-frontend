<script setup>
import { ref, computed } from 'vue'

const elapsedTime = ref(0)
const isRunning = ref(false)
let timer = null

const formattedTime = computed(() => {
  const h = Math.floor(elapsedTime.value / 3600)
  const m = Math.floor((elapsedTime.value % 3600) / 60)
  const s = elapsedTime.value % 60

  return [
    h.toString().padStart(2, '0'),
    m.toString().padStart(2, '0'),
    s.toString().padStart(2, '0'),
  ].join(':')
})

const startTimer = () => {
  if (!isRunning.value) {
    isRunning.value = true
    const startTime = Date.now() - elapsedTime.value * 1000

    timer = setInterval(() => {
      elapsedTime.value = Math.floor((Date.now() - startTime) / 1000)
    }, 1000)
  }
}

const pauseTimer = () => {
  isRunning.value = false
  clearInterval(timer)
}

const stopTimer = () => {
  isRunning.value = false
  clearInterval(timer)
  elapsedTime.value = 0
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
    <div class="flex flex-col items-center">
      <div class="text-5xl font-bold mb-6">{{ formattedTime }}</div>
      <div class="flex gap-4">
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
