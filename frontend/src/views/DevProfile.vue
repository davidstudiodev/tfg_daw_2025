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

      <!-- Selección de tecnologías -->
      <div v-for="section in techOptions" :key="section.category" class="tech-section">
        <h3>{{ section.category }}</h3>
        <div class="tech-buttons">
          <button
            v-for="item in section.items"
            :key="item"
            type="button"
            :class="{ selected: selected.includes(item) }"
            @click="toggleTech(item)"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <button type="submit" :disabled="saving">
        {{ saving ? 'Guardando…' : 'Guardar cambios' }}
      </button>
      <button @click="handleLogout" type="button" class="logout-btn">
        Cerrar sesión
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter }    from 'vue-router'
import { logout } from '../services/auth.js'

// 1) Importar servicios de perfil y constantes de tecnologías
import {
  getDevProfile,
  updateDevProfile
} from '../services/profile.js'
import { techOptions } from '../constants/techOptions.js'

const router = useRouter()
const loading = ref(true)
const saving  = ref(false)
const error   = ref('')
const success = ref('')

// 2) Estado del formulario y selección de tecnologías
const form = ref({
  description:      '',
  years_experience: 0,
  location:         '',
  tech_stack:       []
})
const selected = ref([])

// 3) Cargar perfil al montar
async function loadProfile() {
  loading.value = true
  error.value   = ''
  try {
    const { data } = await getDevProfile()
    form.value = {
      description:      data.description,
      years_experience: data.years_experience,
      location:         data.location,
      tech_stack:       data.tech_stack
    }
    // Inicializar selección
    selected.value = Array.isArray(data.tech_stack)
      ? data.tech_stack.flatMap(section => section.items)
      : []
  } catch {
    error.value = 'No se pudo cargar el perfil. Inicia sesión de nuevo.'
  } finally {
    loading.value = false
  }
}

// 4) Función para alternar selección
function toggleTech(item) {
  if (selected.value.includes(item)) {
    selected.value = selected.value.filter(i => i !== item)
  } else {
    selected.value.push(item)
  }
}

// 5) Guardar cambios
async function saveProfile() {
  error.value   = ''
  success.value = ''

  // Reconstruir tech_stack por secciones
  const tech_stack = techOptions.map(section => ({
    category: section.category,
    items: section.items.filter(item => selected.value.includes(item))
  }))

  saving.value = true
  try {
    await updateDevProfile({
      description:      form.value.description,
      years_experience: form.value.years_experience,
      location:         form.value.location,
      tech_stack       
    : tech_stack
    })
    success.value = 'Perfil actualizado correctamente.'
  } catch {
    error.value = 'Error al guardar el perfil. Intenta más tarde.'
  } finally {
    saving.value = false
    loadProfile()
  }
}

// 6) Logout
async function handleLogout() {
  try {
    await logout()
    router.push({ name: 'login', query: { role: 'dev' } })
  } catch {
    // opcional: manejar error
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
.tech-section {
  margin-bottom: 1rem;
}
.tech-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tech-buttons button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: none;
  cursor: pointer;
}
.tech-buttons button.selected {
  background-color: #007bff;
  color: white;
  border-color: #0056b3;
}
.logout-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 0.5rem;
}
.logout-btn:hover {
  background: #d32f2f;
}
</style>
