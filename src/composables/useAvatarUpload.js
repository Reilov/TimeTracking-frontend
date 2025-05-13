import { ref } from 'vue'

export function useAvatarUpload() {
  const tempAvatar = ref(null)
  const selectedAvatar = ref(null)
  const fileInput = ref(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) return null

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      return {
        error: true,
        message: 'Файл должен быть изображением (JPEG, PNG или GIF)',
      }
    }

    if (file.size > 2 * 1024 * 1024) {
      return {
        error: true,
        message: 'Размер файла не должен превышать 2MB',
      }
    }

    tempAvatar.value = URL.createObjectURL(file)
    selectedAvatar.value = file
    return { error: false }
  }

  const triggerFileInput = () => {
    fileInput.value.click()
  }

  const resetAvatar = () => {
    tempAvatar.value = null
    selectedAvatar.value = null
  }

  return {
    tempAvatar,
    selectedAvatar,
    fileInput,
    handleFileChange,
    triggerFileInput,
    resetAvatar,
  }
}
