import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import '@/fonts/Roboto-Regular-normal'

export function exportToCsv(data, filename = 'report.csv') {
  if (!data || !data.stats || !data.stats.length) {
    console.error('No data to export')
    return
  }

  // 1. Подготовка данных
  const csvData = []

  // 2. Добавляем заголовок отчета
  csvData.push('Отчет о рабочем времени')
  csvData.push('') // Пустая строка

  // 3. Основная информация
  csvData.push('Основная информация:')
  csvData.push(
    [
      'Сотрудник',
      'Период',
      'Дата начала',
      'Дата окончания',
      'Рабочих дней',
      'Всего часов',
      'Среднее в день',
    ].join(','),
  )

  csvData.push(
    [
      `"${data.userName || ''}"`,
      `"${data.period || ''}"`,
      `"${data.start_date || ''}"`,
      `"${data.end_date || ''}"`,
      data.working_days_count || '',
      data.total_hours || '',
      data.avg_hours || '',
    ].join(','),
  )

  csvData.push('') // Пустая строка

  // 4. Детализация по дням
  csvData.push('Детализация по дням:')
  csvData.push(['Дата', 'Отработано часов', 'Отработано секунд'].join(','))

  // 5. Добавляем данные по дням
  data.stats.forEach((item) => {
    csvData.push(
      [
        `"${item.date}"`,
        (item.total_worked_seconds / 3600).toFixed(2),
        item.total_worked_seconds,
      ].join(','),
    )
  })

  // 6. Собираем весь CSV
  const csvContent = csvData.join('\n')

  // 7. Создаем и скачиваем файл
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToExcel(data, filename = 'report.xlsx') {
  if (!data || !data.stats || !data.stats.length) {
    console.error('No data to export')
    return
  }

  // Преобразуем секунды в часы для лучшей читаемости
  const statsWithHours = data.stats.map((item) => ({
    Date: item.date,
    'Всего отработано (часы)': (item.total_worked_seconds / 3600).toFixed(2),
    'Всего отработано (секунды)': item.total_worked_seconds,
  }))

  // Создаем основной лист с данными
  const worksheet = XLSX.utils.json_to_sheet(statsWithHours)

  // Добавляем сводную информацию в начало листа
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [
      ['Сотрудник', data.userName, '', ''],
      ['Отчет о рабочем времени', '', '', ''],
      ['Период:', data.period, '', ''],
      ['Дата начала:', data.start_date, 'Дата окончания:', data.end_date],
      ['Всего рабочих дней:', data.working_days_count, '', ''],
      ['Всего часов:', data.total_hours, 'Среднее количество часов в день:', data.avg_hours],
      ['', '', '', ''],
      ['Подробные данные', '', '', ''],
    ],
    { origin: 'A1' },
  )

  // Стилизуем заголовки
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, worksheet, 'Отчет о работе')

  // Добавляем второй лист с общей информацией (если нужно)
  const summarySheet = XLSX.utils.aoa_to_sheet([
    ['Сводная информация', ''],
    ['Тип периода', data.period],
    ['Дата начала', data.start_date],
    ['Дата окончания', data.end_date],
    ['Всего рабочих дней', data.working_days_count],
    ['Всего отработанных часов', data.total_hours],
    ['Среднее количество часов в день', data.avg_hours],
  ])
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Сводка')

  // Записываем файл
  XLSX.writeFile(wb, filename)
}

export function exportToPdf(data, filename = 'report.pdf') {
  if (!data || !data.stats || !data.stats.length) {
    console.error('No data to export')
    return
  }

  const doc = new jsPDF({
    orientation: 'portrait', // Изменил на portrait для лучшего отображения
    unit: 'mm',
  })

  // Убедимся, что шрифт загружен и доступен
  doc.setFont('Roboto-Regular', 'normal')

  // Заголовок
  doc.setFontSize(16)
  doc.text('Отчет о рабочем времени', 105, 15, { align: 'center' })

  // Информация о сотруднике и периоде
  doc.setFontSize(12)
  doc.text(`Сотрудник: ${data.userName || 'Не указано'}`, 15, 25)
  doc.text(
    `Период: ${data.period || 'Не указано'} (${data.start_date || ''} - ${data.end_date || ''})`,
    15,
    32,
  )

  // Настройки таблицы
  const startX = 15
  let startY = 45
  const rowHeight = 10
  const colWidths = [30, 40, 40] // Подкорректировал ширину колонок

  // Заголовки таблицы
  const headers = ['Дата', 'Отработано часов', 'Отработано секунд']

  // Рисуем заголовки
  headers.forEach((header, i) => {
    doc.setFillColor(240, 240, 240) // Серый фон для заголовков
    doc.rect(
      startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
      startY,
      colWidths[i],
      rowHeight,
      'F',
    ) // 'F' означает fill
    doc.setTextColor(0, 0, 0)
    doc.text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 2, startY + 7)
  })

  startY += rowHeight

  // Данные таблицы
  data.stats.forEach((item) => {
    const values = [
      item.date,
      (item.total_worked_seconds / 3600).toFixed(2) + ' ч',
      item.total_worked_seconds + ' сек',
    ]

    // Рисуем строку данных
    values.forEach((val, i) => {
      doc.rect(
        startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
        startY,
        colWidths[i],
        rowHeight,
      )
      doc.text(
        String(val),
        startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 2,
        startY + 7,
      )
    })

    startY += rowHeight

    // Проверка на необходимость новой страницы
    if (startY > doc.internal.pageSize.height - 20) {
      doc.addPage()
      startY = 20
    }
  })

  // Сохраняем PDF
  doc.save(filename)
}
