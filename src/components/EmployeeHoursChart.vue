<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { useFormatters } from '@/composables/useFormatters'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  records: {
    type: Array,
    required: true,
    default: () => [],
    validator: (items) => items.every((i) => 'date' in i && 'workedSeconds' in i),
  },
})

const { formatDate, secondsToHours } = useFormatters()

const chartData = computed(() => {
  if (!props.records.length) {
    return {
      labels: [],
      datasets: [
        {
          label: 'Часы работы',
          data: [],
          backgroundColor: 'rgba(200, 200, 200, 0.2)',
        },
      ],
    }
  }

  return {
    labels: props.records.map((r) => formatDate(r.date)),
    datasets: [
      {
        label: 'Часы работы',
        data: props.records.map((r) => secondsToHours(r.workedSeconds)),
        backgroundColor: 'oklch(0.705 0.213 47.604 / 0.8)',
        borderColor: 'oklch(0.646 0.222 41.116)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `${value} ч`,
      },
    },
  },
}
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>
