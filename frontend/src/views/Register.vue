<template>
  <div class="auth-container">
    <h2>Registro de {{ roleLabel }}</h2>
    <form @submit.prevent="submitForm" class="auth-form">
      <input
        v-model="form.name"
        type="text"
        placeholder="Nombre"
        required
      />
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
      <button type="submit">Registrarse</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

// 1. Configura la URL base de la API desde .env
axios.defaults.baseURL = import.meta.env.VITE_API_URL

// 2. Obtén el rol desde el query param (?role=company o ?role=dev)
const route = useRoute()
const router = useRouter()
const role = ref(route.query.role === 'company' ? 'company' : 'dev')
const roleLabel = computed(() =>
  role.value === 'company' ? 'Empresa' : 'Developer'
)

// 3. Datos del formulario y manejo de errores
const form = ref({
  name: '',
  email: '',
  password: ''
})
const error = ref('')

// 4. Envío de formulario
const submitForm = async () => {
  error.value = ''
  try {
    await axios.post('/api/auth/register', {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      role: role.value
    })
    // 5. Redirige al login manteniendo el mismo rol
    router.push({
      path: '/login',
      query: { role: role.value }
    })
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'Ha ocurrido un error al registrar. Intenta de nuevo.'
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
