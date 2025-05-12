<script setup>
import AvatarProfile from '@/components/AvatarProfile.vue'
import Button from '@/components/Button.vue'
import TextInput from '@/components/TextInput.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import SelectInput from '@/components/SelectInput.vue'
import { ref, computed, reactive, onMounted } from 'vue'
import axios from 'axios'

const errorMessage = ref('')
const isLoading = ref(false)
const hasChanges = ref(false)
const showPassword = ref(false)

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

const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  formData.password = password
  hasChanges.value = true
}

const copyPassword = async () => {
  await navigator.clipboard.writeText(formData.password)
}

const fieldsConfig = computed(() => [
  { key: 'name', label: 'ФИО', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  {
    key: 'password',
    label: 'Пароль',
    type: showPassword.value ? 'text' : 'password',
  },
  { key: 'birth_date', label: 'Дата рождения', type: 'date' },
  { key: 'phone', label: 'Телефон', type: 'tel' },
  { key: 'department', label: 'Отдел', type: 'select' },
  { key: 'position', label: 'Должность', type: 'select' },
  { key: 'about', label: 'Обо мне', type: 'textarea' },
])

const departmentOptions = ref([])
const positionsOptions = ref([])

onMounted(async () => {
  const responseDepartments = await axios.get('/api/departments')
  departmentOptions.value = responseDepartments.data.departments
  const responsePositions = await axios.get('/api/positions')
  positionsOptions.value = responsePositions.data.positions
})
</script>

<template>
  <div class="flex flex-col space-y-4 mb-8">
    <div class="relative group rounded-full self-center">
      <AvatarProfile size="big" class="transition-opacity group-hover:opacity-80" />
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
        @change="handleFileChange"
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
        :options="field.key === 'department' ? departmentOptions : positionsOptions"
      />
    </template>

    <ErrorMessage v-if="errorMessage" :error="errorMessage" />
    <div class="flex space-x-3 self-end">
      <Button
        textButton="Сохранить"
        variant="primary"
        :isLoading="isLoading"
        :disabled="!hasChanges || isLoading"
        size="big"
      />
    </div>
  </div>
</template>
