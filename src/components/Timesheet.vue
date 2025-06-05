<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/api/axios'
import SelectInput from '@/components/SelectInput.vue'
import BlockMain from '@/components/BlockMain.vue'
import Button from '@/components/Button.vue'
import { exportTimesheetToPdf } from '@/utils/exportHelpers'
import TextInput from './TextInput.vue'
import Message from './Message.vue'
// переменные
const timesheetData = ref([])
const loading = ref(false)
const error = ref(null)
const selectedEmployeeId = ref('all')
const selectedMonth = ref(new Date().getMonth() + 1)
const selectedYear = ref(new Date().getFullYear())
const statusCodes = {
  completed: { code: 'Я', name: 'Явка', color: 'var(--completed-color)' },
  vacation: { code: 'ОТ', name: 'Отпуск', color: 'var(--vacation-color)' },
  sick: { code: 'Б', name: 'Больничный', color: 'var(--sick-color)' },
  day_off: { code: 'ОД', name: 'Отгул', color: 'var(--day-off-color)' }, // <- day-off вместо day_off
  absent: { code: 'Н', name: 'Неявка', color: 'var(--absent-color)' },
  weekend: { code: 'В', name: 'Выходной', color: 'var(--weekend-color)' },
  business_trip: { code: 'К', name: 'Командировка', color: 'var(--business-trip-color)' }, // <- business-trip
}
const employees = ref([{ id: 'all', name: 'Все' }])
const allTimesheetData = ref([])

// функции
const fetchTimesheetData = async () => {
  loading.value = true
  error.value = null

  try {
    const params = {
      month: selectedMonth.value,
      year: selectedYear.value,
    }

    const response = await api.get(`/timesheet`, { params })

    allTimesheetData.value = Object.values(response.data).filter(
      (item) => typeof item === 'object' && item !== null && !Array.isArray(item),
    )

    if (selectedEmployeeId.value === 'all') {
      timesheetData.value = allTimesheetData.value
    } else {
      timesheetData.value = allTimesheetData.value.filter(
        (item) => item.employee?.id === selectedEmployeeId.value,
      )
    }

    employees.value = [
      { id: 'all', name: 'Все' },
      ...allTimesheetData.value
        .map((item) => item.employee)
        .filter((emp) => emp && emp.id && emp.name)
        .map((emp) => ({
          id: emp.id,
          name: emp.name,
        })),
    ]
  } catch (err) {
    error.value = err.response?.data?.message || 'Не удалось загрузить данные табеля'
    console.error('Timesheet error:', err)
  } finally {
    loading.value = false
  }
}

const formatTime = (seconds) => {
  if (seconds === 0) return ''
  const hours = Math.floor(seconds / 3600)
  return hours > 0 ? `${hours}` : ''
}

const getStatusCode = (status) => {
  return statusCodes[status]?.code || ''
}

const getDayStatus = (timesheet, dayIndex) => {
  // const status = timesheet.days[dayIndex]?.status || 'absent'
  return timesheet.days[dayIndex]?.status || 'absent'
}

const getDayWorkedSeconds = (timesheet, dayIndex) => {
  return timesheet.days[dayIndex]?.worked_seconds || 0
}

// computed
// Получаем количество дней в месяце
const daysInSelectedMonth = computed(() => {
  return new Date(selectedYear.value, selectedMonth.value, 0).getDate()
})

// Создаем массив дней месяца
const monthDays = computed(() => {
  return Array.from({ length: daysInSelectedMonth.value }, (_, i) => i + 1)
})

// Итоговые вычисления
const totalWorkedTime = computed(() => {
  const totalSeconds = timesheetData.value.reduce((sum, item) => {
    return sum + (item.summary?.total_seconds || 0)
  }, 0)

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  return `${hours}ч ${minutes}м`
})

const monthOptions = computed(() => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: new Date(selectedYear.value, i)
      .toLocaleDateString('ru-RU', { month: 'long' })
      .toLowerCase(),
  }))
})

// монтировка
onMounted(async () => {
  fetchTimesheetData()
})

// ватчеры
watch([selectedMonth, selectedYear], () => {
  fetchTimesheetData()
})
watch(selectedEmployeeId, (newId) => {
  if (newId === 'all') {
    // Показать всех сотрудников
    timesheetData.value = allTimesheetData.value
  } else {
    // Фильтровать по выбранному сотруднику
    timesheetData.value = allTimesheetData.value.filter((item) => item.employee?.id === newId)
  }
})

const activeTab = ref({ employeeId: null, day: null, status: 'absent' })

const openTab = (employeeId, day) => {
  if (activeTab.value.employeeId === employeeId && activeTab.value.day === day) {
    // Закрыть, если кликнули на ту же ячейку
    activeTab.value = {
      employeeId: null,
      day: null,
      status: '',
    }
  } else {
    activeTab.value = {
      employeeId,
      day,
      status: getDayStatus(
        timesheetData.value.find((ts) => ts.employee?.id === employeeId),
        day - 1,
      ),
    }
  }
}

const hoursToAdd = ref(0)
const minutesToAdd = ref(0)
const errorModal = ref('')
const comment = ref('')
const addTime = async () => {
  try {
    errorModal.value = ''

    const totalSecondsToAdd = hoursToAdd.value * 3600 + minutesToAdd.value * 60

    if (totalSecondsToAdd <= 0 && activeTab.value.status == 'completed') {
      errorModal.value = 'Введите время'
      return
    }

    await api.post('/add-work-day', {
      user_id: activeTab.value.employeeId,
      status: activeTab.value.status,
      elapsed_seconds: totalSecondsToAdd,
      date: `${selectedYear.value}.${String(selectedMonth.value).padStart(2, '0')}.${String(activeTab.value.day).padStart(2, '0')}`,
      comment: comment.value,
    })

    await fetchTimesheetData()
    activeTab.value = {
      employeeId: null,
      day: null,
      status: '',
    }
    hoursToAdd.value = 0
    minutesToAdd.value = 0
  } catch (error) {
    console.error('Ошибка добавления времени:', error)
    errorModal.value = 'Не удалось добавить время'
  }
}

const filteredStatusCodes = computed(() => {
  const keys = ['completed', 'day_off']
  return keys.map((key) => ({
    id: key,
    name: statusCodes[key].name,
  }))
})
</script>

<template>
  <BlockMain title="Табель учета рабочего времени">
    <template #header-actions>
      <div class="flex justify-end items-center gap-4 flex-col md:flex-row mt-4 md:mt-0">
        <div class="flex items-center gap-2 flex-wrap">
          <SelectInput v-model="selectedEmployeeId" :options="employees" class="w-40" />
          <SelectInput v-model="selectedMonth" :options="monthOptions" class="w-40" />
          <SelectInput
            v-model="selectedYear"
            :options="[2023, 2024, 2025].map((y) => ({ id: y, name: y }))"
            class="w-24"
          />
        </div>

        <Button
          @click="
            exportTimesheetToPdf(
              `табель_${selectedEmployeeId == 'all' ? 'всех_сотрудников' : `сотрудника_${selectedEmployeeId}`}`,
            )
          "
          text-button="Экспорт в PDF"
        />
      </div>
    </template>
    <div class="flex gap-4 flex-wrap">
      <div
        class="w-max mb-2 flex items-center gap-1"
        v-for="statusCode in statusCodes"
        :key="statusCode"
      >
        <div
          class="p-1 py-2 text-center"
          :style="{
            backgroundColor: statusCode.color || '#fff',
          }"
        >
          {{ statusCode.code }}
        </div>
        -
        <span>{{ statusCode.name }}</span>
      </div>
    </div>

    <div v-if="loading" class="text-center text-lg py-6">Загрузка данных...</div>
    <div v-else-if="error" class="text-center text-red-600 text-lg py-6">{{ error }}</div>
    <div v-else class="overflow-x-auto" id="report">
      <table
        class="w-full table-auto border-collapse border border-gray-300 dark:border-gray-900 text-sm"
      >
        <thead class="bg-gray-100 dark:bg-gray-900">
          <tr>
            <th rowspan="3" class="border border-gray-300 dark:border-gray-900 px-2 py-1 w-8">№</th>
            <th rowspan="3" class="border border-gray-300 dark:border-gray-900 px-2 py-1 w-[100px]">
              ФИО, должность
            </th>
            <th rowspan="3" class="border border-gray-300 dark:border-gray-900 px-2 py-1 w-12">
              Таб. №
            </th>
            <th
              :colspan="daysInSelectedMonth"
              class="border border-gray-300 dark:border-gray-900 px-2 py-1 text-center"
            >
              Отметки о явках и неявках на работу по числам месяца
            </th>
            <th
              colspan="2"
              class="border border-gray-300 dark:border-gray-900 px-2 py-1 text-center"
            >
              Отработано за половину месяца
            </th>
          </tr>
          <tr>
            <th
              :colspan="Math.min(15, daysInSelectedMonth)"
              class="border border-gray-300 dark:border-gray-900 px-2 py-1 text-center"
            >
              Первая половина месяца
            </th>
            <th
              v-if="daysInSelectedMonth > 15"
              :colspan="daysInSelectedMonth - 15"
              class="border border-gray-300 dark:border-gray-900 px-2 py-1 text-center"
            >
              Вторая половина месяца
            </th>
            <th rowspan="2" class="border border-gray-300 dark:border-gray-900 px-2 py-1 w-8">I</th>
            <th rowspan="2" class="border border-gray-300 dark:border-gray-900 px-2 py-1 w-8">
              II
            </th>
          </tr>
          <tr>
            <th
              v-for="day in monthDays"
              :key="day"
              class="border border-gray-300 dark:border-gray-900 px-1 py-1 text-center w-6"
            >
              {{ day }}
            </th>
          </tr>
        </thead>
        <tbody v-for="(timesheet, index) in timesheetData" :key="timesheet.employee?.id">
          <tr>
            <td class="border border-gray-300 dark:border-gray-900 px-2 py-1 text-center">
              {{ index + 1 }}
            </td>
            <td class="border border-gray-300 dark:border-gray-900 px-2 py-1">
              {{ timesheet.employee?.name }}, {{ timesheet.employee?.position_name }}
            </td>
            <td class="border border-gray-300 dark:border-gray-900 px-2 py-1 text-center">
              {{ timesheet.employee?.id }}
            </td>

            <!-- Ячейки статусов для первой половины месяца -->
            <td
              v-for="day in monthDays"
              :key="`status-${day}`"
              class="relative border border-gray-300 dark:border-gray-900 px-1 py-1 text-center cursor-pointer"
              :style="{
                backgroundColor: statusCodes[getDayStatus(timesheet, day - 1)]?.color || '#fff',
              }"
              @click="openTab(timesheet.employee?.id, day)"
            >
              {{ getStatusCode(getDayStatus(timesheet, day - 1)) }}
              <div
                class="modal fixed z-100 bg-white dark:bg-gray-800 p-2 w-xs border border-gray-300 dark:border-gray-900 rounded-lg text-left"
                v-if="activeTab.employeeId === timesheet.employee?.id && activeTab.day === day"
                @click.stop
              >
                <div class="mb-4">
                  <b>Имя:</b> {{ timesheet.employee?.name }}
                  <div class="">
                    <b>Дата:</b>
                    <span style="text-transform: capitalize">
                      {{ monthOptions[selectedMonth - 1].name }}
                    </span>
                    {{ day }}
                  </div>
                </div>
                <SelectInput
                  :options="filteredStatusCodes"
                  v-model="activeTab.status"
                  label="Статус"
                />
                <div class="flex gap-4 mb-4" v-if="activeTab.status == 'completed'">
                  <TextInput v-model.number="hoursToAdd" type="number" min="0" label="Часы" />
                  <TextInput
                    v-model.number="minutesToAdd"
                    type="number"
                    min="0"
                    max="59"
                    label="Минуты"
                  />
                </div>
                <TextInput
                  class="mb-4"
                  v-if="activeTab.status == 'day_off'"
                  type="textarea"
                  v-model="comment"
                  label="Комментарий"
                />
                <Message v-if="errorModal" error="true" :message="errorModal" class="mb-4" />
                <Button class="w-full" text-button="Подтвердить" @click="addTime" />
              </div>
            </td>

            <!-- Отработано часов за первую половину -->
            <td class="text-center" colspan="2">
              <div style="border-bottom: 1px solid #d1d5db; padding: 4px">Дней отработано</div>
              <div style="padding: 4px">
                {{ timesheet.summary.working_days }}
              </div>
            </td>
          </tr>

          <tr v-if="timesheet.summary.total_first_half || timesheet.summary.second_half_hours">
            <td colspan="3" class="border border-gray-300 dark:border-gray-900 px-2 py-1"></td>

            <!-- Ячейки часов для первой половины месяца -->
            <td
              v-for="day in monthDays"
              :key="`hours-${day}`"
              class="border border-gray-300 dark:border-gray-900 px-1 py-1 text-center"
            >
              {{ formatTime(getDayWorkedSeconds(timesheet, day - 1)) }}
            </td>

            <td class="border border-gray-300 dark:border-gray-900 px-1 py-1 text-center">
              {{ formatTime(timesheet.summary.total_first_half) }}
            </td>
            <td class="border border-gray-300 dark:border-gray-900 px-1 py-1 text-center">
              {{ formatTime(timesheet.summary.second_half_hours) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-4 flex justify-between items-center">
        <div class="text-sm">
          <div><span class="font-semibold">Всего отработано:</span> {{ totalWorkedTime }}</div>
        </div>
      </div>
    </div>
  </BlockMain>
</template>

<style>
:root {
  --completed-color: #e6ffe6;
  --vacation-color: #fff2cc;
  --sick-color: #ffe6e6;
  --day-off-color: #e6f3ff;
  --absent-color: #ffcccc;
  --weekend-color: #f0f0f0;
  --business-trip-color: #e6e6ff;
  --active-color: #bb86fc;
}

html.dark {
  --completed-color: #6b996b; /* Тёмно-зелёный */
  --vacation-color: #c4a95a; /* Тёмно-жёлтый */
  --sick-color: #c47d7d; /* Тёмно-розовый */
  --day-off-color: #5a8fb8; /* Тёмно-голубой */
  --absent-color: #c45a5a; /* Тёмно-красный */
  --weekend-color: #8c8c8c; /* Серый */
  --business-trip-color: #5a5ab8; /* Тёмно-синий */
  --active-color: #bb86fc;
}

.modal {
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  z-index: 1000;
}
</style>
