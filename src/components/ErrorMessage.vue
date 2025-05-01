<script setup>
import { defineProps } from 'vue'
import ErrorIcon from '@/components/icons/ErrorIcon.vue'

defineProps({
  error: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
    <ErrorIcon />
    {{ error }}
  </div>
</template>
