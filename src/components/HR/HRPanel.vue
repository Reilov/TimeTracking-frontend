<script setup>
import Button from '../Button.vue'
import BlockMain from '../BlockMain.vue'
import { useRouter } from 'vue-router'
import HREditProfile from './HREditProfile.vue'

const router = useRouter()
</script>

<template>
  <BlockMain title="HR Панель">
    <template #header-actions>
      <Button @click="router.push({ name: 'NewEmployee' })" text-button="Добавить сотрудника" />
    </template>
    <!-- <HREditProfile :employee-id="32" /> -->
    <router-view v-slot="{ Component }">
      <component :is="Component">
        <template #hr>
          <td>
            <Button text-button="Редактировать" class="mx-auto" />
          </td>
        </template>
      </component>
    </router-view>
  </BlockMain>
</template>
