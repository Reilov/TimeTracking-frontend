<script setup>
import HRReports from '@/components/HR/HRReports.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import AvatarProfile from '@/components/AvatarProfile.vue'
import NavTabs from '@/components/NavTabs.vue'
import { ref, computed, defineProps, defineEmits, watch, onBeforeUnmount } from 'vue'
import EmployeeHoursChart from '@/components/EmployeeHoursChart.vue'
import { useFormatters } from '@/composables/useFormatters'
const { formatDate, getWorkdayComparison, declensionDays } = useFormatters()
import StatsBlock from '@/components/StatsBlock.vue'
const props = defineProps({
  userProfile: Object,
  modelValue: Boolean,
  isHrView: Boolean,
})

const emit = defineEmits(['update:modelValue'])
const activeTab = ref('profile') // 'profile' | 'stats' | 'reports'

const fieldsConfig = computed(() => [
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'birth_date', label: 'Дата рождения', type: 'date', formatter: formatDate },
  { key: 'phone', label: 'Телефон', type: 'tel' },
  { key: 'department_name', label: 'Отдел', type: 'text' },
  { key: 'position_name', label: 'Должность', type: 'text' },
  { key: 'about', label: 'Обо мне', type: 'textarea' },
])

const closeDrawer = () => emit('update:modelValue', false)

const toggleBodyScroll = (isOpen) => {
  if (isOpen) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
}

watch(() => props.modelValue, toggleBodyScroll)
onBeforeUnmount(() => toggleBodyScroll(false))
</script>

<template>
  <Transition name="slide-fade">
    <div v-if="modelValue" class="fixed inset-0 z-40 overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-50" @click="closeDrawer()" />

      <div
        class="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out dark:bg-gray-800 dark:text-white"
      >
        <div class="p-6 border-b border-gray-100 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {{ isHrView ? 'Карточка сотрудника' : 'Профиль' }}
            </h2>
            <button
              @click="closeDrawer()"
              class="p-1 rounded-full hover:bg-gray-100 group cursor-pointer dark:hover:bg-gray-700 transition-all"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div class="px-3">
          <NavTabs
            v-if="isHrView"
            :items="[
              { id: 'profile', label: 'Профиль' },
              { id: 'stats', label: 'Статистика' },
              { id: 'reports', label: 'Отчеты' },
            ]"
            :active-item="activeTab"
            @update:active-item="activeTab = $event"
          />
        </div>
        <div class="p-6 h-[calc(100%-120px)]">
          <div class="flex flex-col items-center mb-4">
            <AvatarProfile
              :avatar="userProfile.avatar"
              size="big"
              :avatarText="userProfile.name?.[0] || '?'"
            />
            <h3 class="mt-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
              {{ userProfile.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ userProfile.position_name }} • {{ userProfile.department_name }}
            </p>
          </div>

          <!-- Контент табов -->
          <template v-if="!isHrView || activeTab === 'profile'">
            <div class="w-full space-y-4">
              <div v-for="field in fieldsConfig" :key="field.key" class="space-y-1">
                <div v-if="userProfile[field.key]">
                  <label class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {{ field.label }}
                  </label>
                  <p class="text-gray-800 dark:text-gray-100">
                    {{
                      field.formatter
                        ? field.formatter(userProfile[field.key])
                        : userProfile[field.key] || 'Не указано'
                    }}
                  </p>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="activeTab === 'stats'">
            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <StatsBlock
                  title="Общее время"
                  :value="userProfile?.totalHours"
                  :description="`за ${userProfile?.workingDaysCount}  ${declensionDays(userProfile?.workingDaysCount)}`"
                />

                <StatsBlock
                  title="Среднее в будний день"
                  :value="userProfile?.avgHours"
                  :description="getWorkdayComparison(userProfile?.avgHours)"
                />
              </div>

              <div>
                <h4 class="text-md font-medium mb-3 text-gray-700 dark:text-white">
                  Часы работы на неделе
                </h4>
                <div class="h-64">
                  <EmployeeHoursChart :records="userProfile?.stats" />
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="activeTab === 'reports'">
            <HRReports :userId="props.userProfile?.id" :userName="props.userProfile?.name" />
          </template>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active .bg-white,
.slide-fade-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.slide-fade-enter-from .bg-white,
.slide-fade-leave-to .bg-white {
  transform: translateX(100%);
}
</style>
