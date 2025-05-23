export function useFormatters() {
  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано'

    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
  }

  const secondsToHours = (seconds) => (seconds / 3600).toFixed(2)

  const getWorkdayComparison = (hours) => {
    if (hours < 6) return 'Меньше стандартного рабочего дня'
    if (hours > 9) return 'Больше стандартного рабочего дня'
    return 'Стандартный рабочий день'
  }

  const declensionDays = (count) => {
    const cases = [2, 0, 1, 1, 1, 2]
    const words = ['день', 'дня', 'дней']
    return words[count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]]
  }

  return { formatDate, secondsToHours, getWorkdayComparison, declensionDays }
}
