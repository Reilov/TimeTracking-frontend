<script setup>
import Button from '../Button.vue'
import BlockMain from '../BlockMain.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const editEmployee = (id) => {
  router.push({ name: 'HREditProfile', params: { id } })
}
</script>

<template>
  <BlockMain title="HR Панель">
    <template #header-actions>
      <div class="flex gap-2">
        <Button
          @click="router.push({ name: 'HRTurnstile' })"
          variant="secondary"
          text-button="Имитировать турникет"
        />
        <Button @click="router.push({ name: 'NewEmployee' })" text-button="Добавить сотрудника" />
      </div>
    </template>

    <router-view v-slot="{ Component }">
      <component :is="Component">
        <template #hr="{ id }">
          <td>
            <Button @click.stop="editEmployee(id)" text-button="Редактировать" class="mx-auto" />
          </td>
        </template>
      </component>
    </router-view>
  </BlockMain>
</template>
