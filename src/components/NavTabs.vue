<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    validator: (items) => items.every((item) => 'id' in item && 'label' in item),
  },
  activeItem: {
    type: String,
    required: true,
  },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (val) => ['horizontal', 'vertical'].includes(val),
  },
  type: {
    type: String,
    default: 'button',
    validator: (val) => ['button', 'router-link'].includes(val),
  },
})

const emit = defineEmits(['update:activeItem'])
</script>

<template>
  <nav
    class="flex"
    :class="{
      'space-x-4': orientation === 'horizontal',
      'flex-col space-y-2': orientation === 'vertical',
    }"
  >
    <component
      :is="type === 'router-link' ? 'router-link' : 'button'"
      v-for="item in items"
      :key="item.id"
      :to="type === 'router-link' ? item.path : undefined"
      @click="type === 'button' ? emit('update:activeItem', item.id) : undefined"
      class="cursor-pointer px-2 py-1 md:px-3 md:py-2 text-sm font-medium relative transition-all"
      :class="activeItem === item.id ? 'text-orange-500' : 'hover:text-orange-500'"
    >
      {{ item.label }}
      <span v-if="activeItem === item.id" class="absolute inset-x-0 bottom-0 h-0.5 bg-orange-500" />
    </component>
  </nav>
</template>
