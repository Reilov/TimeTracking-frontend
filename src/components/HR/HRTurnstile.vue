<script setup>
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import SelectInput from '@/components/SelectInput.vue'
import api from '@/api/axios'

const MAX_SHORT_EXIT_MINUTES = 30

const userStore = useUserStore()

onMounted(() => {
  if (!userStore.employees || userStore.employees.length === 0) {
    userStore.fetchEmployees()
  }
})

const user = ref(null)
const isLoading = ref(false)
const showExitOptions = ref(false)

const selectedUser = computed(() => {
  return userStore.employees.find((emp) => emp.id === user.value) || null
})

const buttonText = computed(() => {
  if (!selectedUser.value) return 'Выберите сотрудника'

  switch (selectedUser.value.status) {
    case 'active':
      return 'Выход'
    case 'paused':
      return 'Вернуться с обеда'
    case 'completed':
    default:
      return 'Начать рабочий день'
  }
})

const buttonColor = computed(() => {
  if (!selectedUser.value) return 'gray'

  switch (selectedUser.value.status) {
    case 'active':
      return 'red'
    case 'paused':
      return 'orange'
    default:
      return 'green'
  }
})

// Функция для преобразования статуса в текст
function getStatusText(status) {
  switch (status) {
    case 'active':
      return 'Работает'
    case 'paused':
      return 'На обеде'
    case 'completed':
      return 'Рабочий день завершен'
    default:
      return 'Не работает'
  }
}

// Функция для форматирования даты/времени
function formatDateTime(datetime) {
  if (!datetime) return 'нет данных'
  return new Date(datetime).toLocaleString()
}

// Функция для форматирования времени в секундах в ЧЧ:ММ:СС
function formatTime(seconds) {
  if (!seconds) return '00:00:00'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return [hours, minutes, secs].map((v) => (v < 10 ? '0' + v : v)).join(':')
}

async function handleEnter() {
  if (!selectedUser.value || isLoading.value) return

  isLoading.value = true
  try {
    await api.post('/turnstile', {
      action: 'enter',
      user_id: selectedUser.value.id,
    })
    await userStore.fetchEmployees()
  } catch (error) {
    console.error('Ошибка:', error)
    alert(error.message)
  } finally {
    isLoading.value = false
  }
}

async function handleExit(exitType) {
  if (!selectedUser.value || isLoading.value) return

  isLoading.value = true
  try {
    console.log(exitType)
    await api.post('/turnstile', {
      action: 'exit',
      user_id: selectedUser.value.id,
      exit_type: exitType,
    })
    await userStore.fetchEmployees()
    showExitOptions.value = false
  } catch (error) {
    console.error('Ошибка:', error)
    alert(error.message)
  } finally {
    isLoading.value = false
  }
}

function onButtonClick() {
  if (selectedUser.value?.status === 'active') {
    showExitOptions.value = true
  } else {
    handleEnter()
  }
}
</script>

<template>
  <SelectInput v-model="user" :options="userStore.employees" label="Сотрудник" />

  <div v-if="selectedUser" class="turnstile-container">
    <!-- Основная кнопка -->
    <button
      v-if="!showExitOptions"
      @click="onButtonClick"
      class="action-button"
      :class="buttonColor"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Загрузка...' : buttonText }}
    </button>

    <!-- Варианты выхода -->
    <div v-if="showExitOptions" class="exit-options">
      <button @click="handleExit('short')" class="action-button blue">
        Короткий выход (до {{ MAX_SHORT_EXIT_MINUTES }} мин)
      </button>
      <button @click="handleExit('lunch')" class="action-button orange">Обед</button>
      <button @click="handleExit('final')" class="action-button red">Завершить день</button>
      <button @click="showExitOptions = false" class="action-button gray">Отмена</button>
    </div>

    <div class="session-info">
      <div>Статус: {{ getStatusText(selectedUser.status) }}</div>
      <div v-if="selectedUser.last_action">
        Последнее действие: {{ formatDateTime(selectedUser.last_action) }}
      </div>
      <div v-if="selectedUser.total_worked">
        Отработано: {{ formatTime(selectedUser.total_worked) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.turnstile-container {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 400px;
}

.action-button {
  padding: 10px 15px;
  margin: 5px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  width: 100%;
}

.red {
  background-color: #f44336;
}
.green {
  background-color: #4caf50;
}
.blue {
  background-color: #2196f3;
}
.orange {
  background-color: #ff9800;
}
.gray {
  background-color: #9e9e9e;
}

.exit-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.session-info {
  margin-top: 15px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 0.9em;
}

.session-info div {
  margin: 5px 0;
}
</style>
