<script setup>
import Button from '../Button.vue'
import BlockMain from '../BlockMain.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <BlockMain title="HR Панель">
    <template #header-actions>
      <Button @click="router.push({ name: 'NewEmployee' })" text-button="Добавить сотрудника" />
    </template>

    <router-view></router-view>
  </BlockMain>
</template>
