import { defineStore } from 'pinia'
import api from '@/api/axios'
import { ref } from 'vue'

export const useReportsStore = defineStore('reports', () => {
  const reportData = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const fetchReportData = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const url = `/timer/stats/${params.period}/${params.userId}`

      const config =
        params.period === 'custom' ? { params: { start: params.start, end: params.end } } : {}

      const response = await api.get(url, config)

      reportData.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    reportData,
    isLoading,
    error,
    fetchReportData,
  }
})
