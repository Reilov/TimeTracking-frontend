<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useAvatarUpload } from '@/composables/useAvatarUpload'
import { useFormState } from '@/composables/useFormState'

// Components
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

// Composables
const { tempAvatar, selectedAvatar, fileInput, handleFileChange, triggerFileInput } =
  useAvatarUpload()
const { isError, message, isLoading, setError, setSuccess, resetState } = useFormState()

// Employee data
const formData = reactive({
  name: '',
  email: '',
  birth_date: '',
  phone: '',
  department_id: null,
  position_id: null,
  about: '',
})

const departmentOptions = ref([])
const positionOptions = ref([])
// Load employee data
const loadEmployeeData = async () => {
  try {
    isLoading.value = true
    const [employeeRes, departmentsRes, positionsRes] = await Promise.all([
      axios.get(`/api/users/${props.employeeId}`),
      axios.get('/api/departments'),
      axios.get('/api/positions'),
    ])

    Object.assign(formData, employeeRes.data.user)

    departmentOptions.value = departmentsRes.data.departments
    positionOptions.value = positionsRes.data.positions
  } catch (error) {
    setError('Не удалось загрузить данные сотрудника')
  } finally {
    isLoading.value = false
  }
}

// Handle avatar upload
const handleAvatarUpload = async (event) => {
  const result = handleFileChange(event)
  if (result?.error) {
    setError(result.message)
    if (fileInput.value) fileInput.value.value = ''
  }
}

// Save changes
const saveChanges = async () => {
  try {
    isLoading.value = true
    resetState()

    const formDataToSend = new FormData()

    if (selectedAvatar.value) {
      formDataToSend.append('avatar', selectedAvatar.value)
    }

    formDataToSend.append('employeeData', JSON.stringify(formData))

    const response = await axios.post(`'/api/update-profile/${props.employeeId}`, formDataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    setSuccess('Данные сотрудника успешно обновлены')

    // Update local data
    if (response.data.employee) {
      Object.assign(formData, response.data.employee)
    }
  } catch (error) {
    setError(error.response?.data?.message || 'Ошибка при обновлении данных')
  } finally {
    isLoading.value = false
  }
}

// Reset form to initial state
const resetForm = () => {
  loadEmployeeData()
  resetState()
}

onMounted(() => {
  loadEmployeeData()
})
</script>

<template>
  <div class="flex flex-col space-y-4 mb-8">
    <!-- Avatar Upload -->
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

    <!-- Basic Info -->
    <TextInput v-model="formData.name" label="ФИО" type="text" placeholder="Введите ФИО" required />

    <TextInput
      v-model="formData.email"
      label="Email"
      type="email"
      placeholder="Введите email"
      required
    />

    <!-- HR Specific Fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>

    <!-- Additional Info -->
    <TextInput v-model="formData.phone" label="Телефон" type="tel" placeholder="Введите телефон" />

    <TextInput
      v-model="formData.about"
      label="Обо мне"
      type="textarea"
      placeholder="Дополнительная информация"
    />

    <!-- Messages -->
    <Message v-if="message" :message="message" :error="isError" />

    <!-- Actions -->
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
