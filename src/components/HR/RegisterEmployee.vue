<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useAvatarUpload } from '@/composables/useAvatarUpload'
import { useFormState } from '@/composables/useFormState'

import AvatarProfile from '@/components/AvatarProfile.vue'
import Button from '@/components/Button.vue'
import TextInput from '@/components/TextInput.vue'
import Message from '@/components/Message.vue'
import SelectInput from '@/components/SelectInput.vue'

// Composables
const { tempAvatar, selectedAvatar, fileInput, handleFileChange, triggerFileInput, resetAvatar } =
  useAvatarUpload()
const { isError, message, isLoading, setError, setSuccess, resetState } = useFormState()

const formData = reactive({
  name: '',
  email: '',
  password: '',
  birth_date: '',
  phone: '',
  department: null,
  position: null,
  about: '',
})

const showPassword = ref(false)
const departmentOptions = ref([])
const positionsOptions = ref([])

const fieldsConfig = computed(() => [
  { key: 'name', label: 'ФИО', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  {
    key: 'password',
    label: 'Пароль',
    type: showPassword.value ? 'text' : 'password',
  },
  { key: 'birth_date', label: 'Дату рождения', type: 'date' },
  { key: 'phone', label: 'Телефон', type: 'tel' },
  {
    key: 'department',
    label: 'Отдел',
    type: 'select',
    options: departmentOptions.value,
  },
  {
    key: 'position',
    label: 'Должность',
    type: 'select',
    options: positionsOptions.value,
  },
  { key: 'about', label: 'Обо мне', type: 'textarea' },
])

const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  formData.password = password
}

const copyPassword = async () => {
  try {
    await navigator.clipboard.writeText(formData.password)
    setSuccess('Пароль скопирован в буфер обмена')
  } catch (error) {
    setError('Не удалось скопировать пароль')
  }
}

onMounted(async () => {
  try {
    const [departmentsRes, positionsRes] = await Promise.all([
      axios.get('/api/departments'),
      axios.get('/api/positions'),
    ])
    departmentOptions.value = departmentsRes.data.departments
    positionsOptions.value = positionsRes.data.positions
  } catch (error) {
    setError('Не удалось загрузить данные отделов и должностей')
  }
})

const handleAvatarUpload = async (event) => {
  const result = handleFileChange(event)
  if (result?.error) {
    setError(result.message)
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const registerEmployee = async () => {
  try {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.department ||
      !formData.birth_date ||
      !formData.position
    ) {
      setError('Пожалуйста, заполните все обязательные поля')
      return
    }

    isLoading.value = true
    resetState()

    const formDataToSend = new FormData()

    if (selectedAvatar.value) {
      formDataToSend.append('avatar', selectedAvatar.value)
    }

    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key])
    })

    const response = await axios.post('/api/register', formDataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (response.status === 200) {
      setSuccess('Сотрудник успешно зарегистрирован')
      setTimeout(() => {
        resetForm()
      }, 3000)
    }
  } catch (error) {
    setError(error.response?.data?.message || 'Произошла ошибка при регистрации')
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    if (key === 'department' || key === 'position') {
      formData[key] = null
    } else {
      formData[key] = ''
    }
  })
  resetAvatar()
  resetState()
}
</script>

<template>
  <div class="flex flex-col space-y-4 mb-8">
    <div class="relative group rounded-full self-center" @click="triggerFileInput">
      <AvatarProfile
        size="big"
        class="transition-opacity group-hover:opacity-80"
        :avatarText="formData.name[0]"
        :avatar="tempAvatar"
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

    <template v-for="field in fieldsConfig" :key="field.key">
      <div class="relative" v-if="field.key === 'password'">
        <TextInput
          v-model="formData[field.key]"
          :label="field.label"
          :type="field.type"
          :placeholder="field.label"
        />
        <div class="absolute right-2 top-9 flex space-x-1">
          <Button
            textButton="Сгенерировать"
            variant="secondary"
            size="small"
            @click="generatePassword"
          />
          <Button
            textButton="Показать"
            variant="secondary"
            size="small"
            @click="showPassword = !showPassword"
          />
          <Button
            textButton="Скопировать"
            variant="secondary"
            size="small"
            @click="copyPassword"
            :disabled="!formData.password"
          />
        </div>
      </div>

      <TextInput
        v-else-if="field.type !== 'select'"
        v-model="formData[field.key]"
        :label="field.label"
        :type="field.type"
        :placeholder="field.label"
      />

      <SelectInput
        v-else
        v-model="formData[field.key]"
        :label="field.label"
        :options="field.options"
      />
    </template>

    <Message v-if="message" :message="message" :error="isError" />

    <div class="flex space-x-3 self-end">
      <Button
        textButton="Сохранить"
        variant="primary"
        :isLoading="isLoading"
        :disabled="isLoading"
        size="big"
        @click="registerEmployee"
      />
    </div>
  </div>
</template>
