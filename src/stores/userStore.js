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
    // if (employees.value.length) return

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
        const [statsWeekRes, statsAllRes] = await Promise.all([
          api.get(`/timer/stats/week/${id}`),
          api.get(`/timer/calendar/${id}`),
        ])

        employee.value = {
          ...employee.value,
          weeklyStats: {
            stats: statsWeekRes.data.stats.map((item) => ({
              date: item.date,
              workedSeconds: item.total_worked_seconds,
            })),
            totalHours: statsWeekRes.data.total_hours,
            avgHours: statsWeekRes.data.avg_hours,
            workingDaysCount: statsWeekRes.data.working_days_count,
            period: statsWeekRes.data.period,
            startDate: statsWeekRes.data.start_date,
            endDate: statsWeekRes.data.end_date,
          },
          allTimeStats: {
            stats: statsAllRes.data.stats,
          },
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке деталей сотрудника:', error)
    }
  }

  return { employees, isLoading, fetchEmployees, fetchEmployee, employee }
})
