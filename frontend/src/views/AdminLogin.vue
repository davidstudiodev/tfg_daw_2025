<template>
  <div class="login-page">
    <AppLogo />
    <div class="auth-container">
      <h2>Login Administrador</h2>
      <form @submit.prevent="submit" class="auth-form">
        <div class="input-icon">
          <span class="material-icons-outlined">email</span>
          <input v-model="email" type="email" placeholder="Correo admin" required />
        </div>
        <div class="input-icon">
          <span class="material-icons-outlined">lock</span>
          <input v-model="password" type="password" placeholder="Contraseña" required />
        </div>
        <button type="submit" :disabled="loading">Entrar</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

import AppLogo from '../components/AppLogo.vue'


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

<style lang="scss" scoped>
.login-page {
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
  color: #c00;
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
  top: 50%;
  transform: translateY(-50%);
  color: var(--green-light);
  font-size: 22px;
  pointer-events: none;
}

.input-icon input {
  padding-left: 44px;
  width: 100%;
}
</style>