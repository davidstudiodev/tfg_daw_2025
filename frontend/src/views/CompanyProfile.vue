<template>
  <div class="profile-container">
    <h1>Editar perfil de Empresa</h1>

    <!-- Notificaciones -->
    <p v-if="success" class="success">{{ success }}</p>
    <p v-if="error"   class="error">{{ error }}</p>

    <!-- Estado de carga -->
    <div v-if="loading">Cargando perfil…</div>

    <!-- Formulario -->
    <form v-else @submit.prevent="saveProfile" class="profile-form">
      <label>
        Descripción
        <textarea v-model="form.description" rows="3" required />
      </label>

      <label>
        Ubicación (ciudad)
        <input type="text" v-model="form.location" required />
      </label>

      <button type="submit" :disabled="saving">
        {{ saving ? 'Guardando…' : 'Guardar cambios' }}
      </button>
    </form>
  </div>
</template>

<script setup>
// 1) Importar los refs y el router
import { ref, onMounted } from 'vue'
import { useRouter }    from 'vue-router'

// 2) Importar los servicios de perfil de empresa
import {
  getCompanyProfile,
  updateCompanyProfile
} from '../services/profile.js'

const router  = useRouter()
const loading = ref(true)
const saving  = ref(false)
const error   = ref('')
const success = ref('')

// 3) Estado del formulario
const form = ref({
  description: '',
  location:    ''
})

// 4) Función para limpiar mensajes automáticamente
const clearMessages = () => {
  setTimeout(() => {
    error.value   = ''
    success.value = ''
  }, 5000)
}

// 5) Cargar el perfil al montar
async function loadProfile() {
  loading.value = true
  error.value   = ''
  try {
    const { data } = await getCompanyProfile()
    form.value.description = data.description
    form.value.location    = data.location
  } catch {
    error.value = 'No se pudo cargar el perfil. Inicia sesión de nuevo.'
    clearMessages()
    // Opcional: redirigir al login
    router.push({ name: 'login', query: { role: 'company' } })
  } finally {
    loading.value = false
  }
}

// 6) Guardar cambios en el perfil
async function saveProfile() {
  error.value   = ''
  success.value = ''
  saving.value  = true

  try {
    await updateCompanyProfile({
      description: form.value.description,
      location:    form.value.location
    })
    success.value = 'Perfil actualizado correctamente.'
    clearMessages()
  } catch {
    error.value = 'Error al guardar el perfil. Intenta más tarde.'
    clearMessages()
  } finally {
    saving.value = false
  }
}

onMounted(loadProfile)
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.profile-form label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}
.profile-form input,
.profile-form textarea,
.profile-form button {
  padding: 0.5rem;
  font-size: 1rem;
}
.profile-form button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: #c00;
  margin-bottom: 1rem;
}
.success {
  color: #060;
  margin-bottom: 1rem;
}
</style>
