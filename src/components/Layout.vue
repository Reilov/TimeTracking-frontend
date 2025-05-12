<!-- Layout.vue -->
<script setup>
import Header from '@/components/Header.vue'
</script>

<template>
  <div class="relative">
    <Header />
    <main class="pt-6">
      <router-view />
    </main>
  </div>
</template>
