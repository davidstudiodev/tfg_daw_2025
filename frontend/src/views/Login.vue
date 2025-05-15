<template>
  <div class="auth-container">
    <h2>Login de {{ roleLabel }}</h2>
    <form @submit.prevent="submitForm" class="auth-form">
      <input
        v-model="form.email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        v-model="form.password"
        type="password"
        placeholder="Contraseña"
        required
      />
      <button type="submit">Entrar</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

// 1. Base URL desde .env
axios.defaults.baseURL = import.meta.env.VITE_API_URL

// 2. Leer rol del query ?role=company|dev
const route = useRoute()
const router = useRouter()
const role = ref(route.query.role === 'company' ? 'company' : 'dev')
const roleLabel = computed(() =>
  role.value === 'company' ? 'Empresa' : 'Developer'
)

// 3. Formulario y manejo de errores
const form = ref({ email: '', password: '' })
const error = ref('')

// Función para decodificar el JWT sin librerías
function decodeToken(token) {
  try {
    const base64Payload = token.split('.')[1]
    const jsonPayload = atob(base64Payload)
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

// 4. Envío de formulario
const submitForm = async () => {
  error.value = ''
  try {
    const res = await axios.post('/api/auth/login', {
      email: form.value.email,
      password: form.value.password
    })

    const token = res.data.token
    // 5. Decodifica y valida que el rol coincida
    const decoded = decodeToken(token)
    if (!decoded || decoded.role !== role.value) {
      error.value = `Usuario registrado como "${decoded?.role}", no coincide con la interfaz seleccionada.`
      return
    }

    // 6. Guarda el token y redirige según rol
    localStorage.setItem('token', token)
    const destination =
      role.value === 'company'
        ? '/company/dashboard'
        : '/dev/dashboard'
    router.push(destination)
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'Error al iniciar sesión. Por favor, revisa tus datos.'
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.auth-form input {
  padding: 0.75rem;
  font-size: 1rem;
}
.auth-form button {
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
}
.error {
  color: #c00;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
</style>
