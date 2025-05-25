<template>
  <div class="reset-password-container">
    <h2>Restablecer contraseña</h2>
    <form @submit.prevent="resetPassword">
      <label>
        Nueva contraseña
        <input type="password" v-model="form.new" :class="{ 'input-error': errors.new }" />
        <span v-if="errors.new" class="input-error-message">{{ errors.new }}</span>
      </label>
      <label>
        Repetir nueva contraseña
        <input type="password" v-model="form.repeat" :class="{ 'input-error': errors.repeat }" />
        <span v-if="errors.repeat" class="input-error-message">{{ errors.repeat }}</span>
      </label>
      <button type="submit">Restablecer</button>
      <p v-if="success" class="success">{{ success }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api.js'

const route = useRoute()
const router = useRouter()
const token = route.query.token

const form = ref({ new: '', repeat: '' })
const errors = ref({})
const success = ref('')
const error = ref('')

function validate() {
  errors.value = {}
  if (!form.value.new || form.value.new.length < 6) errors.value.new = 'La contraseña debe tener al menos 6 caracteres.'
  if (form.value.new !== form.value.repeat) errors.value.repeat = 'Las contraseñas no coinciden.'
  return Object.keys(errors.value).length === 0
}

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
    setTimeout(() => router.push('/login'), 2000)
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al restablecer la contraseña.'
  }
}
</script>