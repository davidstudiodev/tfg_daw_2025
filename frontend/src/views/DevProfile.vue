<template>
  <div class="profile-container">
    <h1>Editar perfil de Developer</h1>

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
        Años de experiencia
        <input type="number" v-model.number="form.years_experience" min="0" required />
      </label>

      <label>
        Ubicación (ciudad)
        <input type="text" v-model="form.location" required />
      </label>

      <label>
        Tecnologías (JSON)
        <textarea
          v-model="techJson"
          rows="4"
          placeholder='e.g. [{"category":"frontend","items":["Vue","React"]}]'
          required
        />
      </label>

      <button type="submit" :disabled="saving">
        {{ saving ? 'Guardando…' : 'Guardar cambios' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter }    from 'vue-router'

// 1) Importar los servicios de perfil
import {
  getDevProfile,
  updateDevProfile
} from '../services/profile.js'

const router = useRouter()
const loading = ref(true)
const saving  = ref(false)
const error   = ref('')
const success = ref('')

// 2) Estado del formulario
const form = ref({
  description:     '',
  years_experience: 0,
  location:         '',
  tech_stack:      []
})
const techJson = ref('[]')

// 3) Cargar perfil al montar
async function loadProfile() {
  loading.value = true
  error.value   = ''
  try {
    const { data } = await getDevProfile()
    // Rellenar el form con la respuesta
    form.value     = {
      description:      data.description,
      years_experience: data.years_experience,
      location:         data.location,
      tech_stack:       data.tech_stack
    }
    techJson.value = JSON.stringify(data.tech_stack, null, 2)
  } catch {
    error.value = 'No se pudo cargar el perfil. Inicia sesión de nuevo.'
  } finally {
    loading.value = false
  }
}

// 4) Guardar cambios
async function saveProfile() {
  error.value   = ''
  success.value = ''
  let parsed
  try {
    parsed = JSON.parse(techJson.value)
  } catch {
    error.value = 'El JSON de tecnologías no es válido.'
    return
  }

  saving.value = true
  try {
    await updateDevProfile({
      description:      form.value.description,
      years_experience: form.value.years_experience,
      location:         form.value.location,
      tech_stack:       parsed
    })
    success.value = 'Perfil actualizado correctamente.'
  } catch {
    error.value = 'Error al guardar el perfil. Intenta más tarde.'
  } finally {
    saving.value = false
    // Opcional: refrescar datos
    loadProfile()
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
