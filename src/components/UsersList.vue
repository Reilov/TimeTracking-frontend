<script setup>
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import AvatarProfile from '@/components/AvatarProfile.vue'
import UserProfileDrawer from '@/components/UserProfileDrawer.vue'
const userStore = useUserStore()
const isDrawerVisible = ref(false)
const selectedEmployee = ref(null)

const columns = [
  { key: 'avatar', label: '' },
  { key: 'name', label: 'ФИО' },
  { key: 'email', label: 'E-mail' },
  { key: 'position_name', label: 'Должность' },
  { key: 'department_name', label: 'Отдел' },
]

const viewEmployee = async (id) => {
  await userStore.fetchEmployee(id)
  selectedEmployee.value = userStore.employee
  isDrawerVisible.value = true
}

onMounted(userStore.fetchEmployees)
</script>

<template>
  <UserProfileDrawer :user-profile="selectedEmployee" v-model="isDrawerVisible" />

  <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
    <div v-if="userStore.isLoading" class="p-8 text-center">
      <div class="animate-pulse flex flex-col space-y-4">
        <div v-for="i in 5" :key="i" class="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>

    <table v-else class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-100 dark:bg-gray-700">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <tr
          v-for="employee in userStore.employees"
          :key="employee.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
          @click="viewEmployee(employee.id)"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :class="[
              'cursor-pointer px-6 py-4 whitespace-nowrap text-sm',
              column.key === 'name'
                ? 'font-medium text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-300',
            ]"
          >
            <template v-if="column.key === 'avatar'">
              <AvatarProfile
                :avatar="employee.avatar"
                :avatar-text="employee.name[0]"
                size="small"
              />
            </template>
            <template v-else>
              {{ employee[column.key] || '—' }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
