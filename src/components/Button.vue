<script setup>
import { defineProps, computed } from 'vue'
import SpinIcon from '@/components/icons/SpinIcon.vue'

const props = defineProps({
  textButton: {
    type: String,
    default: 'Кнопка',
  },
  isLoading: {
    type: Boolean,
  },
  size: {
    type: String,
    default: 'small',
    validator: (value) => ['small', 'big'].includes(value),
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'primaryMinimal'].includes(value),
  },
})

const buttonClasses = computed(() => {
  const sizes = {
    small: 'px-4 py-1',
    big: 'py-3 px-5',
  }
  const variants = {
    primary:
      'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-sm transition-all dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800',
    secondary:
      'bg-gray-100 hover:bg-gray-200 transition-all dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white',
    primaryMinimal:
      'bg-orange-500 text-white hover:bg-orange-600 transition-all dark:bg-orange-600 dark:hover:bg-orange-700',
  }
  return [sizes[props.size], variants[props.variant]]
})
</script>

<template>
  <button
    type="submit"
    class="cursor-pointer font-semibold flex justify-center items-center rounded-lg border border-transparent shadow-sm transition-all duration-200 transition-colors ease-in-out"
    :class="buttonClasses"
    :disabled="isLoading"
  >
    <span v-if="!isLoading">{{ textButton }}</span>
    <SpinIcon v-else />
  </button>
</template>
