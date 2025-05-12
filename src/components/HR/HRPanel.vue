<script setup>
import Button from '@/components/Button.vue'
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import UserProfileDrawer from '../UserProfileDrawer.vue'
import EditProfile from '../EditProfile.vue'
import BlockMain from '../BlockMain.vue'

const employees = ref([])

const showCreateModal = ref(false)
const showEditModal = ref(false)
const currentEmployee = ref(null)
const searchQuery = ref('')
const showProfileDrawer = ref(false)

const filteredEmployees = computed(() => {
  return employees.value.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      emp.position_title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      emp.department_name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

function openEditModal(employee) {
  console.log('openEditModal', employee)

  currentEmployee.value = employee
  showEditModal.value = true
}

function deleteEmployee(id) {
  employees.value = employees.value.filter((emp) => emp.id !== id)
}

const selectedEmployee = ref(null)

const detailEmployee = async (id) => {
  try {
    const response = await axios.get(`/api/users/${id}`)
    selectedEmployee.value = response.data.user
    showProfileDrawer.value = true
  } catch (error) {
    console.error('Ошибка при загрузке деталей сотрудника:', error)
  }
}

import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <UserProfileDrawer
    v-if="showProfileDrawer"
    :userProfile="selectedEmployee"
    @toggleUserProfile="showProfileDrawer = false"
  />
  <BlockMain title="HR Панель">
    <template #header-actions>
      <Button @click="router.push('/hr/new-employee')" text-button="Добавить сотрудника" />
    </template>

    <!-- <div class="mb-6 flex gap-4">
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по имени, должности или отделу..."
          class="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      <button variant="outline" class="flex items-center gap-2">Фильтры</button>
    </div> -->

    <router-view></router-view>
  </BlockMain>
</template>
