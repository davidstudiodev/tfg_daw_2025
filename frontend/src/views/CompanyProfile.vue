<template>
  <div class="profile-container">
    <h1>Perfil de Empresa</h1>

    <!-- Notificaciones -->
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="loading">Cargando perfil…</div>

    <!-- Formulario de edición de perfil -->
    <form v-if="isEditingProfile" @submit.prevent="saveProfile" class="profile-form">
      <label>
        Avatar
        <input type="file" accept="image/*" @change="handleAvatarChange" />
      </label>
      <img v-if="form.avatar" :src="form.avatar" alt="Vista previa" class="avatar-preview" />
      <label>Nombre
        <input v-model="form.name" :class="{ 'input-error': fieldErrors.name }" required />
        <span v-if="fieldErrors.name" class="input-error-message">{{ fieldErrors.name }}</span>
      </label>
      <label>Correo
        <input v-model="form.email" :class="{ 'input-error': fieldErrors.email }" required />
        <span v-if="fieldErrors.email" class="input-error-message">{{ fieldErrors.email }}</span>
      </label>
      <label>Ubicación
        <input v-model="form.location" :class="{ 'input-error': fieldErrors.location }" required />
        <span v-if="fieldErrors.location" class="input-error-message">{{ fieldErrors.location }}</span>
      </label>
      <label>Teléfono
        <input v-model="form.phone" :class="{ 'input-error': fieldErrors.phone }" required />
        <span v-if="fieldErrors.phone" class="input-error-message">{{ fieldErrors.phone }}</span>
      </label>
      <label>Descripción
        <textarea v-model="form.description" rows="3" :class="{ 'input-error': fieldErrors.description }" required />
        <span v-if="fieldErrors.description" class="input-error-message">{{ fieldErrors.description }}</span>
      </label>
      <div class="actions">
        <button type="submit" class="save-btn">Guardar</button>
        <button type="button" @click="cancelEditProfile" class="cancel-btn">Cancelar</button>
      </div>
    </form>

    <!-- Formulario de creación de oferta -->
    <form v-else-if="isCreatingJob" @submit.prevent="publishJob" class="job-form">
      <h2>Crear nueva oferta</h2>
      <label>
        Puesto
        <textarea v-model="job.puesto" :class="{ 'input-error': fieldErrors.puesto }" maxlength="20" required />
        <span v-if="fieldErrors.puesto" class="input-error-message">{{ fieldErrors.puesto }}</span>
      </label>
      <label>
        Sector
        <input v-model="job.sector" :class="{ 'input-error': fieldErrors.sector }" required />
        <span v-if="fieldErrors.sector" class="input-error-message">{{ fieldErrors.sector }}</span>
      </label>
      <label>
        Salario
        <input v-model="job.salary" :class="{ 'input-error': fieldErrors.salary }" required />
        <span v-if="fieldErrors.salary" class="input-error-message">{{ fieldErrors.salary }}</span>
      </label>
      <label>
        Tipo de trabajo
        <select v-model="job.work_mode" :class="{ 'input-error': fieldErrors.work_mode }" required>
          <option value="remoto">Remoto</option>
          <option value="hibrido">Híbrido</option>
          <option value="local">Local</option>
        </select>
        <span v-if="fieldErrors.work_mode" class="input-error-message">{{ fieldErrors.work_mode }}</span>
      </label>
      <label>
        Tipo de jornada
        <select v-model="job.work_time" :class="{ 'input-error': fieldErrors.work_time }" required>
          <option value="completa">Completa</option>
          <option value="parcial">Parcial</option>
          <option value="practicas">Prácticas</option>
        </select>
        <span v-if="fieldErrors.work_time" class="input-error-message">{{ fieldErrors.work_time }}</span>
      </label>
      <div v-for="section in techOptions" :key="section.category" class="tech-section">
        <h3>{{ section.category }}</h3>
        <div class="tech-buttons">
          <button
            v-for="item in section.items"
            :key="item"
            type="button"
            :class="{ selected: jobSelected.includes(item), 'input-error': fieldErrors.tech_stack }"
            @click="toggleJobTech(item)"
          >
            {{ item }}
          </button>
        </div>
        <span v-if="fieldErrors.tech_stack" class="input-error-message">{{ fieldErrors.tech_stack }}</span>
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
          <p><strong>Puesto:</strong> {{ job.puesto }}</p>
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
          <label>Puesto
            <textarea v-model="jobEdit.puesto" :class="{ 'input-error': fieldErrors.puesto }" maxlength="20" required /></label>
            <span v-if="fieldErrors.puesto" class="input-error-message">{{ fieldErrors.puesto }}</span>
          <label>Sector <input v-model="jobEdit.sector" :class="{ 'input-error': fieldErrors.sector }" required /></label>
            <span v-if="fieldErrors.sector" class="input-error-message">{{ fieldErrors.sector }}</span>
          <label>Salario <input v-model="jobEdit.salary" :class="{ 'input-error': fieldErrors.salary }" required /></label>
            <span v-if="fieldErrors.salary" class="input-error-message">{{ fieldErrors.salary }}</span>
          <label>
            Tipo de trabajo
            <select v-model="jobEdit.work_mode" :class="{ 'input-error': fieldErrors.work_mode }" required>
              <option value="remoto">Remoto</option>
              <option value="hibrido">Híbrido</option>
              <option value="local">Local</option>
            </select>
            <span v-if="fieldErrors.work_mode" class="input-error-message">{{ fieldErrors.work_mode }}</span>
          </label>
          <label>
            Tipo de jornada
            <select v-model="jobEdit.work_time" :class="{ 'input-error': fieldErrors.work_time }" required>
              <option value="completa">Completa</option>
              <option value="parcial">Parcial</option>
              <option value="practicas">Prácticas</option>
            </select>
            <span v-if="fieldErrors.work_time" class="input-error-message">{{ fieldErrors.work_time }}</span>
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

    <!-- Aplicaciones a tus ofertas -->
    <section v-if="applications.length" class="applications-section">
      <h2>Desarrolladores que han aplicado a tus ofertas</h2>
      <div class="applications-grid">
        <div v-for="app in applications" :key="app.application_id" class="application-card">
          <p><strong>Oferta:</strong> {{ app.puesto }}</p>
          <p><strong>Dev:</strong> {{ app.dev_name }} ({{ app.dev_email }})</p>
          <p><strong>Aplicó el:</strong> {{ new Date(app.applied_at).toLocaleDateString() }}</p>
        </div>
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
import api from '../services/api.js';

const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const success = ref('')
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
  puesto: '',
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

const fieldErrors = ref({});
function validateCompanyProfile() {
  fieldErrors.value = {};
  if (!form.value.name || form.value.name.trim().length === 0) {
    fieldErrors.value.name = 'El nombre es obligatorio.';
  }
  if (!form.value.email || !/^\S+@\S+\.\S+$/.test(form.value.email)) {
    fieldErrors.value.email = 'El email no es válido.';
  }
  if (!form.value.location || form.value.location.trim().length === 0) {
    fieldErrors.value.location = 'La ubicación es obligatoria.';
  }
  if (!form.value.phone || !/^\d{7,}$/.test(form.value.phone)) {
    fieldErrors.value.phone = 'El teléfono debe tener solo números y al menos 7 dígitos.';
  }
  if (!form.value.description || form.value.description.trim().length < 10) {
    fieldErrors.value.description = 'La descripción debe tener al menos 10 caracteres.';
  }
  return Object.keys(fieldErrors.value).length === 0;
}

async function saveProfile() {
  error.value = '';
  success.value = '';
  if (!validateCompanyProfile()) {
    error.value = 'Corrige los campos marcados.';
    return;
  }
  fieldErrors.value = {};
  saving.value = true;
  try {
    await updateCompanyProfile({ ...form.value });
    success.value = 'Perfil actualizado correctamente.';
    isEditingProfile.value = false;
    await loadProfile();
  } catch (e) {
    if (e.response && e.response.data && e.response.data.errors) {
      e.response.data.errors.forEach(err => {
        fieldErrors.value[err.param] = err.msg;
      });
      error.value = 'Corrige los campos marcados.';
    } else {
      error.value = 'Error al guardar el perfil.';
    }
  } finally {
    saving.value = false;
  }
}

function startCreatingJob() {
  isCreatingJob.value = true
  job.value = {
    puesto: '',
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

function validateJob() {
  fieldErrors.value = {};
  // Puesto: requerido, máximo 20 caracteres
  if (!job.value.puesto || job.value.puesto.trim().length === 0) {
    fieldErrors.value.puesto = 'El puesto es obligatorio.';
  } else if (job.value.puesto.length > 20) {
    fieldErrors.value.puesto = 'El puesto debe tener máximo 20 caracteres.';
  }
  if (!job.value.sector || job.value.sector.trim().length === 0) {
    fieldErrors.value.sector = 'El sector es obligatorio.';
  }
  if (!job.value.salary || isNaN(job.value.salary)) {
    fieldErrors.value.salary = 'El salario debe ser un número.';
  }
  if (!['remoto', 'hibrido', 'local'].includes(job.value.work_mode)) {
    fieldErrors.value.work_mode = 'Selecciona un tipo de trabajo válido.';
  }
  if (!['completa', 'parcial', 'practicas'].includes(job.value.work_time)) {
    fieldErrors.value.work_time = 'Selecciona una jornada válida.';
  }
  if (!Array.isArray(job.value.tech_stack) || job.value.tech_stack.flatMap(sec => sec.items).length === 0) {
    fieldErrors.value.tech_stack = 'Selecciona al menos una tecnología.';
  }
  return Object.keys(fieldErrors.value).length === 0;
}

async function publishJob() {
  error.value = '';
  success.value = '';
  job.value.tech_stack = techOptions.map(sec => ({
    category: sec.category,
    items: sec.items.filter(i => jobSelected.value.includes(i))
  }));
  if (!validateJob()) {
    error.value = 'Corrige los campos marcados.';
    return;
  }
  fieldErrors.value = {};
  try {
    await createJob({ ...job.value });
    alert('Oferta publicada correctamente.');
    success.value = 'Oferta publicada correctamente.';
    isCreatingJob.value = false;
    await loadJobs();
  } catch (e) {
    if (e.response && e.response.data && e.response.data.errors) {
      e.response.data.errors.forEach(err => {
        fieldErrors.value[err.param] = err.msg;
      });
      error.value = 'Corrige los campos marcados.';
    } else {
      error.value = 'Error al publicar la oferta.';
    }
  }
}

async function handleLogout() {
  await logout()
  router.push({ name: 'login', query: { role: 'company' } })
}

// Cuando se reciben datos de la API, mapear description a puesto si es necesario (retrocompatibilidad)
const jobs = ref([])
const loadJobs = async () => {
  try {
    const { data } = await getCompanyJobs()
    jobs.value = data.map(j => ({ ...j, puesto: j.puesto || j.description }))
  } catch {
    error.value = 'No se pudieron cargar las ofertas.'
  }
}

const editingJobId = ref(null)
const jobEdit = ref({})
const jobEditSelected = ref([])

function removeJob(id) {
  if (confirm('¿Eliminar esta oferta?')) {
    deleteJob(id)
    .then(() => {
      loadJobs()
    })
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

function validateEditJob() {
  fieldErrors.value = {};
  // Puesto: requerido, máximo 20 caracteres
  if (!jobEdit.value.puesto || jobEdit.value.puesto.trim().length === 0) {
    fieldErrors.value.puesto = 'El puesto es obligatorio.';
  } else if (jobEdit.value.puesto.length > 20) {
    fieldErrors.value.puesto = 'El puesto debe tener máximo 20 caracteres.';
  }
  if (!jobEdit.value.sector || jobEdit.value.sector.trim().length === 0) {
    fieldErrors.value.sector = 'El sector es obligatorio.';
  }
  if (!jobEdit.value.salary || isNaN(jobEdit.value.salary)) {
    fieldErrors.value.salary = 'El salario debe ser un número.';
  }
  if (!['remoto', 'hibrido', 'local'].includes(jobEdit.value.work_mode)) {
    fieldErrors.value.work_mode = 'Selecciona un tipo de trabajo válido.';
  }
  if (!['completa', 'parcial', 'practicas'].includes(jobEdit.value.work_time)) {
    fieldErrors.value.work_time = 'Selecciona una jornada válida.';
  }
  if (!Array.isArray(jobEdit.value.tech_stack) || jobEdit.value.tech_stack.flatMap(sec => sec.items).length === 0) {
    fieldErrors.value.tech_stack = 'Selecciona al menos una tecnología.';
  }
  return Object.keys(fieldErrors.value).length === 0;
}

async function saveEditJob() {
  jobEdit.value.tech_stack = techOptions.map(sec => ({
    category: sec.category,
    items: sec.items.filter(i => jobEditSelected.value.includes(i))
  }))
  if (!validateEditJob()) {
    error.value = 'Corrige los campos marcados.';
    return;
  }
  await updateJob(editingJobId.value, jobEdit.value)
  editingJobId.value = null
  jobEdit.value = {}
  jobEditSelected.value = []
  await loadJobs()
}

const applications = ref([]);
const loadingApplications = ref(false);

// Cuando se reciben aplicaciones, mapear description a puesto si es necesario (retrocompatibilidad)
async function loadApplications() {
  loadingApplications.value = true;
  try {
    const { data } = await api.get('/api/company/applications');
    applications.value = data.map(app => ({ ...app, puesto: app.puesto || app.description }));
  } catch {
    applications.value = [];
  } finally {
    loadingApplications.value = false;
  }
}

onMounted(() => {
  loadProfile();
  loadJobs();
  loadApplications();
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
.applications-section {
  margin-top: 2rem;
}
.applications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}
.application-card {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}
.input-error {
  border: 1.5px solid #c00 !important;
  background: #fff0f0;
}
.input-error-message {
  color: #c00;
  font-size: 0.9em;
  margin-left: 0.5em;
}
</style>
