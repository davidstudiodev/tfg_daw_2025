<template>
  <div class="logo" @click="goHome" style="cursor:pointer">
    <img src="/logo_white.svg" alt="Logo" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goHome() {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.logo {
  font-weight: bold;
  font-size: 1.5rem;
}
</style>