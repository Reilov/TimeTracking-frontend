<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    default: null,
  },
})

// const selectedOption = ref(null)
const emit = defineEmits(['update:modelValue'])
const isSelectVisible = ref(false)
const select = ref(null)

const toogleOptionSelected = (option) => {
  // selectedOption.value = option
  emit('update:modelValue', option.id)
  closeSelect(option)
}

const selectedOption = computed(() => {
  return props.options.find((option) => option.id === props.modelValue) || null
})

const mappedOptions = computed(() => {
  return selectedOption.value?.name || 'Выберите ' + props.label.toLowerCase()
})

const closeSelect = (element) => {
  if (!select.value.contains(element.target)) {
    isSelectVisible.value = false
  }
}
onMounted(() => {
  window.addEventListener('click', closeSelect)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', closeSelect)
})
</script>

<template>
  <div class="mb-4">
    <div class="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-200">
      {{ label }}
    </div>
    <div class="relative" ref="select">
      <div
        class="cursor-pointer px-4 py-3 border border-gray-300 rounded-lg transition-all dark:border-gray-600"
        @click="isSelectVisible = !isSelectVisible"
      >
        {{ mappedOptions }}
      </div>
      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          class="bg-white dark:bg-gray-800 absolute z-10 top-14 inset-x-0 border border-gray-300 rounded-lg transition-all dark:border-gray-600 flex flex-col divide-y"
          v-if="isSelectVisible"
        >
          <div
            class="cursor-pointer px-4 py-3 first-of-type:rounded-t-lg last-of-type:rounded-b-lg border-gray-300 transition-all dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
            v-for="option in props.options"
            :key="option.id"
            :value="option.id"
            @click="toogleOptionSelected(option)"
          >
            {{ option.name || option }}
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
