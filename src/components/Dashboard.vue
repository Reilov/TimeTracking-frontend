<script setup>
import Timer from '@/components/Timer.vue'
import EmployeeHoursChart from '@/components/EmployeeHoursChart.vue'
import StatsBlock from '@/components/StatsBlock.vue'
import BlockMain from '@/components/BlockMain.vue'

import api from '@/api/axios'

import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

import { useFormatters } from '@/composables/useFormatters'
const { getWorkdayComparison, declensionDays } = useFormatters()

const authStore = useAuthStore()
const timeRecords = ref([])
const avgHours = ref(null)
const totalHours = ref(null)
const workingDaysCount = ref(null)

const fetchTimeStats = async () => {
  try {
    const response = await api.get('/timer/stats/week', {
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
onMounted(fetchTimeStats)
</script>

<template>
  <BlockMain>
    <Timer :user-id="authStore.user?.id" />
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
