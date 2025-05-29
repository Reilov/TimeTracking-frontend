<script setup>
import { ref, computed } from 'vue'
import SelectInput from '@/components/SelectInput.vue'
import TextInput from '@/components/TextInput.vue'
import Message from '@/components/Message.vue'
import Button from '@/components/Button.vue'
import { useExport } from '@/composables/useExport'

defineProps({
  userId: Number,
  userName: String,
})

const periods = [
  { id: 'week', name: 'Неделя' },
  { id: 'month', name: 'Месяц' },
  { id: 'quarter', name: 'Квартал' },
  { id: 'year', name: 'Год' },
  { id: 'custom', name: 'Пользовательский' },
]

const selectedPeriodId = ref('week')
const startDate = ref(null)
const endDate = ref(null)

// Вычисляемое свойство для получения полного объекта периода
const currentPeriod = computed(
  () => periods.find((p) => p.id === selectedPeriodId.value) || periods[0],
)

const exportParams = computed(() => ({
  period: currentPeriod.value,
  startDate: startDate.value,
  endDate: endDate.value,
}))

const { downloadStats, errorMessage } = useExport()

const typeStats = [
  { type: 'pdf', text: 'PDF отчет' },
  { type: 'excel', text: 'Excel файл' },
  { type: 'csv', text: 'CSV данные' },
]
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200">Экспорт данных</h3>

    <div class="mb-6">
      <div>
        <SelectInput v-model="selectedPeriodId" label="Период" :options="periods" />
      </div>

      <div v-if="selectedPeriodId === 'custom'" class="grid grid-cols-2 gap-3">
        <div>
          <TextInput label="с" type="date" v-model="startDate" />
        </div>
        <div>
          <TextInput label="По" type="date" v-model="endDate" />
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <Button
        v-for="typeStat in typeStats"
        :key="typeStat.type"
        @click="downloadStats(typeStat.type, exportParams, userId, userName)"
        :text-button="typeStat.text"
        variant="outline"
        size="big"
        class="w-full justify-start items-start"
      />
    </div>
    <Message v-if="errorMessage" :error="true" :message="errorMessage" />
  </div>
</template>
