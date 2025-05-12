<script setup>
import { defineProps } from 'vue'

defineProps({
  title: {
    type: String,
    default: null,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-lg p-6 dark:bg-gray-800 dark:text-white transition-colors duration-300"
  >
    <div v-if="showHeader" class="flex justify-between items-center mb-4">
      <h1 v-if="title" class="text-2xl font-bold">{{ title }}</h1>
      <slot name="header-actions"></slot>
    </div>
    <slot></slot>
  </div>
</template>
