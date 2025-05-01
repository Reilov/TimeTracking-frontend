<script setup>
import { defineProps } from 'vue'

defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  icon: {
    type: Object,
    default: null,
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="mb-6">
    <label v-if="label" class="block text-gray-700 text-sm font-bold mb-2">{{ label }}</label>
    <div class="relative">
      <input
        v-if="type !== 'textarea'"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
      />

      <textarea
        v-else
        :value="modelValue"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
        rows="3"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
      ></textarea>

      <span v-if="icon" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
        <component :is="icon" class="h-5 w-5" />
      </span>
    </div>
  </div>
</template>
