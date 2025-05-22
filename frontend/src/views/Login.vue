<template>
  <div class="login-page">
    <AppLogo />
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
        <button type="submit" :disabled="loading">
          {{ loading ? 'Validando…' : 'Entrar' }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
  
      <p>
        No tienes cuenta?
        <router-link :to="{ name: 'register', query: { role } }">
          Registrarse
        </router-link>
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppLogo from '../components/AppLogo.vue'

// 1) Importamos los servicios en lugar de axios directamente
import { login, getMe } from '../services/auth.js'

const route = useRoute()
const router = useRouter()

// 2) Obtenemos el role del query
const role = ref(route.query.role === 'company' ? 'company' : 'dev')
const roleLabel = computed(() =>
  role.value === 'company' ? 'Empresa' : 'Developer'
)

// 3) Estado del formulario y notificaciones
const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

const submitForm = async () => {
  loading.value = true
  error.value = ''

  try {
    // 4) Hacemos login; el backend envía la cookie HttpOnly automáticamente
    await login({ email: form.value.email, password: form.value.password })

    // 5) Consultamos /api/auth/me para obtener { id, email, role }
    const { data: user } = await getMe()

    // 6) Redirigimos según el role que venga del servidor
    const destination =
      user.role === 'company'
        ? { name: 'company-profile' }
        : { name: 'dev-profile' }
    router.push(destination)

  } catch (err) {
    // 7) Mensaje de error según status
    const status = err.response?.status
    error.value =
      status === 400
        ? 'Credenciales incorrectas.'
        : 'Error al iniciar sesión. Intenta más tarde.'
  } finally {
    loading.value = false
    // 8) Limpiamos el formulario
    form.value.email = ''
    form.value.password = ''
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
