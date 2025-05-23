import { ref } from 'vue'
import { exportToCsv, exportToExcel, exportToPdf } from '@/utils/exportHelpers'
import { useReportsStore } from '@/stores/reportsStore'
import { useFormatters } from '@/composables/useFormatters'

export function useExport() {
  const reportsStore = useReportsStore()
  const errorMessage = ref(null)

  const buildQueryParams = (params) => {
    if (params.period.id === 'custom') {
      const startDate = params.startDate
        ? new Date(params.startDate).toISOString().split('T')[0]
        : null
      const endDate = params.endDate ? new Date(params.endDate).toISOString().split('T')[0] : null
      return { start: startDate, end: endDate }
    }
    return {}
  }

  const downloadStats = async (type, params, userId, userName) => {
    errorMessage.value = null
    try {
      const queryParams = buildQueryParams(params)
      const fetchData = await reportsStore.fetchReportData({
        userId: userId,
        period: params.period.id,
        ...queryParams,
      })

      if (!fetchData?.stats?.length) {
        errorMessage.value = 'Нет данных для экспорта'
        console.error('No data to export')
        return
      }

      const { formatDate } = useFormatters()

      const formattedData = {
        ...fetchData,
        start_date: formatDate(fetchData['start_date']),
        end_date: formatDate(fetchData['end_date']),
        stats: formatDate(fetchData['stats']['date']),
        userName: userName,
        period: params.period.name,
      }

      if (fetchData.stats && Array.isArray(fetchData.stats)) {
        formattedData.stats = fetchData.stats.map((stat) => ({
          ...stat,
          date: formatDate(stat.date),
          total_worked_seconds: stat.total_worked_seconds,
        }))
      }

      switch (type) {
        case 'pdf':
          exportToPdf(
            formattedData,
            `отчет_${userName}_${new Date().toISOString().slice(0, 10)}.pdf`,
          )
          break
        case 'excel':
          exportToExcel(
            formattedData,
            `отчет_${userName}_${new Date().toISOString().slice(0, 10)}.xlsx`,
          )
          break
        case 'csv':
          exportToCsv(
            formattedData,
            `отчет_${userName}_${new Date().toISOString().slice(0, 10)}.csv`,
          )
          break
        default:
          errorMessage.value = `Неизвестный тип экспорта: ${type}`
          console.warn('Unknown export type:', type)
      }

      //   return true
    } catch (error) {
      errorMessage.value = error.response?.data?.message
      console.error(error.response?.data?.message || error)
    }
  }

  return { downloadStats, errorMessage }
}
