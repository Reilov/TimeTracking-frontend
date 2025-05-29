import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import '@/fonts/Roboto-Regular-normal'
import html2pdf from 'html2pdf.js'

// Общие функции форматирования
const formatHours = (seconds) => (seconds / 3600).toFixed(2)
const formatSeconds = (seconds) => seconds.toString()

// Общая структура данных для экспорта
const prepareExportData = (data) => {
  return {
    header: {
      title: 'Отчет о рабочем времени',
      employee: data.userName || 'Не указано',
      period: data.period || 'Не указано',
      dates: `${data.start_date || ''} - ${data.end_date || ''}`,
      summary: {
        days: data.working_days_count || '',
        totalHours: data.total_hours || '',
        avgHours: data.avg_hours || '',
      },
    },
    details: data.stats.map((item) => ({
      date: item.date,
      hours: formatHours(item.total_worked_seconds),
      seconds: formatSeconds(item.total_worked_seconds),
    })),
  }
}

export function exportToCsv(data, filename = 'report.csv') {
  const exportData = prepareExportData(data)
  const csvRows = []

  // Заголовок
  csvRows.push(exportData.header.title)
  csvRows.push('')

  // Основная информация
  csvRows.push('Основная информация:')
  csvRows.push('Сотрудник,Период,Даты,Рабочих дней,Всего часов,Среднее в день')
  csvRows.push(
    [
      `"${exportData.header.employee}"`,
      `"${exportData.header.period}"`,
      `"${exportData.header.dates}"`,
      exportData.header.summary.days,
      exportData.header.summary.totalHours,
      exportData.header.summary.avgHours,
    ].join(','),
  )

  csvRows.push('')

  // Детализация
  csvRows.push('Детализация по дням:')
  csvRows.push('Дата,Часы,Секунды')
  exportData.details.forEach((item) => {
    csvRows.push([`"${item.date}"`, item.hours, item.seconds].join(','))
  })

  // Создание и скачивание файла
  const blob = new Blob(['\uFEFF' + csvRows.join('\n')], {
    type: 'text/csv;charset=utf-8;',
  })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToExcel(data, filename = 'report.xlsx') {
  const exportData = prepareExportData(data)
  const wb = XLSX.utils.book_new()

  // Основной лист с детализацией
  const wsData = [
    [exportData.header.title],
    [],
    ['Основная информация:', '', '', '', '', ''],
    ['Сотрудник:', exportData.header.employee],
    ['Период:', exportData.header.period],
    ['Даты:', exportData.header.dates],
    ['Рабочих дней:', exportData.header.summary.days],
    ['Всего часов:', exportData.header.summary.totalHours],
    ['Среднее в день:', exportData.header.summary.avgHours],
    [],
    ['Детализация по дням:', '', ''],
    ['Дата', 'Часы', 'Секунды'],
    ...exportData.details.map((item) => [item.date, item.hours, item.seconds]),
  ]

  const ws = XLSX.utils.aoa_to_sheet(wsData)
  XLSX.utils.book_append_sheet(wb, ws, 'Отчет')

  // Лист с суммарной информацией
  const summaryWs = XLSX.utils.aoa_to_sheet([
    ['Сводная информация'],
    [],
    ['Сотрудник', exportData.header.employee],
    ['Период', exportData.header.period],
    ['Даты', exportData.header.dates],
    ['Рабочих дней', exportData.header.summary.days],
    ['Всего часов', exportData.header.summary.totalHours],
    ['Среднее в день', exportData.header.summary.avgHours],
  ])
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Сводка')

  XLSX.writeFile(wb, filename)
}

export function exportToPdf(data, filename = 'report.pdf') {
  const exportData = prepareExportData(data)
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm' })

  // Настройки документа
  doc.setFont('Roboto-Regular', 'normal')
  let startY = 15

  // Заголовок
  doc.setFontSize(16)
  doc.text(exportData.header.title, 105, startY, { align: 'center' })
  startY += 10

  // Основная информация
  doc.setFontSize(12)
  doc.text(`Сотрудник: ${exportData.header.employee}`, 15, startY)
  startY += 7
  doc.text(`Период: ${exportData.header.period} (${exportData.header.dates})`, 15, startY)
  startY += 7
  doc.text(`Рабочих дней: ${exportData.header.summary.days}`, 15, startY)
  startY += 7
  doc.text(`Всего часов: ${exportData.header.summary.totalHours}`, 15, startY)
  startY += 7
  doc.text(`Среднее в день: ${exportData.header.summary.avgHours}`, 15, startY)
  startY += 15

  // Таблица с детализацией
  const colWidths = [40, 40, 40]
  const headers = ['Дата', 'Часы', 'Секунды']

  // Заголовки таблицы
  headers.forEach((header, i) => {
    doc.setFillColor(240, 240, 240)
    doc.rect(15 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), startY, colWidths[i], 10, 'F')
    doc.text(header, 17 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), startY + 7)
  })
  startY += 10

  // Данные таблицы
  exportData.details.forEach((item) => {
    const values = [item.date, item.hours + ' ч', item.seconds + ' сек']

    values.forEach((val, i) => {
      doc.rect(15 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), startY, colWidths[i], 10)
      doc.text(val, 17 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), startY + 7)
    })

    startY += 10
    if (startY > 280) {
      doc.addPage()
      startY = 20
    }
  })

  doc.save(filename)
}

export function exportTimesheetToPdf(filename) {
  const original = document.getElementById('report')
  if (!original) return

  const clone = original.cloneNode(true)
  clone.id = 'pdf-clone'

  // Обработка классов
  clone.querySelectorAll('[class]').forEach((el) => {
    const classList = el.className

    // Бордеры
    if (classList.includes('border') || classList.includes('border-b')) {
      if (classList.includes('border-b')) el.style.borderBottom = '1px solid #d1d5db'
      if (classList.includes('border-t')) el.style.borderTop = '1px solid #d1d5db'
      if (classList.includes('border-l')) el.style.borderLeft = '1px solid #d1d5db'
      if (classList.includes('border-r')) el.style.borderRight = '1px solid #d1d5db'
      if (classList.includes('border') && !classList.match(/border-[trbl]/)) {
        el.style.border = '1px solid #d1d5db'
      }
    }

    // Цвета
    if (classList.includes('border-gray-900')) el.style.borderColor = '#111827'
    if (classList.includes('border-gray-300')) el.style.borderColor = '#d1d5db'
    if (classList.includes('text-red-600')) el.style.color = '#dc2626'

    el.removeAttribute('class')
  })

  // Таблицы
  clone.querySelectorAll('table').forEach((table) => {
    table.style.borderCollapse = 'collapse'
    table.style.width = 'auto'
    table.style.tableLayout = 'auto'
  })

  // Ячейки
  clone.querySelectorAll('th, td').forEach((cell) => {
    cell.style.border = '1px solid #d1d5db'
    cell.style.padding = '4px'
    cell.style.fontSize = '10px'
    cell.style.whiteSpace = 'normal'
    cell.style.overflow = 'visible'
    cell.style.textOverflow = 'unset'
    cell.style.textAlign = 'center'
  })

  // Контейнер
  let container = document.getElementById('pdf-temp-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'pdf-temp-container'
    container.style.position = 'fixed'
    container.style.left = '-9999px'
    container.style.top = '0'
    document.body.appendChild(container)
  }

  container.innerHTML = ''
  container.appendChild(clone)

  // Экспорт
  html2pdf()
    .set({
      margin: 10,
      filename: filename,
      html2canvas: {
        scale: 2,
        scrollX: 0,
        scrollY: 0,
        useCORS: true,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'landscape',
      },
    })
    .from(clone)
    .save()
    .then(() => {
      console.log('✅ PDF успешно сохранён')
    })
    .catch((err) => {
      console.error('❌ Ошибка при генерации PDF:', err)
    })
}
