<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useAvatarUpload } from '@/composables/useAvatarUpload'
import { useFormState } from '@/composables/useFormState'

import AvatarProfile from '@/components/AvatarProfile.vue'
import Button from '@/components/Button.vue'
import TextInput from '@/components/TextInput.vue'
import Message from '@/components/Message.vue'
import SelectInput from '@/components/SelectInput.vue'

const props = defineProps({
  employeeId: {
    type: [String, Number],
    required: true,
  },
})

const { tempAvatar, selectedAvatar, fileInput, handleFileChange, triggerFileInput } =
  useAvatarUpload()
const { isError, message, isLoading, setError, setSuccess, resetState } = useFormState()

const formData = reactive({
  name: '',
  email: '',
  birth_date: '',
  phone: '',
  department_id: null,
  position_id: null,
  about: '',
})

const originalData = ref({})
const departmentOptions = ref([])
const positionOptions = ref([])

const loadEmployeeData = async () => {
  try {
    isLoading.value = true
    const [employeeRes, departmentsRes, positionsRes] = await Promise.all([
      axios.get(`/api/users/${props.employeeId}`),
      axios.get('/api/departments'),
      axios.get('/api/positions'),
    ])

    // Преобразуем данные для совместимости с SelectInput
    const userData = employeeRes.data.user
    userData.department_id = userData.department_id ? Number(userData.department_id) : null
    userData.position_id = userData.position_id ? Number(userData.position_id) : null

    Object.assign(formData, userData)
    originalData.value = JSON.parse(JSON.stringify(userData))

    departmentOptions.value = departmentsRes.data.departments
    positionOptions.value = positionsRes.data.positions
  } catch (error) {
    setError('Не удалось загрузить данные сотрудника')
    console.error('Ошибка загрузки данных:', error)
  } finally {
    isLoading.value = false
  }
}

// Handle avatar upload
const handleAvatarUpload = async (event) => {
  try {
    const result = handleFileChange(event)
    if (result?.error) {
      setError(result.message)
      if (fileInput.value) fileInput.value.value = ''
    }
  } catch (error) {
    setError('Ошибка при обработке изображения')
    console.error('Avatar upload error:', error)
  }
}

const saveChanges = async () => {
  try {
    isLoading.value = true
    resetState()

    const formDataToSend = new FormData()
    const changes = {}

    const fields = ['name', 'email', 'birth_date', 'phone', 'about', 'department_id', 'position_id']

    // Собираем только измененные поля
    fields.forEach((field) => {
      if (JSON.stringify(formData[field]) !== JSON.stringify(originalData.value[field])) {
        changes[field] = formData[field]
      }
    })

    if (Object.keys(changes).length === 0 && !selectedAvatar.value) {
      setSuccess('Нет изменений для сохранения')
      return
    }

    // Добавляем аватар если есть
    if (selectedAvatar.value) {
      formDataToSend.append('avatar', selectedAvatar.value)
    }

    // Добавляем измененные данные если есть
    if (Object.keys(changes).length > 0) {
      formDataToSend.append('employeeData', JSON.stringify(changes))
    }

    const response = await axios.post(`/api/update-profile/${props.employeeId}`, formDataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (response.data.status === 'success') {
      setSuccess('Данные сотрудника успешно обновлены')

      if (response.data.profile) {
        // Приводим типы для select-полей
        const profileData = response.data.profile
        console.log(profileData)

        Object.assign(originalData.value, profileData)
        Object.assign(formData, profileData)
      }

      if (response.data.profile?.avatar) {
        tempAvatar.value = null
        selectedAvatar.value = null
      }
    } else {
      setError(response.data.message || 'Ошибка при обновлении данных')
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.response?.data?.error || 'Ошибка при обновлении данных'
    setError(errorMessage)
    console.error('Save changes error:', error)
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  Object.assign(formData, originalData.value)
  tempAvatar.value = null
  selectedAvatar.value = null
  resetState()
}

onMounted(() => {
  loadEmployeeData()
})
</script>

<template>
  <Button textButton="Вернуться назад" variant="primary" size="big" @click="resetForm" />
  <div class="flex flex-col space-y-4 mb-8">
    <div class="relative group rounded-full self-center" @click="triggerFileInput">
      <AvatarProfile
        size="big"
        class="transition-opacity group-hover:opacity-80"
        :avatarText="formData.name[0]"
        :avatar="tempAvatar || formData.avatar"
      />
      <div
        class="rounded-full cursor-pointer absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Button textButton="Изменить" variant="primaryMinimal" size="small" />
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg, image/png, image/gif"
        class="hidden"
        @change="handleAvatarUpload"
      />
    </div>

    <TextInput v-model="formData.name" label="ФИО" type="text" placeholder="Введите ФИО" required />

    <TextInput
      v-model="formData.email"
      label="Email"
      type="email"
      placeholder="Введите email"
      required
    />

    <SelectInput
      v-model="formData.department_id"
      label="Отдел"
      :options="departmentOptions"
      required
    />

    <SelectInput
      v-model="formData.position_id"
      label="Должность"
      :options="positionOptions"
      required
    />

    <TextInput v-model="formData.birth_date" label="Дата рождения" type="date" />

    <TextInput v-model="formData.phone" label="Телефон" type="tel" placeholder="Введите телефон" />

    <TextInput
      v-model="formData.about"
      label="Обо мне"
      type="textarea"
      placeholder="Дополнительная информация"
    />

    <Message v-if="message" :message="message" :error="isError" />

    <div class="flex space-x-3 self-end">
      <Button textButton="Отменить изменения" variant="secondary" size="big" @click="resetForm" />
      <Button
        textButton="Сохранить"
        variant="primary"
        :isLoading="isLoading"
        size="big"
        @click="saveChanges"
      />
    </div>
  </div>
</template>
