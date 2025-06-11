<template>
  <div class="reset-password-page">
    <div class="logo-wrapper">
      <AppLogo color="black" />
    </div>
    <div class="reset-password-container">
      <h2>Restablecer contraseña</h2>
      <form @submit.prevent="resetPassword">
        <label>
          Nueva contraseña
          <div class="input-icon">
            <span class="material-icons-outlined">lock</span>
            <input
              :type="showNewPassword ? 'text' : 'password'"
              v-model="form.new"
              :class="{ 'input-error': errors.new }"
              autocomplete="new-password"
            />
            <span
              class="material-icons-outlined eye"
              @click="showNewPassword = !showNewPassword"
              :title="showNewPassword ? 'Ocultar' : 'Mostrar'"
            >
              {{ showNewPassword ? 'visibility_off' : 'visibility' }}
            </span>
          </div>
          <small class="info">Debe tener al menos 8 caracteres, una mayúscula y un número.</small>
          <span v-if="errors.new" class="input-error-message">{{ errors.new }}</span>
        </label>
        <label>
          Repetir nueva contraseña
          <div class="input-icon">
            <span class="material-icons-outlined">lock</span>
            <input
              :type="showRepeatPassword ? 'text' : 'password'"
              v-model="form.repeat"
              :class="{ 'input-error': errors.repeat }"
              autocomplete="new-password"
            />
            <span
              class="material-icons-outlined eye"
              @click="showRepeatPassword = !showRepeatPassword"
              :title="showRepeatPassword ? 'Ocultar' : 'Mostrar'"
            >
              {{ showRepeatPassword ? 'visibility_off' : 'visibility' }}
            </span>
          </div>
          <span v-if="errors.repeat" class="input-error-message">{{ errors.repeat }}</span>
        </label>
        <button type="submit">Restablecer</button>
        <p v-if="success" class="success">{{ success }}</p>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api.js'
import AppLogo from '../components/AppLogo.vue'

const route = useRoute()
const router = useRouter()
const token = route.query.token

const showNewPassword = ref(false)
const showRepeatPassword = ref(false)

const form = ref({ new: '', repeat: '' })
const errors = ref({})
const success = ref('')
const error = ref('')

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/

// Función para validar la contraseña
function validate() {
  errors.value = {}
  if (!passwordRegex.test(form.value.new)) {
    errors.value.new = 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.'
  }
  if (form.value.new !== form.value.repeat) {
    errors.value.repeat = 'Las contraseñas no coinciden.'
  }
  return Object.keys(errors.value).length === 0
}

// Función para restablecer la contraseña
async function resetPassword() {
  success.value = ''
  error.value = ''
  if (!validate()) return
  try {
    await api.post('/api/auth/reset-password', {
      token,
      newPassword: form.value.new
    })
    success.value = 'Contraseña restablecida correctamente. Ya puedes iniciar sesión.'
    form.value.new = ''
    form.value.repeat = ''
    setTimeout(() => router.push('/login'), 2000)
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al restablecer la contraseña.'
    form.value.new = ''
    form.value.repeat = ''
  }
}
</script>

<style lang="scss" scoped>

.reset-password-page {
  padding: 20px;
  min-height: 100vh;
  background: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.reset-password-container {
  max-width: 450px;
  margin: 0 auto;
  padding: 2rem 2rem 2.5rem 2rem;
  background: var(--black);
  border-radius: 24px;
  color: var(--white, #fff);
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  margin-bottom: 1rem;
  font-size: 2rem;
  color: var(--green-light);
  text-align: center;
  font-weight: 400;
  margin-bottom: 3rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  color: var(--white, #fff);
  gap: 0.5rem;
}

input {
  display: flex;
  align-items: center;
  margin-top: 0rem;
  padding: 0.75rem 1rem;
  border-radius: 50px;
  border: 1px solid var(--white, #fff);
  background: transparent;
  color: var(--white, #fff);
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}

input:focus {
  border: 1.5px solid var(--green-light);
}

.input-error {
  border-color: var(--green-light);
}

.input-error-message {
  color: var(--green-light);
  font-size: 0.95em;
  margin-top: 0.2em;
}

.input-icon {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-icon .material-icons-outlined {
  position: absolute;
  left: 16px;
  color: var(--green-light);
  font-size: 22px;
  pointer-events: none;
  z-index: 2;
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

button[type="submit"] {
  margin-top: 1rem;
  background: var(--green-light, #4f8cff);
  color: var(--black, #181a1b);
  width: 100%;
  border: 1px solid var(--green-light);
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
button[type="submit"]:hover {
  background: var(--green-dark);
  color: var(--white, #fff);
}

.success {
  color: var(--green-light);
  text-align: center;
  margin-top: 0.5rem;
}

.error {
  color: var(--green-light);
  text-align: center;
  margin-top: 0.5rem;
}

/* Responsive */
@media (max-width: 900px) {
  .reset-password-container h2 {
    font-size: 1.5rem;
    font-weight: 400;
    margin-bottom: 2rem;
  }
}
@media (max-width: 600px) {
  .reset-password-container {
    max-width: 95vw;
    padding: 1.5rem;
  }
  h2 {
    font-size: 1.5rem;
  }
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2.5rem;
  width: 100%;
}

.logo-wrapper img {
  max-width: 180px;
  height: auto;
}

@media (max-width: 600px) {
  .logo-wrapper {
    margin-bottom: 1.5rem;
  }
  .logo-wrapper img {
    max-width: 130px;
  }
}

</style>