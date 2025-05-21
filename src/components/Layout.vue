<!-- Layout.vue -->
<script setup>
import Header from '@/components/Header.vue'
</script>

<template>
  <div class="relative">
    <Header />
    <main>
      <router-view />
    </main>
  </div>
</template>
