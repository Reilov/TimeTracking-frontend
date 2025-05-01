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
    validator: (value) => ['primary', 'secondary'].includes(value),
  },
})

const buttonClasses = computed(() => {
  const sizes = {
    small: 'px-4 py-1',
    big: 'py-3 px-4',
  }
  const variants = {
    primary:
      'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-sm focus:ring-orange-500',
    secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
  }
  return [sizes[props.size], variants[props.variant]]
})
</script>

<template>
  <button
    type="submit"
    class="cursor-pointer flex justify-center items-center border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transition-colors ease-in-out"
    :class="buttonClasses"
    :disabled="isLoading"
  >
    <span v-if="!isLoading">{{ textButton }}</span>
    <SpinIcon v-else />
  </button>
</template>
