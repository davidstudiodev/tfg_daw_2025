<template>
  <div class="profile-container">
    <h1>Editar perfil de Developer</h1>

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

      <button type="submit">Guardar cambios</button>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

// 1. Configurar cabecera con token
const token = localStorage.getItem('token')
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

const router = useRouter()
const loading = ref(true)
const error = ref('')
const success = ref('')

// 2. Formulario reactivo
const form = ref({
  description: '',
  years_experience: 0,
  location: '',
  tech_stack: []
})

// Helper para mostrar/parsear JSON en textarea
const techJson = ref('[]')

// 3. Obtener perfil al montar
async function loadProfile() {
  try {
    const res = await axios.get('/api/dev/profile')
    const data = res.data
    form.value.description = data.description
    form.value.years_experience = data.years_experience
    form.value.location = data.location
    form.value.tech_stack = data.tech_stack
    techJson.value = JSON.stringify(data.tech_stack, null, 2)
  } catch (err) {
    error.value = 'No se pudo cargar el perfil. Por favor, vuelve a iniciar sesión.'
  } finally {
    loading.value = false
  }
}

// 4. Enviar cambios
async function saveProfile() {
  error.value = ''
  success.value = ''
  let parsedTech

  try {
    parsedTech = JSON.parse(techJson.value)
  } catch {
    error.value = 'El JSON de tecnologías no es válido.'
    return
  }

  try {
    await axios.put('/api/dev/profile', {
      description: form.value.description,
      years_experience: form.value.years_experience,
      location: form.value.location,
      tech_stack: parsedTech
    })
    success.value = 'Perfil actualizado correctamente.'
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar el perfil.'
  }
}

onMounted(loadProfile)
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
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
.profile-form textarea {
  padding: 0.5rem;
  font-size: 1rem;
}
.profile-form button {
  width: 150px;
  padding: 0.5rem;
  cursor: pointer;
}
.error {
  color: #c00;
}
.success {
  color: #060;
}
</style>
