<template>
  <div class="register-page">
    <AppLogo />

    <div class="auth-container">
      <h2>Register</h2>
      <h3>¡Bienvenido/a {{ roleLabel }}!</h3>

      <!-- Formulario de registro -->
      <form @submit.prevent="submitForm" class="auth-form">
        
        Nombre
        <div class="input-icon">
          <span class="material-icons-outlined">email</span>
          <input
            v-model="form.name"
            type="text"
            placeholder="Nombre"
            required
          />
        </div>
        
        Correo electrónico
        <div class="input-icon">
          <span class="material-icons-outlined">email</span>
          <input
            v-model="form.email"
            type="email"
            placeholder="example@example.com"
            required
          />
        </div>
        Contraseña
        <div class="input-icon">
          <span class="material-icons-outlined">lock</span>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="*********"
            required
            @blur="passwordError = ''"
            @keydown.esc="passwordError = ''"
            :class="{ 'input-error': passwordError }"
          />
          <span
            class="material-icons-outlined eye"
            @click="showPassword = !showPassword"
            :title="showPassword ? 'Ocultar' : 'Mostrar'"
          >
            {{ showPassword ? 'visibility_off' : 'visibility' }}
          </span>
        </div>
        <small class="info">Debe tener al menos 8 caracteres, una mayúscula y un número.</small>

        <p v-if="passwordError" class="error">{{ passwordError }}</p>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Registrando…' : 'Registrarse' }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>

      <!-- Enlace para iniciar sesión -->
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

import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { register as registerUser } from '../services/auth.js'

import AppLogo from '../components/AppLogo.vue'

import { useToast } from "vue-toastification";
const toast = useToast();

const route = useRoute()
const router = useRouter()

const role = ref(route.query.role === 'company' ? 'company' : 'dev')
const roleLabel = computed(() =>
  role.value === 'company' ? 'Empresa' : 'Developer'
)

const form = ref({ name: '', email: '', password: '' })
const loading = ref(false)
const error = ref('')
const passwordError = ref('')
const showPassword = ref(false)

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/

function validatePassword() {
  if (!passwordRegex.test(form.value.password)) {
    passwordError.value = 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.'
    return false
  }
  passwordError.value = ''
  return true
}

const submitForm = async () => {
  loading.value = true
  error.value = ''

   if (!validatePassword()) {
    loading.value = false
    return
  }

  try {
    // Llamada al service en lugar de axios directamente
    await registerUser({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      role: role.value
    })

    toast.info('¡Te has registrado! Ahora puedes iniciar sesión.')

    // Redirigir tras registro correcto
    router.push({ name: 'login', query: { role: role.value } })

  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'Ha ocurrido un error al registrar. Intenta de nuevo.'
  } finally {
    loading.value = false
    form.value = { name: '', email: '', password: '' }
  }
}
</script>

<style lang="scss" scoped>

.register-page {
  padding: 20px;
  height: 100vh;
}

.auth-container {
  max-width: 450px;
  margin: 0rem auto 0 auto;
  padding: 2rem 2rem 2.5rem 2rem;
  background: var(--black);
  border-radius: 24px;
  color: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  h2 {
    margin-bottom: 1rem;
    font-size: 50px;
    font-weight: 400;
  }
  h3 {
    color: var(--green-light);
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 4rem;
    margin-top: 0px;
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}
.auth-form input {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 50px;
  border: 1px solid var(--white);
  background: transparent;
  color: var(--white);
  outline: none;
  transition: border 0.2s;
}

.auth-form input:focus {
  border: 1.5px solid var(--green-light);
}
.auth-form button {
  margin-top: 40px;
  background: var(--green-light);
  color: var(--black);
  width: 100%;
  border: 1px solid var(--green-light);
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    border: 1px solid var(--green-light);
    background: var(--green-dark);
    color: var(--white);
  }
}
.auth-form button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: var(--green-light);
  margin-top: 0.5rem;
  font-size: 0.9rem;
}


.input-icon {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.input-icon .material-icons-outlined {
  position: absolute;
  left: 16px;
  color: var(--green-light);
  font-size: 22px;
  pointer-events: none;
}

.input-icon .eye {
  right: 16px;
  left: auto;
  cursor: pointer;
  color: var(--green-light);
  z-index: 2;
  position: absolute;
  font-size: 22px;
  pointer-events: auto;
  user-select: none;
}

.input-icon input {
  padding-left: 44px;
  padding-right: 44px;
  width: 100%;
  box-sizing: border-box;
}

.auth-form input.input-error {
  border: 1.5px solid #c00;
  background: #fff6f6;
}
.info {
  color: #666;
  font-size: 0.9rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  display: block;
}
</style>
