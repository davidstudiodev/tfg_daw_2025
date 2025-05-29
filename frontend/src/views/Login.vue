<template>
  <div class="login-page">
    <AppLogo />
    <div class="auth-container">
      <h2>Login</h2>
      <h3>¡Bienvenido/a {{ roleLabel }}!</h3>
  
      <form v-if="!showForgotPassword" @submit.prevent="submitForm" class="auth-form">
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
            type="password"
            placeholder="*********"
            required
          />
        </div>
        <!-- Modal para recuperar contraseña -->
        <a v-if="!showForgotPassword" href="#" @click.prevent="showForgotPassword = true">¿Has olvidado tu contraseña?</a>
        
        <button type="submit" :disabled="loading">
          {{ loading ? 'Validando…' : 'LOGIN' }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>

    
      <div v-if="showForgotPassword" class="forgot-password-modal">
        <form @submit.prevent="sendResetEmail">
          <label>  
            Ingresa tu correo electrónico
            <div class="input-icon">
              <span class="material-icons-outlined">mail</span>
              <input v-model="resetEmail" type="email" required />
            </div>
          </label>
          <button type="submit">RECUPERAR</button>
          <p v-if="resetMessage">{{ resetMessage }}</p>
        </form>
        <button @click="showForgotPassword = false" class="cancel-btn">CANCELAR</button>
      </div>
      
      <!--  -->
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

// Modal para recuperar contraseña
const showForgotPassword = ref(false)
const resetEmail = ref('')
const resetMessage = ref('')

async function sendResetEmail() {
  resetMessage.value = ''
  try {
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resetEmail.value })
    })
    resetMessage.value = 'Si el email existe, se enviará un enlace de recuperación.'
  } catch (e) {
    resetMessage.value = 'No se pudo enviar el correo. Intenta de nuevo.'
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
  color: var(--green-light);
  font-size: 22px;
  pointer-events: none;
}

.input-icon input {
  padding-left: 44px;
  width: 100%;
}

.forgot-password-modal {
  color: var(--white);
  margin-top: 1.5rem;
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  input {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border-radius: 50px;
    border: 1px solid var(--white);
    background: transparent;
    color: var(--white);
    outline: none;
    transition: border 0.2s;
    margin-top: 10px;
  }
  input:focus {
    border: 1px solid var(--green-light);
  }

  button[type="submit"] {
    margin-top: 1rem;
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
      background: var(--green-dark);
      color: var(--green-light);
    }
  }

  
  .cancel-btn {
    width: 100%;
    margin-top: 1rem;
    background: transparent;
    color: var(--green-light);
    border: 1px solid var(--green-light);
    border-radius: 50px;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    &:hover {
      background: var(--green-light);
      color: var(--black);
    }
  }

  p {
    margin-top: 1rem;
    color: var(--green-light);
    text-align: center;
  }
}

.forgot-password-modal .input-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.forgot-password-modal .material-icons-outlined {
  position: absolute;
  left: 16px;
  top: 55%;
  transform: translateY(-50%);
  color: var(--green-light);
  font-size: 22px;
  pointer-events: none;
}

.forgot-password-modal input {
  padding-left: 44px;
  width: 100%;
}

</style>
