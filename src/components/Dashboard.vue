<script setup>
import Timer from '@/components/Timer.vue'
import EmployeeHoursChart from '@/components/EmployeeHoursChart.vue'
import axios from 'axios'
import BlockMain from '@/components/BlockMain.vue'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

import StatsBlock from './StatsBlock.vue'

const authStore = useAuthStore()
const timeRecords = ref([])
const avgHours = ref(null)
const totalHours = ref(null)
const workingDaysCount = ref(null)

const fetchTimeStats = async () => {
  try {
    const response = await axios.get('/api/timer/stats/week', {
      withCredentials: true,
    })
    timeRecords.value = response.data.stats.map((item) => ({
      date: item.date,
      workedSeconds: item.total_worked_seconds,
    }))
    avgHours.value = response.data.avg_hours
    totalHours.value = response.data.total_hours
    workingDaysCount.value = response.data.working_days_count
  } catch (err) {
    console.error(err)
  }
}

const declensionDays = (count) => {
  const cases = [2, 0, 1, 1, 1, 2]
  const words = ['день', 'дня', 'дней']
  return words[count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]]
}
const getWorkdayComparison = (hours) => {
  if (hours < 6) return 'Меньше стандартного рабочего дня'
  if (hours > 9) return 'Больше стандартного рабочего дня'
  return 'Стандартный рабочий день'
}

onMounted(fetchTimeStats)
</script>

<template>
  <BlockMain>
    <Timer :user-id="authStore.user.id" />
  </BlockMain>
  <div class="grid grid-cols-1 md:grid-cols-2 md:gap-4">
    <BlockMain title="Часы работы по дням">
      <EmployeeHoursChart :records="timeRecords" />
    </BlockMain>

    <div class="grid grid-cols-2 gap-4 items-start">
      <StatsBlock
        title="Общее время"
        :value="totalHours"
        :description="`за ${workingDaysCount}  ${declensionDays(workingDaysCount)}`"
      />

      <StatsBlock
        title="Среднее в будний день"
        :value="avgHours"
        :description="getWorkdayComparison(avgHours)"
      />
    </div>
  </div>
</template>
