<template>
  <div class="profile-container">
    <AppLogo @click="$router.push('/')" style="cursor:pointer; position:absolute; top:24px; left:24px; z-index:1100;" />
    <button type="button" @click="handleLogout" class="logout-btn">
      <span class="material-icons-outlined">logout</span>
      Cerrar sesión
    </button>

    <!-- Notificaciones -->
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="loading">Cargando perfil…</div>

    <!-- Resumen de perfil -->
    <section v-else class="profile-summary">
      <div class="profile-info">
        <div class="profile-resume">
          <div class="profile-avatar">
            <img
              v-if="form.avatar"
              :src="form.avatar"
              alt="Avatar"
              class="avatar-preview"
            />
          </div>
          <div class="profile-data">
            <h2>{{ form.name }}</h2>
            <p><span class="material-icons-outlined">email</span> {{ form.email }}</p>
            <p><span class="material-icons-outlined">call</span> {{ form.phone }}</p>
            <p><span class="material-icons-outlined">location_on</span> {{ form.location }}</p>
          </div>
        </div>
        <div class="profile-details">
          <p><span class="material-icons-outlined">business</span><strong>Descripción:</strong> {{ form.description }}</p>
        </div>
      </div>

      <hr class="profile-actions-separator" />

      <div class="actions">
        <button @click="startEditingProfile" class="edit-btn">
          <span class="material-icons-outlined">edit</span>
          Editar perfil
        </button>
        <button type="button" @click="showPasswordModal = true" class="edit-btn">
          <span class="material-icons-outlined">lock_reset</span>
          Cambiar contraseña
        </button>
        <button @click="startCreatingJob" class="create-job-btn">
          <span class="material-icons-outlined">add_circle</span>
          Crear oferta
        </button>
      </div>
    </section>

    <!-- Formulario de edición de perfil -->
    <form v-if="isEditingProfile" @submit.prevent="saveProfile" class="profile-form">
      <label>
        Avatar
        <input type="file" accept="image/*" @change="handleAvatarChange" />
      </label>
      <img v-if="form.avatar" :src="form.avatar" alt="Vista previa" class="avatar-preview" />

      <div class="form-row">
        <label>Nombre
          <input v-model="form.name" :class="{ 'input-error': fieldErrors.name }" required />
          <span v-if="fieldErrors.name" class="input-error-message">{{ fieldErrors.name }}</span>
        </label>
        <label>Correo
          <input v-model="form.email" :class="{ 'input-error': fieldErrors.email }" required />
          <span v-if="fieldErrors.email" class="input-error-message">{{ fieldErrors.email }}</span>
        </label>
      </div>

      <div class="form-row">
        <label>Ubicación
          <input v-model="form.location" :class="{ 'input-error': fieldErrors.location }" required />
          <span v-if="fieldErrors.location" class="input-error-message">{{ fieldErrors.location }}</span>
        </label>
        <label>Teléfono
          <input v-model="form.phone" :class="{ 'input-error': fieldErrors.phone }" required />
          <span v-if="fieldErrors.phone" class="input-error-message">{{ fieldErrors.phone }}</span>
        </label>
      </div>

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
      <div class="form-row">
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
      </div>
      <div class="form-row">
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
      </div>
      <div class="form-row">
        <label>
          Tipo de jornada
          <select v-model="job.work_time" :class="{ 'input-error': fieldErrors.work_time }" required>
            <option value="completa">Completa</option>
            <option value="parcial">Parcial</option>
            <option value="practicas">Prácticas</option>
          </select>
          <span v-if="fieldErrors.work_time" class="input-error-message">{{ fieldErrors.work_time }}</span>
        </label>
      </div>

      <h3>Selecciona tecnologías requeridas</h3>
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
      </div>
      <span v-if="fieldErrors.tech_stack" class="input-error-message">{{ fieldErrors.tech_stack }}</span>

      <div class="actions">
        <button type="submit" class="publish-btn">Publicar oferta</button>
        <button type="button" @click="cancelJob" class="cancel-btn">Cancelar</button>
      </div>
    </form>

    <!-- Formulario de edición de oferta -->
    <form v-else-if="editingJobId" @submit.prevent="saveEditJob" class="job-form">
      <h2>Editar oferta</h2>
      <label>
        Puesto
        <textarea v-model="jobEdit.puesto" :class="{ 'input-error': fieldErrors.puesto }" maxlength="20" required />
        <span v-if="fieldErrors.puesto" class="input-error-message">{{ fieldErrors.puesto }}</span>
      </label>
      <label>
        Sector
        <input v-model="jobEdit.sector" :class="{ 'input-error': fieldErrors.sector }" required />
        <span v-if="fieldErrors.sector" class="input-error-message">{{ fieldErrors.sector }}</span>
      </label>
      <label>
        Salario
        <input v-model="jobEdit.salary" :class="{ 'input-error': fieldErrors.salary }" required />
        <span v-if="fieldErrors.salary" class="input-error-message">{{ fieldErrors.salary }}</span>
      </label>
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

    <!-- Resumen de ofertas -->
    <section v-if="jobs.length" class="company-jobs-section desktop-only">
        <h2>Ofertas publicadas</h2>
        <div class="company-jobs-table-wrapper">
          <table class="company-jobs-table">
            <thead>
              <tr>
                <th>Puesto</th>
                <th>Sector</th>
                <th>Salario</th>
                <th>Tipo de trabajo</th>
                <th>Jornada</th>
                <th>Tecnologías</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="job in jobs" :key="job.id">
                <td>{{ job.puesto }}</td>
                <td>{{ job.sector }}</td>
                <td>{{ job.salary }}</td>
                <td>{{ job.work_mode }}</td>
                <td>{{ job.work_time }}</td>
                <td>
                  <span v-if="job.tech_stack && job.tech_stack.length">
                    {{ job.tech_stack.flatMap(sec => sec.items).join(', ') }}
                  </span>
                  <span v-else>Ninguna</span>
                </td>
                <td>
                  <div class="table-actions">
                    <button @click="startEditJob(job)" class="edit-btn">Editar</button>
                    <button @click="removeJob(job.id)" class="delete-btn">Eliminar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        
      </section>
      
    <!-- Aplicaciones a tus ofertas -->
    <section v-if="applications.length" class="applications-section desktop-only">
      <h2>Desarrolladores que han aplicado a tus ofertas</h2>
      <div class="applications-table-wrapper">
        <table class="applications-table">
          <thead>
            <tr>
              <th>Oferta</th>
              <th>Dev</th>
              <th>Email</th>
              <th>Aplicó el</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="app in applications" :key="app.application_id">
              <td>{{ app.puesto }}</td>
              <td>{{ app.dev_name }}</td>
              <td>{{ app.dev_email }}</td>
              <td>{{ new Date(app.applied_at).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Modal para cambiar contraseña -->
    <div v-if="showPasswordModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Cambiar contraseña</h3>
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label>Contraseña actual</label>
            <div class="input-icon">
              <span class="material-icons-outlined">lock</span>
              <input
                type="password"
                v-model="passwordForm.current"
                :class="{ 'input-error': passwordErrors.current }"
                placeholder="Contraseña actual"
              />
            </div>
            <span v-if="passwordErrors.current" class="input-error-message">{{ passwordErrors.current }}</span>
          </div>
          <div class="form-group">
            <label>Nueva contraseña</label>
            <div class="input-icon">
              <span class="material-icons-outlined">lock_reset</span>
              <input
                type="password"
                v-model="passwordForm.new"
                :class="{ 'input-error': passwordErrors.new }"
                @input="validatePasswordForm"
                placeholder="Nueva contraseña"
              />
            </div>
            <span v-if="passwordErrors.new" class="input-error-message">
              {{ passwordErrors.new || 'Debe tener al menos 8 caracteres, una mayúscula y un número.' }}
            </span>
          </div>
          <div class="form-group">
            <label>Repetir nueva contraseña</label>
            <div class="input-icon">
              <span class="material-icons-outlined">lock</span>
              <input
                type="password"
                v-model="passwordForm.repeat"
                :class="{ 'input-error': passwordErrors.repeat }"
                @input="validatePasswordForm"
                placeholder="Repetir nueva contraseña"
              />
            </div>
            <span v-if="passwordErrors.repeat" class="input-error-message">{{ passwordErrors.repeat }}</span>
          </div>
          <div class="actions">
            <button type="submit" class="save-btn">Guardar</button>
            <button type="button" @click="showPasswordModal = false" class="cancel-btn">Cancelar</button>
          </div>
          <p v-if="passwordChangeSuccess" class="success">{{ passwordChangeSuccess }}</p>
          <p v-if="passwordChangeError" class="error">{{ passwordChangeError }}</p>
        </form>
      </div>
    </div>

    <!-- Cards de ofertas publicadas (solo responsive) -->
    <div class="offers-grid mobile-only">
      <h2 class="section-title">Ofertas publicadas</h2>
      <div v-for="job in jobs" :key="job.id" class="offer-card">
        <div class="company-info">
          <img v-if="form.avatar" :src="form.avatar" class="company-logo" alt="logo" />
          <span class="company-name">{{ form.name }}</span>
        </div>
        <h1 class="offer-title">{{ job.puesto }}</h1>
        <div class="offer-details">
          <div class="detail-row">
            <span class="material-icons-outlined">business</span>
            <span>{{ job.sector }}</span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">attach_money</span>
            <span>{{ job.salary }}</span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">schedule</span>
            <span>{{ job.work_time }}</span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">location_on</span>
            <span>{{ form.location }}</span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">code</span>
            <span>
              {{ job.tech_stack && job.tech_stack.length ? job.tech_stack.flatMap(sec => sec.items).join(', ') : 'Ninguna' }}
            </span>
          </div>
        </div>
        <div class="card-actions">
          <button @click="startEditJob(job)" class="edit-btn">Editar</button>
          <button @click="removeJob(job.id)" class="delete-btn">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Cards de aplicaciones (solo responsive) -->
    <div class="offers-grid mobile-only">
      <h2 class="section-title">Desarrolladores que han aplicado a tus ofertas</h2>
      <div v-for="app in applications" :key="app.application_id" class="offer-card">
        <div class="company-info">
          <span class="company-name">{{ app.dev_name }}</span>
        </div>
        <h1 class="offer-title">{{ app.puesto }}</h1>
        <div class="offer-details">
          <div class="detail-row">
            <span class="material-icons-outlined">email</span>
            <span>{{ app.dev_email }}</span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">event</span>
            <span>{{ new Date(app.applied_at).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
    </div>


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
import AppLogo from '../components/AppLogo.vue'

import { useToast } from "vue-toastification";
const toast = useToast();

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

// Función para manejar el cambio de avatar
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

// Función para validar el formulario de perfil de empresa
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
  saving.value = true;
  error.value = '';

  // Validación frontend antes de enviar
  if (!validateCompanyProfile()) {
    saving.value = false;
    error.value = 'Corrige los campos marcados.';
    return;
  }

  try {
    await updateCompanyProfile(form.value)
    toast.success('Perfil actualizado correctamente.')
    isEditingProfile.value = false
    await loadProfile()
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

// Funciones para crear y editar ofertas
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

// Funcion para publicar una oferta
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
    toast.success('Oferta publicada correctamente.');
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
  toast.success('Oferta editada correctamente.')
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

// Modal para cambiar contraseña
const showPasswordModal = ref(false)
const passwordForm = ref({ current: '', new: '', repeat: '' })
const passwordErrors = ref({})
const passwordChangeSuccess = ref('')
const passwordChangeError = ref('')

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/

function validatePasswordForm() {
  passwordErrors.value = {}
  if (!passwordForm.value.current) passwordErrors.value.current = 'Introduce tu contraseña actual.'
  if (!passwordForm.value.new) passwordErrors.value.new = 'Introduce la nueva contraseña.'
  else if (!passwordRegex.test(passwordForm.value.new))
    passwordErrors.value.new = 'Debe tener al menos 8 caracteres, una mayúscula y un número.'
  if (passwordForm.value.new !== passwordForm.value.repeat)
    passwordErrors.value.repeat = 'Las contraseñas no coinciden.'
  return Object.keys(passwordErrors.value).length === 0
}

async function changePassword() {
  passwordChangeSuccess.value = ''
  passwordChangeError.value = ''
  if (!validatePasswordForm()) return
  try {
    await api.put('/api/auth/change-password', {
      currentPassword: passwordForm.value.current,
      newPassword: passwordForm.value.new
    })
    passwordChangeSuccess.value = 'Contraseña cambiada correctamente.'
    toast.success('¡Contraseña cambiada correctamente!')
    showPasswordModal.value = false
    passwordForm.value = { current: '', new: '', repeat: '' }
  } catch (e) {
    passwordChangeError.value = e.response?.data?.message || 'Error al cambiar la contraseña.'
  }
}

onMounted(() => {
  loadProfile();
  loadJobs();
  loadApplications();
})
</script>

<style lang="scss" scoped>

.profile-container {
  padding: 20px;
  max-width: 100vw;
  overflow-x: hidden;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: var(--black);
  padding: 4rem;
  max-width: 100vw;
  box-sizing: border-box;
  overflow-x: hidden;
}

// Estilos del perfil de empresa
.profile-info {
  display: flex;
  flex-direction: column;
  .profile-resume {
    display: flex;
    flex-direction: row;
    .profile-avatar {
      .avatar-preview {
        width: 180px;
        height: 180px;
        max-width: 180px;
        max-height: 180px;
        object-fit: cover;
        border-radius: 20%;
        margin-bottom: 1.5rem;
        border: 2px solid var(--green-light);
        background: var(--smoke);
        display: block;
      }
    }
    .profile-data {
      margin-left: 1.5rem;
      h2 {
        font-size: 40px;
        color: var(--white);
        margin-bottom: 0.5rem;
      }
      p {
        display: flex;
        align-items: center;
        gap: 2px;
        margin: 0.2rem 0;
        font-size: 1.1rem;
        color: var(--white);
        span {
          margin-right: 0.5rem;
          color: var(--green-light);
        }
      }
    }
  }
}


.profile-form .avatar-preview {
  width: 180px !important;
  height: 180px !important;
  max-width: 180px !important;
  max-height: 180px !important;
  object-fit: cover;
  border-radius: 20%;
  margin-bottom: 1.5rem;
  border: 2px solid var(--green-light);
  background: var(--smoke);
  display: block;
}

.profile-details {
  p {
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 0.5rem 0;
    font-size: 1.1rem;
    color: var(--white);

    .material-icons-outlined {
      color: var(--green-light);
      font-size: 22px;
      margin-right: 0.5rem;
      flex-shrink: 0;
    }

    span {
      color: var(--green-light);
      font-weight: bold;
      margin-right: 0.3rem;
    }
  }
}

.profile-actions-separator {
  border: none;
  border-top: 1px solid var(--green-light);
  margin: 2rem 0 1.5rem 0;
  width: 100%;
  opacity: 0.7;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}


// Estilos del Ofertas y Aplicaciones
.company-jobs-section,
.applications-section {
  margin-top: 2rem;
  background: var(--black, #181818);
  border-radius: 18px;
  padding: 1.5rem;
}

.company-jobs-section h2,
.applications-section h2 {
  color: var(--green-light, #00e676);
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.company-jobs-table-wrapper,
.applications-table-wrapper {
  overflow-x: auto;
}

.company-jobs-table,
.applications-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--black, #181818);
  color: var(--white, #fff);
  border-radius: 12px;
  overflow: hidden;
}

.company-jobs-table th,
.company-jobs-table td,
.applications-table th,
.applications-table td {
  padding: 0.8rem 1rem;
  text-align: center;
  border-bottom: 1px solid var(--green-light, #00e676);
  vertical-align: middle;
}

.company-jobs-table th,
.applications-table th {
  background: var(--green-light, #00e676);
  color: var(--black, #181818);
  font-weight: 600;
  font-size: 1rem;
}

.company-jobs-table tr:last-child td,
.applications-table tr:last-child td {
  border-bottom: none;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.delete-btn {
  background: var(--green-light, #00e676);
  color: var(--black, #181818);
  border: 1px solid var(--green-light, #00e676);
  border-radius: 50px;
  padding: 0.4rem 1.2rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.delete-btn:hover {
  background: transparent;
  color: var(--green-light, #00e676);
  border-color: var(--green-light, #00e676);
}


// Estilos para los botones

.edit-btn,
.save-btn,
.logout-btn,
.cancel-btn,
.view-btn,
.reapply-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: fit-content;
  background: transparent;
  color: var(--white);
  border: 1px solid var(--white);
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.publish-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: fit-content;
  background: transparent;
  color: var(--green-light);
  border: 1px solid var(--green-light);
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.edit-btn:hover,
.save-btn:hover,
.publish-btn:hover,
.view-btn:hover,
.reapply-btn:hover {
  background: var(--green-light);
  color: var(--black);
  border: 1px solid var(--green-light);
}

.logout-btn {
  background: var(--green-light);
  color: var(--black);
  border: 1px solid var(--green-light);
  margin-left: auto;
  margin-right: 1rem;
}
.logout-btn:hover {
  background: transparent;
  border-color: var(--green-light);
  color: var(--green-light);
}

.cancel-btn {
  background: transparent;
  color: var(--green-light);
  border: 1px solid var(--green-light);
}
.cancel-btn:hover {
  background: var(--green-light);
  color: var(--black);
}

.delete-btn {
  background: var(--green-light);
  color: var(--black);
  border: 1px solid var(--green-light);
  border-radius: 50px;
  padding: 0.4rem 1.2rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.delete-btn:hover {
  background: transparent;
  color: var(--green-light);
  border-color: var(--green-light);
}

.edit-btn,
.create-job-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--green-light);
  background: transparent;
  color: var(--green-light);
  transition: background 0.2s, color 0.2s;
}

.edit-btn .material-icons-outlined,
.create-job-btn .material-icons-outlined {
  font-size: 22px;
  color: var(--green-light);
}

.edit-btn:hover {
  background: var(--green-light);
  color: var(--black);
}

.edit-btn:hover .material-icons-outlined {
  color: var(--black);
}

.create-job-btn {
  background: var(--green-light);
  color: var(--black);
  width: auto;
}

.create-job-btn .material-icons-outlined {
  color: var(--black);
}

.create-job-btn:hover {
  background: var(--black);
  color: var(--green-light);
}

.create-job-btn:hover .material-icons-outlined {
  color: var(--green-light);
}


.logout-btn {
  position: absolute;
  top: 24px;
  right: 0px;
  z-index: 1100;
  background: var(--green-light);
  color: var(--black);
  border: 1px solid var(--green-light);
  border-radius: 50px;
  padding: 0.7rem 2.2rem;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.logout-btn:hover {
  background: transparent;
  color: var(--green-light);
  border-color: var(--green-light);
}


input,
textarea,
select {
  min-height: 45px;
  height: 45px;
  font-size: 1rem;
  border-radius: 10px;
  box-sizing: border-box;
  width: 100%;
  background: transparent;
  border: 1px solid var(--white);
  color: var(--white);
  padding: 10px;
  margin-top: 0.3rem;
  outline: none;
  transition: border 0.2s;
}

input:focus,
textarea:focus,
select:focus {
  border: 1px solid var(--green-light);
}
textarea {
  min-height: 80px;
  border-radius: 18px;
  resize: vertical;
}

button,
input[type="submit"] {
  width: 150px;
  min-height: 45px;
  height: 45px;
  font-size: 1rem;
  border-radius: 50px;
  box-sizing: border-box;
  padding: 0.75rem 1.5rem;
}

label {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
  color: var(--white);
  font-weight: 400;
  font-size: 1rem;
}


// Estilos para edición de perfil

.profile-form label {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
  color: var(--white);
  width: 50%;
}

.form-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.2rem;
}

.form-row label {
  flex: 1 1 0;
  width: 100%;
}

.profile-form input,
.profile-form textarea {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 10px;
  border: 1px solid var(--white);
  background: transparent;
  color: var(--white);
  outline: none;
  transition: border 0.2s;
  margin-top: 0.3rem;
}

.profile-form input:focus,
.profile-form textarea:focus {
  border: 1px solid var(--green-light);
}

// Estilos para el modal de cambio de contraseña

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: var(--black);
  color: var(--white);
  padding: 2rem;
  border-radius: 20px;
  min-width: 320px;
  max-width: 550px;
  width: 100%;
  border: 1px solid var(--green-light);
  box-shadow: 0 2px 12px #0002;
}
.modal-content h3 {
  color: var(--green-light);
  margin-bottom: 1rem;
  text-align: center;
  font-size: 24px;
}
.form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}
.input-icon {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon .material-icons-outlined {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--green-light);
  font-size: 22px;
  pointer-events: none;
}
.modal-content input[type="password"] {
  padding: 0.75rem 1rem 0.75rem 48px; // espacio para el icono
  font-size: 1rem;
  border-radius: 50px;
  border: 1px solid var(--white);
  background: transparent;
  color: var(--white);
  outline: none;
  transition: border 0.2s;
  margin-top: 0.3rem;
  width: 100%;
}
.modal-content input[type="password"]:focus {
  border: 1px solid var(--green-light);
}
.modal-content .save-btn {
  margin-top: 1rem;
  width: 100%;
}
.modal-content .cancel-btn {
  width: 100%;
  margin-top: 0.5rem;
}
.modal-content .input-error-message {
  color: var(--green-light);
  font-size: 0.9rem;
  margin-top: 0.2rem;
}

// Estilos para creacion de ofertas

.form-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.2rem;
}

.form-row label {
  flex: 1 1 0;
  width: 100%;
}

.tech-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.tech-buttons button {
  height: 45px;
  padding: 0.5rem 1.2rem;
  border: 1px solid var(--white);
  border-radius: 50px;
  background: transparent;
  color: var(--white);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: var(--green-light);
    color: var(--black);
  }
}
.tech-buttons button.selected,
.tech-buttons button:active {
  background: var(--green-light);
  color: var(--black);
  border-color: var(--green-light);
}

.tech-section h3,
.job-form h3 {
  color: var(--white);
  font-weight: 400;
  font-size: 1rem;
  margin-bottom: 0.7rem;
  margin-top: 1.2rem;
}


// Responsive styles

.desktop-only { display: block; }
.mobile-only { display: none; }

@media (max-width: 900px) {

  .profile-container {
    padding: 50px;
  }

  .logout-btn {
    position: absolute;
    top: 24px;
    right: 10px;
    margin-left: 0;
    z-index: 1100;
    padding: 0.7rem 1.2rem;
    font-size: 1rem;
  }
  .profile-resume {
    margin-top: 30px;
    flex-direction: column;
    align-items: flex-start;
    .profile-avatar .avatar-preview {
      width: 90px !important;
      height: 90px !important;
      margin-bottom: 1rem;
    }

    .profile-data {
      margin-left: 0;
      margin-top: -2.5rem;
      align-items: center;
      h2, p {
        text-align: flex-start;
      }
    }
  }
  .profile-details {
    align-items: flex-end;
    p {
      gap: 0.4rem;
      font-size: 1.1rem;
      justify-content: flex-start;
      text-align: left;
      display: flex;
      width: 100%;
      align-items: flex-start;
      flex-direction: column;
    }
  }
  .actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
    button {
      width: 100% !important;
      min-width: 0 !important;
      justify-content: center;
    }
  }
}

@media (max-width: 600px) {
  .logout-btn {
    top: 16px;
    right: 0px;
    font-size: 0.95rem;
  }
  .profile-resume .profile-avatar .avatar-preview {
    width: 90px !important;
    height: 90px !important;
  }
  .profile-details {
    align-items: flex-end;
    p {
      gap: 0.4rem;
      font-size: 1.1rem;
      justify-content: flex-start;
      text-align: left;
      display: flex;
      width: 100%;
      align-items: flex-start;
      flex-direction: column;
    }
  }
  .actions {
    gap: 0.5rem;
    button {
      font-size: 0.95rem;
      padding: 0.5rem 1rem;
      width: 100% !important;
      min-width: 0 !important;
    }
  }
}

@media (max-width: 900px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: grid !important; }
  .offers-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }
  .offer-card {
    background: var(--black, #181818);
    border-radius: 14px;
    box-shadow: 0 2px 8px #0002;
    padding: 1rem;
    border: 1px solid var(--green-light);
    color: var(--white);
    min-height: 220px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .company-logo {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    margin-right: 0.5rem;
  }
  .company-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.7rem;
  }
  .offer-title {
    font-size: 1.1rem;
    margin: 0.5rem 0 1rem 0;
    color: var(--green-light);
  }
  .offer-details {
    margin-bottom: 1rem;
    .detail-row {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      margin-bottom: 0.3rem;
      color: var(--white);
      .material-icons-outlined {
        font-size: 20px;
        color: var(--green-light);
      }
    }
  }
  .card-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: auto;
    justify-content: flex-end;
  }
}

@media (max-width: 600px) {
  .offers-grid {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }
  .offer-card {
    min-height: 0;
    padding: 0.8rem;
    border-radius: 10px;
  }
  .company-logo {
    width: 28px;
    height: 28px;
  }
  .offer-title {
    font-size: 1rem;
  }
}

.section-title {
  grid-column: 1 / -1;
  color: var(--green-light, #00e676);
  font-size: 1.2rem;
  margin-top: 20px;
  text-align: left;
}

</style>
