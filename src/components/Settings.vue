<script setup>
import { useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import Header from './Header.vue'
const router = useRouter()

const goBack = () => {
  router.go(-1) // Или router.push('/dashboard')
}
</script>

<template>
  <!-- <Header /> -->
  Настройки
  <Button @click="goBack" textButton="Назад" />
</template>
