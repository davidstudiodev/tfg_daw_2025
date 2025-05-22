<template>
  <div class="logo" @click="goHome" style="cursor:pointer">
    jobsxdevs
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