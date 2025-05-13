import { ref } from 'vue'

export function useFormState() {
  const isError = ref(false)
  const message = ref('')
  const isLoading = ref(false)
  const hasChanges = ref(false)

  const setError = (errorMessage) => {
    isError.value = true
    message.value = errorMessage
  }

  const setSuccess = (successMessage) => {
    isError.value = false
    message.value = successMessage
  }

  const resetState = () => {
    isError.value = false
    message.value = ''
    isLoading.value = false
    hasChanges.value = false
  }

  return {
    isError,
    message,
    isLoading,
    hasChanges,
    setError,
    setSuccess,
    resetState,
  }
}
