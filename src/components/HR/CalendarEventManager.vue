<!-- CalendarEventManager.vue -->
<script setup>
import Button from '@/components/Button.vue'
import TextInput from '@/components/TextInput.vue'
import SelectInput from '@/components/SelectInput.vue'
import { ref, computed, defineEmits } from 'vue'
import api from '@/api/axios'
import { useFormatters } from '@/composables/useFormatters'

const { formatDate } = useFormatters()

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  selectedDates: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['event-created'])

// Состояния формы
const eventType = ref('vacation')
const comment = ref('')
const isLoading = ref(false)

// Форматирование выбранных дат для отображения
const formattedSelectedDates = computed(() => {
  if (!props.selectedDates || props.selectedDates.length === 0) {
    return 'Не выбрано ни одной даты'
  }

  if (props.selectedDates.length === 1) {
    return formatDate(props.selectedDates[0])
  }

  return `${formatDate(props.selectedDates[0])} - ${formatDate(props.selectedDates[props.selectedDates.length - 1])} (${props.selectedDates.length} дней)`
})

// Сброс формы
const resetForm = () => {
  emit('event-created')
  eventType.value = 'vacation'
  comment.value = ''
}

// Создание события
const createEvent = async () => {
  if (props.selectedDates.length === 0) return

  isLoading.value = true

  try {
    // Получаем первую и последнюю дату из выбранного диапазона
    const sortedDates = [...props.selectedDates].sort((a, b) => a - b)
    const startDate = sortedDates[0]
    const endDate = sortedDates[sortedDates.length - 1]

    // Форматируем даты в YYYY-MM-DD
    const formatToServerDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const eventData = {
      user_id: props.userId,
      start_date: formatToServerDate(startDate),
      end_date: formatToServerDate(endDate),
      type: eventType.value,
      comment: comment.value,
    }

    await api.post('/user-day-events', eventData)

    resetForm()
  } catch (error) {
    console.error('Ошибка при создании события:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="mb-4">
    <h3 class="text-lg font-medium mb-2">Управление событиями</h3>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Выберите даты в календаре для отпуска, командировки сотрудника и т.д.
    </p>
  </div>

  <div
    class="border border-dashed border-gray-400 mb-4 p-3 bg-gray-50 rounded dark:bg-gray-900 dark:border-gray-950"
  >
    <p class="font-medium">Выбранные даты:</p>
    <p class="dark:text-gray-300">{{ formattedSelectedDates }}</p>
  </div>
  <slot name="calendar"></slot>
  <div class="space-y-4">
    <SelectInput
      v-model="eventType"
      :options="[
        { id: 'vacation', name: 'Отпуск' },
        { id: 'business_trip', name: 'Командировка' },
        { id: 'sick', name: 'Больничный' },
        { id: 'day_off', name: 'Выходной' },
      ]"
      label="Тип события"
    />

    <TextInput label="Комментарий" type="textarea" v-model="comment" />

    <div class="flex justify-end gap-2">
      <Button @click="resetForm" text-button="Сбросить" variant="secondary" :disabled="isLoading" />
      <Button
        @click="createEvent"
        :text-button="isLoading ? 'Сохранение...' : 'Сохранить'"
        :disabled="isLoading || props.selectedDates.length === 0"
      />
    </div>
  </div>
</template>
