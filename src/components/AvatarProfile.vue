<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  avatar: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'small',
    validator: (value) => ['small', 'big'].includes(value),
  },
  avatarText: {
    type: String,
    default: '',
  },
})

const sizeClasses = computed(() => {
  const sizes = {
    small: 'w-12 h-12 md:w-15 md:h-15 text-sm',
    big: 'w-40 h-40 text-2xl ',
  }
  return sizes[props.size]
})
</script>

<template>
  <div
    v-if="!avatar"
    class="rounded-full object-cover text-center flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold"
    :class="sizeClasses"
  >
    {{ avatarText }}
  </div>
  <img v-else :src="avatar" class="rounded-full object-cover" :class="sizeClasses" />
</template>
