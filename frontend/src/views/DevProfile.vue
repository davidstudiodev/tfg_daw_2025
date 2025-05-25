<template>
  <div class="profile-container">
    <h1>Perfil de Developer</h1>

    <!-- Notificaciones -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Estado de carga -->
    <div v-if="loading">Cargando perfil…</div>

    <!-- Resumen de perfil -->
    <section v-else-if="!isEditing" class="profile-summary">
      <img
        v-if="form.avatar"
        :src="form.avatar"
        alt="Avatar"
        class="avatar-preview"
      />
      <p><strong>Nombre:</strong> {{ form.name }}</p>
      <p><strong>Correo:</strong> {{ form.email }}</p>
      <p><strong>Profesión:</strong> {{ form.profession || 'N/D' }}</p>
      <p><strong>Teléfono:</strong> {{ form.phone || 'N/D' }}</p>
      <p><strong>Biografía:</strong> {{ form.description }}</p>
      <p><strong>Años experiencia:</strong> {{ form.years_experience }}</p>
      <p><strong>Ubicación:</strong> {{ form.location }}</p>
      <p>
        <strong>Tecnologías:</strong>
        {{ allTech.length > 0 ? allTech.join(', ') : 'Ninguna' }}
      </p>

      <div class="actions">
        <button type="button" @click="startEditing" class="edit-btn">
          Editar datos
        </button>
        <button type="button" @click="handleLogout" class="logout-btn">
          Cerrar sesión
        </button>
        <button type="button" @click="goToOffers" class="publish-btn">
          Ver todas las ofertas
        </button>
      </div>
    </section>

    <!-- Formulario de edición -->
    <form v-else @submit.prevent="saveProfile" class="profile-form">
      <label>
        Avatar
        <input
          type="file"
          accept="image/*"
          @change="handleAvatarChange"
          :disabled="!isEditing"
        />
        <small class="note">Máximo 1 MB, formato JPG/PNG</small>
      </label>
      <img
        v-if="form.avatar"
        :src="form.avatar"
        alt="Vista previa"
        class="avatar-preview"
      />

      <label>
        Nombre
        <input
          type="text"
          v-model="form.name"
          :disabled="!isEditing"
          :class="{ 'input-error': fieldErrors.name }"
          required
        />
        <span v-if="fieldErrors.name" class="input-error-message">{{ fieldErrors.name }}</span>
      </label>

      <label>
        Correo
        <input
          type="email"
          v-model="form.email"
          :disabled="!isEditing"
          :class="{ 'input-error': fieldErrors.email }"
          required
        />
        <span v-if="fieldErrors.email" class="input-error-message">{{ fieldErrors.email }}</span>
      </label>

      <label>
        Profesión
        <input
          type="text"
          v-model="form.profession"
          :disabled="!isEditing"
          :class="{ 'input-error': fieldErrors.profession }"
          required
        />
        <span v-if="fieldErrors.profession" class="input-error-message">{{ fieldErrors.profession }}</span>
      </label>

      <label>
        Teléfono
        <input
          type="tel"
          v-model="form.phone"
          :disabled="!isEditing"
          :class="{ 'input-error': fieldErrors.phone }"
          required
        />
        <span v-if="fieldErrors.phone" class="input-error-message">{{ fieldErrors.phone }}</span>
      </label>

      <label>
        Biografía
        <textarea
          v-model="form.description"
          rows="3"
          :disabled="!isEditing"
          :class="{ 'input-error': fieldErrors.description }"
          required
        ></textarea>
        <span v-if="fieldErrors.description" class="input-error-message">{{ fieldErrors.description }}</span>
      </label>

      <label>
        Años de experiencia
        <input
          type="number"
          v-model.number="form.years_experience"
          min="0"
          :disabled="!isEditing"
          :class="{ 'input-error': fieldErrors.years_experience }"
          required
        />
        <span v-if="fieldErrors.years_experience" class="input-error-message">{{ fieldErrors.years_experience }}</span>
      </label>

      <label>
        Ubicación (ciudad)
        <input
          type="text"
          v-model="form.location"
          :disabled="!isEditing"
          :class="{ 'input-error': fieldErrors.location }"
          required
        />
        <span v-if="fieldErrors.location" class="input-error-message">{{ fieldErrors.location }}</span>
      </label>

      <!-- Selección de tecnologías -->
      <div
        v-for="section in techOptions"
        :key="section.category"
        class="tech-section"
      >
        <h3>{{ section.category }}</h3>
        <div class="tech-buttons">
          <button
            v-for="item in section.items"
            :key="item"
            type="button"
            :disabled="!isEditing"
            :class="{ selected: selected.includes(item) }"
            @click="toggleTech(item)"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <!-- Botones de acciones -->
      <div class="actions">
        <button
          type="submit"
          :disabled="saving || !isEditing"
          class="save-btn"
        >
          {{ saving ? 'Guardando…' : 'Guardar y publicar' }}
        </button>
        <button
          type="button"
          @click="cancelEdit"
          class="cancel-btn"
        >
          Cancelar
        </button>
      </div>

      <button
        type="button"
        @click="handleLogout"
        class="logout-btn"
      >
        Cerrar sesión
      </button>
    </form>

    <!-- Aplicaciones del dev -->
    <section v-if="applications.length" class="applications-section">
      <h2>Ofertas a las que has aplicado</h2>
      <div class="applications-grid">
        <div
          v-for="app in applications"
          :key="app.application_id"
          class="application-card"
        >
          <div class="company-info">
            <img
              v-if="app.company_avatar"
              :src="app.company_avatar"
              class="company-logo"
              alt="logo"
            />
            <span class="company-name">{{ app.company_name }}</span>
          </div>
          <p class="offer-description">{{ app.description }}</p>
          <p><strong>Jornada:</strong> {{ app.work_time }}</p>
          <p><strong>Salario:</strong> {{ app.salary }}</p>
          <p><strong>Aplicaste el:</strong> {{ new Date(app.applied_at).toLocaleDateString() }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '../services/auth.js';
import { getDevProfile, updateDevProfile } from '../services/profile.js';
import { techOptions } from '../constants/techOptions.js';
import api from '../services/api.js';

const router = useRouter();
const loading = ref(true);
const saving = ref(false);
const error = ref('');
const isEditing = ref(false);
const fieldErrors = ref({});

// Reactive form data
const form = ref({
  name: '',
  email: '',
  profession: '',
  phone: '',
  description: '',
  years_experience: 0,
  location: '',
  tech_stack: [],
  avatar: ''
});

// Selected tech items
const selected = ref([]);

// Computed from form.tech_stack to display
const allTech = computed(() =>
  Array.isArray(form.value.tech_stack)
    ? form.value.tech_stack
        .filter(sec => Array.isArray(sec.items) && sec.items.length > 0)
        .flatMap(sec => sec.items)
    : []
);

const applications = ref([]);
const loadingApplications = ref(false);

async function loadProfile() {
  loading.value = true;
  try {
    const { data } = await getDevProfile();
    let tech_stack = data.tech_stack;
    console.log('Respuesta del backend:', data); // <-- LOG 1

    if (typeof tech_stack === 'string') {
      try {
        tech_stack = JSON.parse(tech_stack);
        console.log('tech_stack parseado:', tech_stack); // <-- LOG 2
      } catch {
        tech_stack = [];
        console.log('tech_stack no se pudo parsear, se deja como []'); // <-- LOG 3
      }
    }
    if (!Array.isArray(tech_stack)) {
      console.log('tech_stack NO es array, se deja como []'); // <-- LOG 4
      tech_stack = [];
    }

    form.value = {
      name: data.name,
      email: data.email,
      profession: data.profession || '',
      phone: data.phone || '',
      description: data.description,
      years_experience: data.years_experience,
      location: data.location,
      tech_stack,
      avatar: data.avatar || ''
    };
    console.log('form.value.tech_stack final:', form.value.tech_stack); // <-- LOG 5

    selected.value = Array.isArray(tech_stack)
      ? tech_stack.flatMap(sec => sec.items)
      : [];
    console.log('selected.value:', selected.value); // <-- LOG 6
  } catch (e) {
    console.log('Error en loadProfile:', e); // <-- LOG 7
    isEditing.value = true;
  } finally {
    loading.value = false;
  }
}

async function loadApplications() {
  loadingApplications.value = true;
  try {
    const { data } = await api.get('/api/dev/applications');
    applications.value = data;
  } catch {
    applications.value = [];
  } finally {
    loadingApplications.value = false;
  }
}

function handleAvatarChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  const MAX_SIZE = 1024 * 1024; // 1MB
  if (file.size > MAX_SIZE) {
    error.value = 'La imagen supera 1 MB.';
    return;
  }
  error.value = '';

  const reader = new FileReader();
  reader.onload = () => {
    form.value.avatar = reader.result;
  };
  reader.readAsDataURL(file);
}

function startEditing() {
  isEditing.value = true;
}

function toggleTech(item) {
  if (!isEditing.value) return;
  const idx = selected.value.indexOf(item);
  if (idx > -1) selected.value.splice(idx, 1);
  else selected.value.push(item);
}

function validateForm() {
  fieldErrors.value = {};

  // Nombre
  if (!form.value.name || form.value.name.trim().length === 0) {
    fieldErrors.value.name = 'El nombre es obligatorio.';
  }
  // Correo
  if (!form.value.email || !/^\S+@\S+\.\S+$/.test(form.value.email)) {
    fieldErrors.value.email = 'El correo no es válido.';
  }
  // Profesión
  if (!form.value.profession || form.value.profession.trim().length === 0) {
    fieldErrors.value.profession = 'La profesión es obligatoria.';
  }
  // Teléfono: solo números, mínimo 7 dígitos
  if (!/^\d{7,}$/.test(form.value.phone)) {
    fieldErrors.value.phone = 'El teléfono debe tener solo números y al menos 7 dígitos.';
  }
  // Biografía
  if (!form.value.description || form.value.description.trim().length < 10) {
    fieldErrors.value.description = 'La biografía debe tener al menos 10 caracteres.';
  }
  // Años de experiencia
  if (!Number.isInteger(form.value.years_experience) || form.value.years_experience < 0) {
    fieldErrors.value.years_experience = 'Debe ser un número entero positivo.';
  }
  // Ubicación
  if (!form.value.location || form.value.location.trim().length === 0) {
    fieldErrors.value.location = 'La ubicación es obligatoria.';
  }
  return Object.keys(fieldErrors.value).length === 0;
}

async function saveProfile() {
  saving.value = true;
  error.value = '';

  // Validación frontend antes de enviar
  if (!validateForm()) {
    saving.value = false;
    error.value = 'Corrige los campos marcados.';
    return;
  }

  // Armar tech_stack correctamente antes de enviar
  form.value.tech_stack = techOptions.map(sec => ({
    category: sec.category,
    items: sec.items.filter(i => selected.value.includes(i))
  })).filter(sec => sec.items.length > 0);

  console.log('Enviando tech_stack:', form.value.tech_stack);

  try {
    await updateDevProfile(form.value)
    alert('Perfil actualizado correctamente.')
    isEditing.value = false
    await loadProfile()
  } catch (e) {
    // ...manejo de errores...
  } finally {
    saving.value = false;
  }
}

async function handlePublish() {
  await saveProfile();
  router.push({ path: '/developers' });
}

async function handleLogout() {
  await logout();
  router.push({ name: 'login', query: { role: 'dev' } });
}

function goToOffers() {
  router.push({ name: 'offers' });
}

function cancelEdit() {
  isEditing.value = false;
  loadProfile(); // Recarga los datos originales
}

onMounted(() => {
  loadProfile();
  loadApplications();
});
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
.profile-form {
  margin-bottom: 1rem;
}
.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.edit-btn {
  background: #1976d2;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.publish-btn {
  background: #43a047;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.logout-btn {
  background: #f44336;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
  background: #007bff;
  color: #fff;
  border-color: #0056b3;
}
.error {
  color: #c00;
  margin: 1rem 0;
}
.success {
  color: #060;
  margin: 1rem 0;
}
.profile-form input,
.profile-form textarea {
  padding: 0.5rem;
  font-size: 1rem;
}
.profile-form button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.applications-section {
  margin-top: 2rem;
}
.application-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}
.application-card h3 {
  margin-top: 0;
}
.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.view-btn {
  background: #007bff;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.reapply-btn {
  background: #43a047;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.applications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}
.company-info {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}
.company-logo {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 0.5rem;
}
.company-name {
  font-weight: bold;
}
.offer-description {
  margin: 0.5rem 0;
}
.cancel-btn {
  background: #aaa;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.input-error {
  border: 1px solid #c00;
}
.input-error-message {
  color: #c00;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
