import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const currentUser = authStore.user

export const useUserStore = defineStore('users', () => {
  const employees = ref([])
  const employee = ref(null)
  const isLoading = ref(false)

  const fetchEmployees = async () => {
    if (employees.value.length) return

    try {
      isLoading.value = true
      const response = await api.get('/users')
      employees.value = response.data.users
    } catch (err) {
      console.error('Ошибка при загрузке пользователей:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchEmployee = async (id) => {
    try {
      const userRes = await api.get(`/users/${id}`)
      employee.value = userRes.data.user

      if (currentUser.role_name === 'HR' || currentUser.role_name === 'Admin') {
        const statsRes = await api.get(`/timer/stats/week/${id}`)

        employee.value = {
          ...employee.value,
          stats: statsRes.data.stats.map((item) => ({
            date: item.date,
            workedSeconds: item.total_worked_seconds,
          })),
          totalHours: statsRes.data.total_hours,
          avgHours: statsRes.data.avg_hours,
          workingDaysCount: statsRes.data.working_days_count,
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке деталей сотрудника:', error)
    }
  }

  return { employees, isLoading, fetchEmployees, fetchEmployee, employee }
})
