<script setur>
import { defineProps, onMounted } from 'vue'

const props = defineProps({
  userProfile: {
    type: Object,
    required: true,
  },
})

onMounted(() => console.log('userProfile', props.userProfile))
</script>

<template>
  <div
    class="max-w-2xl w-full bg-white rounded-xl shadow-md overflow-hidden p-6 dark:bg-gray-800 dark:text-white transition-colors duration-300 absolute top-0 left-0 right-0 bottom-0 m-auto"
  >
    <h2 class="text-2xl font-bold mb-6">Настройки профиля</h2>

    <!-- <div class="flex flex-col space-y-4 mb-8">
      <div class="relative group rounded-full self-center" @click="triggerFileInput">
        <AvatarProfile
          :avatar="tempAvatar || userProfile.user.avatar"
          :avatar-text="authStore.user?.name[0]"
          size="big"
          class="transition-opacity group-hover:opacity-80"
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
          @change="handleFileChange"
        />
      </div>
      <TextInput
        v-for="field in fieldsConfig"
        :key="field.key"
        :label="field.label"
        v-model="userProfile[field.key]"
        :type="field.type"
        :placeholder="'Введите ' + field.label.toLowerCase()"
        class="w-full"
      />

      <ErrorMessage v-if="errorMessage" :error="errorMessage" />
      <div class="flex space-x-3 self-end">
        <Button
          textButton="Отмена"
          variant="secondary"
          size="big"
          @click="cancelChanges"
          :class="hasChanges ? 'block' : 'hidden'"
        />
        <Button
          textButton="Сохранить"
          variant="primary"
          :isLoading="isLoading"
          :disabled="!hasChanges || isLoading"
          size="big"
          @click="saveChanges"
        />
      </div>
    </div> -->
  </div>
</template>
