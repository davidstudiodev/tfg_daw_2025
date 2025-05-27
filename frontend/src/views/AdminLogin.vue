<template>
  <div class="admin-login">
    <h1>Login Administrador</h1>
    <form @submit.prevent="submit">
      <input v-model="email" type="email" placeholder="Correo admin" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit" :disabled="loading">Entrar</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await api.post('/api/auth/login', { email: email.value, password: password.value })
    // Aquí podrías verificar el rol llamando a /api/auth/me
    const { data } = await api.get('/api/auth/me')
    if (data.role === 'admin') {
      router.push({ name: 'admin-profile' })
    } else {
      error.value = 'No tienes permisos de administrador.'
    }
  } catch (e) {
    error.value = 'Credenciales incorrectas o error de servidor.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
}
.error { color: #c00; margin-top: 1rem; }
</style>