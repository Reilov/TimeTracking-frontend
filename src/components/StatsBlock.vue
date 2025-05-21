<script setup>
import BlockMain from './BlockMain.vue'
import { defineProps } from 'vue'

defineProps({
  title: String,
  value: [Number, String],
  description: String,
})
// export default {
//   props: {
//     title: {
//       type: String,
//       required: true
//     },
//     value: {
//       type: [Number, String],
//       default: 0
//     },
//     description: {
//       type: String,
//       default: ''
//     }
//   }
// }
</script>

<template>
  <BlockMain :showHeader="false">
    <p class="text-sm text-gray-500 dark:text-gray-400">
      {{ title }}
    </p>
    <p class="text-lg font-medium text-gray-800 dark:text-gray-200">
      {{ value || 0 }} ч
      <span v-if="description" class="block text-xs text-gray-400 dark:text-gray-500 font-normal">
        {{ description }}
      </span>
    </p>
  </BlockMain>
</template>
