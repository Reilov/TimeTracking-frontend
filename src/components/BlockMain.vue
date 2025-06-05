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
    class="bg-white rounded-2xl shadow-lg p-4 md:p-6 dark:bg-gray-800 dark:text-white transition-colors duration-300 mt-6"
  >
    <div v-if="showHeader" class="flex justify-between items-start mb-4 flex-wrap">
      <h1 v-if="title" class="text-2xl font-bold">{{ title }}</h1>
      <slot name="header-actions"></slot>
    </div>
    <slot></slot>
  </div>
</template>
