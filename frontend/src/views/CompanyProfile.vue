<template>
  <div class="profile-container">
    <h1>Perfil de Empresa</h1>

    <!-- Notificaciones -->
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="loading">Cargando perfil…</div>

    <!-- Formulario de edición de perfil -->
    <form v-else-if="isEditingProfile" @submit.prevent="saveProfile" class="profile-form">
      <label>
        Avatar
        <input type="file" accept="image/*" @change="handleAvatarChange" />
      </label>
      <img v-if="form.avatar" :src="form.avatar" alt="Vista previa" class="avatar-preview" />
      <label>Nombre <input v-model="form.name" required /></label>
      <label>Correo <input v-model="form.email" required /></label>
      <label>Ubicación <input v-model="form.location" required /></label>
      <label>Teléfono <input v-model="form.phone" required /></label>
      <label>Descripción <textarea v-model="form.description" rows="3" required /></label>
      <div class="actions">
        <button type="submit" class="save-btn">Guardar</button>
        <button type="button" @click="cancelEditProfile" class="cancel-btn">Cancelar</button>
      </div>
    </form>

    <!-- Formulario de creación de oferta -->
    <form v-else-if="isCreatingJob" @submit.prevent="publishJob" class="job-form">
      <h2>Crear nueva oferta</h2>
      <label>Descripción <textarea v-model="job.description" required /></label>
      <label>Sector <input v-model="job.sector" required /></label>
      <label>Salario <input v-model="job.salary" required /></label>
      <label>
        Tipo de trabajo
        <select v-model="job.work_mode" required>
          <option value="remoto">Remoto</option>
          <option value="hibrido">Híbrido</option>
          <option value="local">Local</option>
        </select>
      </label>
      <label>
        Tipo de jornada
        <select v-model="job.work_time" required>
          <option value="completa">Completa</option>
          <option value="parcial">Parcial</option>
          <option value="practicas">Prácticas</option>
        </select>
      </label>
      <div v-for="section in techOptions" :key="section.category" class="tech-section">
        <h3>{{ section.category }}</h3>
        <div class="tech-buttons">
          <button
            v-for="item in section.items"
            :key="item"
            type="button"
            :class="{ selected: jobSelected.includes(item) }"
            @click="toggleJobTech(item)"
          >
            {{ item }}
          </button>
        </div>
      </div>
      <div class="actions">
        <button type="submit" class="publish-btn">Publicar oferta</button>
        <button type="button" @click="cancelJob" class="cancel-btn">Cancelar</button>
      </div>
    </form>

    <!-- Resumen de perfil -->
    <section v-else class="profile-summary">
      <img v-if="form.avatar" :src="form.avatar" alt="Avatar" class="avatar-preview" />
      <p><strong>Nombre:</strong> {{ form.name }}</p>
      <p><strong>Correo:</strong> {{ form.email }}</p>
      <p><strong>Ubicación:</strong> {{ form.location }}</p>
      <p><strong>Teléfono:</strong> {{ form.phone }}</p>
      <p><strong>Descripción:</strong> {{ form.description }}</p>
      <div class="actions">
        <button @click="startEditingProfile" class="edit-btn">Editar perfil</button>
        <button @click="startCreatingJob" class="create-job-btn">Crear oferta</button>
        <button @click="handleLogout" class="logout-btn">Cerrar sesión</button>
      </div>
    </section>

    <!-- Resumen de ofertas -->
    <section v-if="jobs.length" class="company-jobs">
      <h2>Ofertas publicadas</h2>
      <div v-for="job in jobs" :key="job.id" class="job-card">
        <div v-if="editingJobId !== job.id">
          <p><strong>Descripción:</strong> {{ job.description }}</p>
          <p><strong>Sector:</strong> {{ job.sector }}</p>
          <p><strong>Salario:</strong> {{ job.salary }}</p>
          <p><strong>Tipo de trabajo:</strong> {{ job.work_mode }}</p>
          <p><strong>Jornada:</strong> {{ job.work_time }}</p>
          <p>
            <strong>Tecnologías:</strong>
            <span v-if="job.tech_stack && job.tech_stack.length">
              {{ job.tech_stack.flatMap(sec => sec.items).join(', ') }}
            </span>
            <span v-else>Ninguna</span>
          </p>
          <button @click="startEditJob(job)" class="edit-btn">Editar</button>
          <button @click="removeJob(job.id)" class="logout-btn">Eliminar</button>
        </div>
        <form v-else @submit.prevent="saveEditJob" class="job-form">
          <label>Descripción <textarea v-model="jobEdit.description" required /></label>
          <label>Sector <input v-model="jobEdit.sector" required /></label>
          <label>Salario <input v-model="jobEdit.salary" required /></label>
          <label>
            Tipo de trabajo
            <select v-model="jobEdit.work_mode" required>
              <option value="remoto">Remoto</option>
              <option value="hibrido">Híbrido</option>
              <option value="local">Local</option>
            </select>
          </label>
          <label>
            Tipo de jornada
            <select v-model="jobEdit.work_time" required>
              <option value="completa">Completa</option>
              <option value="parcial">Parcial</option>
              <option value="practicas">Prácticas</option>
            </select>
          </label>
          <div v-for="section in techOptions" :key="section.category" class="tech-section">
            <h3>{{ section.category }}</h3>
            <div class="tech-buttons">
              <button
                v-for="item in section.items"
                :key="item"
                type="button"
                :class="{ selected: jobEditSelected.includes(item) }"
                @click="toggleEditJobTech(item)"
              >
                {{ item }}
              </button>
            </div>
          </div>
          <div class="actions">
            <button type="submit" class="save-btn">Guardar</button>
            <button type="button" @click="cancelEditJob" class="cancel-btn">Cancelar</button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '../services/auth.js'
import { getCompanyProfile, updateCompanyProfile, createJob } from '../services/profile.js'
import { techOptions } from '../constants/techOptions.js'
import { getCompanyJobs, updateJob, deleteJob } from '../services/profile.js'

const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const isEditingProfile = ref(false)
const isCreatingJob = ref(false)

const form = ref({
  name: '',
  email: '',
  avatar: '',
  location: '',
  phone: '',
  description: ''
})

const job = ref({
  description: '',
  sector: '',
  salary: '',
  work_mode: 'remoto',
  work_time: 'completa',
  tech_stack: []
})
const jobSelected = ref([])

const loadProfile = async () => {
  loading.value = true
  try {
    const { data } = await getCompanyProfile()
    form.value = {
      name: data.name || '',
      email: data.email || '',
      avatar: data.avatar || '',
      location: data.location || '',
      phone: data.phone || '',
      description: data.description || ''
    }
  } catch {
    error.value = 'No se pudo cargar el perfil.'
  } finally {
    loading.value = false
  }
}

function handleAvatarChange(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    form.value.avatar = reader.result
  }
  reader.readAsDataURL(file)
}

function startEditingProfile() {
  isEditingProfile.value = true
}
function cancelEditProfile() {
  isEditingProfile.value = false
  loadProfile()
}

async function saveProfile() {
  saving.value = true
  error.value = ''
  try {
    await updateCompanyProfile({ ...form.value })
    alert('Perfil actualizado correctamente.')
    isEditingProfile.value = false
    loadProfile()
  } catch {
    error.value = 'Error al guardar el perfil.'
  } finally {
    saving.value = false
  }
}

function startCreatingJob() {
  isCreatingJob.value = true
  job.value = {
    description: '',
    sector: '',
    salary: '',
    work_mode: 'remoto',
    work_time: 'completa',
    tech_stack: []
  }
  jobSelected.value = []
}
function cancelJob() {
  isCreatingJob.value = false
}

function toggleJobTech(item) {
  const idx = jobSelected.value.indexOf(item)
  if (idx > -1) jobSelected.value.splice(idx, 1)
  else jobSelected.value.push(item)
}

async function publishJob() {
  job.value.tech_stack = techOptions.map(sec => ({
    category: sec.category,
    items: sec.items.filter(i => jobSelected.value.includes(i))
  }))
  try {
    await createJob({ ...job.value })
    alert('Oferta publicada correctamente.')
    isCreatingJob.value = false
    await loadJobs()
  } catch {
    error.value = 'Error al publicar la oferta.'
  }
}

async function handleLogout() {
  await logout()
  router.push({ name: 'login', query: { role: 'company' } })
}

const jobs = ref([])
const editingJobId = ref(null)
const jobEdit = ref({})
const jobEditSelected = ref([])

const loadJobs = async () => {
  try {
    const { data } = await getCompanyJobs()
    jobs.value = data
  } catch {
    error.value = 'No se pudieron cargar las ofertas.'
  }
}

async function removeJob(id) {
  if (confirm('¿Eliminar esta oferta?')) {
    await deleteJob(id)
    await loadJobs()
  }
}

function startEditJob(job) {
  editingJobId.value = job.id
  jobEdit.value = { ...job, tech_stack: job.tech_stack || [] }
  jobEditSelected.value = jobEdit.value.tech_stack.flatMap(sec => sec.items)
}

function cancelEditJob() {
  editingJobId.value = null
  jobEdit.value = {}
  jobEditSelected.value = []
}

function toggleEditJobTech(item) {
  const idx = jobEditSelected.value.indexOf(item)
  if (idx > -1) jobEditSelected.value.splice(idx, 1)
  else jobEditSelected.value.push(item)
}

async function saveEditJob() {
  jobEdit.value.tech_stack = techOptions.map(sec => ({
    category: sec.category,
    items: sec.items.filter(i => jobEditSelected.value.includes(i))
  }))
  await updateJob(editingJobId.value, jobEdit.value)
  editingJobId.value = null
  jobEdit.value = {}
  jobEditSelected.value = []
  await loadJobs()
}

onMounted(() => {
  loadProfile()
  loadJobs()
})
</script>

<style scoped>
.avatar-preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
}
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.profile-summary,
.profile-form,
.job-form {
  margin-bottom: 1rem;
}
.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.edit-btn, .create-job-btn, .logout-btn, .save-btn, .cancel-btn, .publish-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.edit-btn { background: #1976d2; color: #fff; }
.create-job-btn { background: #43a047; color: #fff; }
.logout-btn { background: #f44336; color: #fff; }
.save-btn { background: #1976d2; color: #fff; }
.cancel-btn { background: #aaa; color: #fff; }
.publish-btn { background: #43a047; color: #fff; }
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
  background: #007bff;
  color: #fff;
  border-color: #0056b3;
}
.error { color: #c00; margin: 1rem 0; }
.profile-form input,
.profile-form textarea,
.job-form input,
.job-form textarea,
.job-form select {
  padding: 0.5rem;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
</style>
