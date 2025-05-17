<template>
  <div class="profile-container">
    <h1>Editar perfil de Empresa</h1>

    <div v-if="loading">Cargando perfil…</div>

    <form v-else @submit.prevent="saveProfile" class="profile-form">
      <label>
        Descripción
        <textarea v-model="form.description" rows="3" required />
      </label>

      <label>
        Ubicación (ciudad)
        <input type="text" v-model="form.location" required />
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

// 1. Token en cabecera
const token = localStorage.getItem('token')
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

const loading = ref(true)
const error = ref('')
const success = ref('')
const router = useRouter()

// 2. Formulario reactivo
const form = ref({
  description: '',
  location: ''
})

// 3. Cargar perfil
async function loadProfile() {
  try {
    const res = await axios.get('/api/company/profile')
    form.value.description = res.data.description
    form.value.location = res.data.location
  } catch {
    error.value = 'No se pudo cargar el perfil. Vuelve a iniciar sesión.'
  } finally {
    loading.value = false
  }
}

// 4. Guardar cambios
async function saveProfile() {
  error.value = ''
  success.value = ''
  try {
    await axios.put('/api/company/profile', {
      description: form.value.description,
      location: form.value.location
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
