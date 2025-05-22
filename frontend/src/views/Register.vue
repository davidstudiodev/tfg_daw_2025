<template>
  <div class="register-page">
    <AppLogo />

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
        <button type="submit" :disabled="loading">
          {{ loading ? 'Registrando…' : 'Registrarse' }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
      <p>
        Ya tienes cuenta?
        <router-link :to="{ name: 'login', query: { role } }">
          Iniciar sesión
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
// 1) Quitar: import axios y configuración de baseURL
// import axios from 'axios'
// axios.defaults.baseURL = import.meta.env.VITE_API_URL

// 2) Importar solo lo que necesitamos de los servicios
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { register as registerUser } from '../services/auth.js'  // << importa tu service

import AppLogo from '../components/AppLogo.vue'

const route = useRoute()
const router = useRouter()

// 3) Leer rol del query param
const role = ref(route.query.role === 'company' ? 'company' : 'dev')
const roleLabel = computed(() =>
  role.value === 'company' ? 'Empresa' : 'Developer'
)

// 4) Estado del formulario, loading y error
const form = ref({ name: '', email: '', password: '' })
const loading = ref(false)
const error = ref('')

const submitForm = async () => {
  loading.value = true
  error.value = ''

  try {
    // 5) Llamada al service en lugar de axios directamente
    await registerUser({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      role: role.value
    })

    // 6) Redirigir tras registro correcto
    router.push({ name: 'login', query: { role: role.value } })

  } catch (err) {
    // 7) Mostrar mensaje de error real
    error.value =
      err.response?.data?.message ||
      'Ha ocurrido un error al registrar. Intenta de nuevo.'
  } finally {
    // 8) Reset de estado y formulario
    loading.value = false
    form.value = { name: '', email: '', password: '' }
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
.auth-form button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: #c00;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
</style>
