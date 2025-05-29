<script setup>
import { ref, computed, watch } from 'vue'
import { Calendar } from 'v-calendar'
import 'v-calendar/dist/style.css'
import { useTheme } from '@/composables/useTheme'
import Message from '@/components/Message.vue'

const { isDark } = useTheme()
const props = defineProps({
  sessions: {
    type: Array,
    default: () => [],
  },
  selectMode: {
    type: String, // 'range'
  },
})

const emit = defineEmits(['select-dates', 'update:selected-dates'])

// Состояние для выбранных дат
const selectedDates = ref([])
const rangeStart = ref(null)

// Атрибуты календаря (существующие сессии + выбранные даты)
const calendarAttributes = computed(() => {
  const attributes = []

  // 1. Добавляем существующие сессии
  props.sessions.forEach((session) => {
    let color = 'green'
    let label = ''

    switch (session.status) {
      case 'sick':
        color = 'blue'
        label = 'Болеет'
        break
      case 'vacation':
        color = 'gray'
        label = 'Отпуск'
        break
      case 'day_off':
        color = 'lightgray'
        label = 'Выходной'
        break
      case 'business_trip':
        color = 'purple'
        label = 'Командировка'
        break
      case 'completed':
        if (session.workedSeconds < 28800) {
          color = 'orange'
          label = 'Неполный день'
        } else {
          label = 'Работал'
        }
        if (session.startTime > '09:30') {
          color = 'red'
          label = 'Опоздание'
        }
        break
      default:
        color = 'green'
        label = 'Активный день'
    }

    const workedHours = Math.floor(session.workedSeconds / 3600)
    const workedMinutes = Math.floor((session.workedSeconds % 3600) / 60)

    let popoverLabel = ''
    if (session.status === 'completed') {
      popoverLabel = `
        ${label ? label + '\n' : ''}
        Время: ${session.startTime} — ${session.endTime || 'еще работает'}
        Отработано: ${workedHours}ч ${workedMinutes}м
        Статус: ${label}
      `
    } else {
      popoverLabel = `
        Статус: ${label || session.status}
        ${session.comment ? '\nКомментарий: ' + session.comment : ''}
      `
    }

    if (session.startDate && session.endDate) {
      attributes.push({
        key: `event-${session.startDate}-${session.endDate}-${session.status}`,
        highlight: { color, span: true },
        dates: { start: new Date(session.startDate), end: new Date(session.endDate) },
        popover: { label: popoverLabel.trim() },
        html: true,
      })
    } else {
      attributes.push({
        key: `session-${session.date}-${session.startTime || ''}-${session.status || ''}`,
        highlight: { color },
        dates: new Date(session.date),
        popover: { label: popoverLabel.trim() },
        html: true,
      })
    }
  })

  // 2. Добавляем выбранные даты (если есть)
  if (selectedDates.value.length > 0) {
    attributes.push({
      key: 'date-selection',
      highlight: {
        color: 'yellow',
        fillMode: 'light',
        contentClass: 'font-bold',
      },
      dates: selectedDates.value,
      popover: {
        label: `Выбрано дат: ${selectedDates.value.length}`,
        visibility: 'hover',
      },
    })
  }

  return attributes
})

const handleDayClick = (day) => {
  const date = new Date(day.date)

  if (props.selectMode === 'range') {
    handleRangeSelection(date)
  }
}

const handleRangeSelection = (date) => {
  if (!rangeStart.value) {
    rangeStart.value = date
    selectedDates.value = [date]
  } else {
    const start = rangeStart.value
    const end = date

    const [startDate, endDate] = [start, end].sort((a, b) => a - b)
    const datesInRange = []
    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      datesInRange.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    selectedDates.value = datesInRange
    rangeStart.value = null

    emit('select-dates', datesInRange)
    emit('update:selected-dates', datesInRange)
  }
}

const resetSelection = () => {
  selectedDates.value = []
  rangeStart.value = null
}

defineExpose({ resetSelection })
</script>

<template>
  <Message
    v-if="selectMode === 'range' && rangeStart"
    :error="true"
    message="Выберите конечную дату диапазона"
  />
  <Calendar
    :attributes="calendarAttributes"
    expanded
    borderless
    class="bg-white dark:bg-gray-700 rounded-lg"
    :is-dark="isDark"
    @dayclick="handleDayClick"
  />
</template>

<style scoped>
.vc-dark {
  background-color: var(--color-gray-800);
}
</style>
