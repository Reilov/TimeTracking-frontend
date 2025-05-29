<script setup>
import { defineProps } from 'vue'
import ErrorIcon from '@/components/icons/ErrorIcon.vue'
import SuccessIcon from '@/components/icons/SuccessIcon.vue'

const props = defineProps({
  message: {
    type: String,
    default: '',
  },
  error: {
    type: [Boolean, String],
    default: false,
  },
})
import { computed } from 'vue'
const classes = computed(() => {
  return {
    'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-200': props.error,
    'bg-green-200 text-green-600 dark:bg-green-900 dark:text-green-200': !props.error,
  }
})
</script>

<template>
  <div class="p-3 rounded-lg text-sm flex items-center" :class="classes">
    <ErrorIcon v-if="error" />
    <SuccessIcon v-else />
    {{ message }}
  </div>
</template>
