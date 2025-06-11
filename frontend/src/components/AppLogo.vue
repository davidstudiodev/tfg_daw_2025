<template>
  <div class="logo" @click="goHome" style="cursor:pointer">
    <img :src="logoSrc" alt="Logo" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: 'white' // 'white' o 'black'
  }
})

const logoSrc = computed(() =>
  props.color === 'black' ? '/logo_black.svg' : '/logo_white.svg'
)

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