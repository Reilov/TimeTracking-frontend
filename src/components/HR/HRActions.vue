<!-- HRActions.vue -->
<script setup>
import { ref } from 'vue'
import CalendarView from '@/components/CalendarView.vue'
import CalendarEventManager from '@/components/HR/CalendarEventManager.vue'
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
const selectedDates = ref([])
const calendarViewRef = ref(null)

const handleDatesSelect = (dates) => {
  selectedDates.value = dates
}

const props = defineProps({
  userId: Number,
  sessions: Array,
})

const handleEventCreated = async () => {
  selectedDates.value = []
  calendarViewRef.value?.resetSelection()

  await userStore.fetchEmployee(props.userId)
}
</script>

<template>
  <div class="mb-10">
    <CalendarEventManager
      :userId="props.userId"
      :selectedDates="selectedDates"
      @event-created="handleEventCreated"
    >
      <template #calendar>
        <CalendarView
          ref="calendarViewRef"
          :sessions="props.sessions"
          select-mode="range"
          @select-dates="handleDatesSelect"
        />
      </template>
    </CalendarEventManager>
  </div>
</template>
