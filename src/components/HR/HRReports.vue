<script setup>
import { ref } from 'vue'
import SelectInput from '@/components/SelectInput.vue'
import TextInput from '@/components/TextInput.vue'
import Message from '@/components/Message.vue'
import Button from '@/components/Button.vue'
import { useExport } from '@/composables/useExport'

defineProps({
  userId: Number,
  userName: String,
})

const exportParams = ref({
  period: { id: 'week', name: 'Неделя' },
  startDate: null,
  endDate: null,
})

const { downloadStats, errorMessage } = useExport()

const typeStats = [
  {
    type: 'pdf',
    text: 'PDF отчет',
  },
  {
    type: 'excel',
    text: 'Excel файл',
  },
  {
    type: 'csv',
    text: 'CSV данные',
  },
]
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200">Экспорт данных</h3>

    <div class="mb-6">
      <div>
        <SelectInput
          v-model="exportParams.period.id"
          label="Период"
          :options="[
            { id: 'week', name: 'Неделя' },
            { id: 'month', name: 'Месяц' },
            { id: 'quarter', name: 'Квартал' },
            { id: 'year', name: 'Год' },
            { id: 'custom', name: 'Произвольный' },
          ]"
        />
      </div>

      <div v-if="exportParams.period.id === 'custom'" class="grid grid-cols-2 gap-3">
        <div>
          <TextInput label="с" type="date" v-model="exportParams.startDate" />
        </div>
        <div>
          <TextInput label="По" type="date" v-model="exportParams.endDate" />
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
