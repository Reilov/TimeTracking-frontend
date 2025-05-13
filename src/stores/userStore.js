import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('users', () => {
  const employees = ref([])
  const employee = ref(null)
  const isLoading = ref(false)

  const fetchEmployees = async () => {
    if (employees.value.length) return

    try {
      isLoading.value = true
      const response = await axios.get('/api/users')
      employees.value = response.data.users
    } catch (err) {
      console.error('Ошибка при загрузке пользователей:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchEmployee = async (id) => {
    try {
      const response = await axios.get(`/api/users/${id}`)
      employee.value = response.data.user
    } catch (error) {
      console.error('Ошибка при загрузке деталей сотрудника:', error)
    }
  }

  return { employees, isLoading, fetchEmployees, fetchEmployee, employee }
})
