<script setup>
import Timer from '@/components/Timer.vue'
import BlockMain from '@/components/BlockMain.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <BlockMain>
    <Timer :user-id="authStore.user.id" />
  </BlockMain>
</template>
