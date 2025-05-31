<template>
  <div class="profile-container">
    <AppLogo @click="$router.push('/')" style="cursor:pointer; position:absolute; top:24px; left:24px; z-index:1100;" />
    <button type="button" @click="handleLogout" class="logout-btn">
      <span class="material-icons-outlined">logout</span>
          Cerrar sesión
    </button>
  
  <div class="profile-content">
    <!-- Notificaciones -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Estado de carga -->
    <div v-if="loading">Cargando perfil…</div>

    <!-- Resumen de perfil -->
    <section v-else-if="!isEditing" class="profile-summary">
      
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
            <p><span class="material-icons-outlined">code</span> {{ form.profession || 'N/D' }}</p>
            <p><span class="material-icons-outlined">call</span>{{ form.phone || 'N/D' }}</p>
          </div>
        </div>
        <div class="profile-details">
          <p><span class="material-icons-outlined">person</span><strong>Biografía:</strong> {{ form.description }}</p>
          <p><span class="material-icons-outlined">work_history</span><strong>Años experiencia:</strong> {{ form.years_experience }} año/s</p>
          <p><span class="material-icons-outlined">location_on</span><strong>Ubicación:</strong> {{ form.location }}</p>
          <p>
            <span class="material-icons-outlined">military_tech</span>
            <strong>Tecnologías:</strong>
            {{ allTech.length > 0 ? allTech.join(', ') : 'Ninguna' }}
          </p>
          
        </div>
      </div>

      <hr class="profile-actions-separator" />

      <div class="actions">
        <button type="button" @click="startEditing" class="edit-btn">
          <span class="material-icons-outlined">edit</span>
          Editar datos
        </button>
        <button type="button" @click="showPasswordModal = true" class="edit-btn">
          <span class="material-icons-outlined">lock_reset</span>
          Cambiar contraseña
        </button>
        
        <button type="button" @click="goToOffers" class="publish-btn">
          <span class="material-icons-outlined">sell</span>
          Ver todas las ofertas
        </button>
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
            <button type="button" @click="closePasswordModal" class="cancel-btn">Cancelar</button>
          </div>
          <p v-if="passwordChangeSuccess" class="success">{{ passwordChangeSuccess }}</p>
          <p v-if="passwordChangeError" class="error">{{ passwordChangeError }}</p>
        </form>
      </div>
    </div>

    <!-- Formulario de edición -->
    <form v-if="isEditing" @submit.prevent="saveProfile" class="profile-form">
      <h1>Edita tu perfil</h1>

        <div class="form-row">
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
        </div>

        <div class="form-row">
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
        </div>

        <div class="form-row">
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
        </div>

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

      <!-- Selección de tecnologías -->

      <h3>Selecciona tus tecnologías</h3>
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

      <hr class="profile-actions-separator" />

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
    </form>

    <!-- Aplicaciones del dev -->
    <section v-if="applications.length && !isEditing" class="applications-section">
      <h2>Ofertas a las que has aplicado</h2>
      <div class="applications-table-wrapper">
        <table class="applications-table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Puesto</th>
              <th>Jornada</th>
              <th>Salario</th>
              <th>Aplicaste el</th>
              <th>Acciones</th> <!-- NUEVO -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="app in applications" :key="app.application_id">
              <td>{{ app.company_name }}</td>
              <td>{{ app.puesto }}</td>
              <td>{{ app.work_time }}</td>
              <td>{{ app.salary }}</td>
              <td>{{ new Date(app.applied_at).toLocaleDateString() }}</td>
              <td>
                <button
                  class="delete-btn"
                  @click="deleteApplication(app.application_id)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>


  </div>


  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '../services/auth.js';
import { getDevProfile, updateDevProfile } from '../services/profile.js';
import { techOptions } from '../constants/techOptions.js';
import api from '../services/api.js';
import AppLogo from '../components/AppLogo.vue'

import { useToast } from "vue-toastification";
const toast = useToast();

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
    toast.success('Perfil actualizado correctamente.')
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
  if (passwordForm.value.new !== passwordForm.value.repeat) {
    passwordErrors.value.repeat = 'Las contraseñas no coinciden.'
  } else {
    passwordErrors.value.repeat = ''
  }
  
  return Object.values(passwordErrors.value).every(e => !e)
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
    closePasswordModal() // Usa la función centralizada
  } catch (e) {
    passwordChangeError.value = e.response?.data?.message || 'Error al cambiar la contraseña.'
  }
}

function closePasswordModal() {
  showPasswordModal.value = false
  passwordForm.value = { current: '', new: '', repeat: '' }
  passwordErrors.value = {}
  passwordChangeSuccess.value = ''
  passwordChangeError.value = ''
}

async function deleteApplication(applicationId) {
  if (!confirm('¿Seguro que deseas eliminar esta aplicación?')) return;
  try {
    await api.delete(`/api/dev/applications/${applicationId}`);
    // Elimina la aplicación del array local sin recargar toda la lista
    applications.value = applications.value.filter(app => app.application_id !== applicationId);
  } catch (e) {
    toast.error('No se pudo eliminar la aplicación.');
  }
}

onMounted(() => {
  loadProfile();
  loadApplications();
});
</script>

<style lang="scss" scoped>
.profile-container {
  padding: 20px;
  max-width: 100vw;
  overflow-x: hidden;
}

.profile-content {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: var(--black);
  padding: 4rem;
  max-width: 100vw;
  box-sizing: border-box;
  overflow-x: hidden;
  h1 {
    font-size: 50px;
    font-weight: 500;
    margin-bottom: 2rem;
    color: var(--green-light);
    text-align: left;
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
  .profile-info {
    display: flex;
    flex-direction: column;
    .profile-resume {
      display: flex;
      flex-direction: row;
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
}

.avatar-input {
  background: var(--green-light);
}

.avatar-preview {
  width: 180px;
  object-fit: cover;
  border-radius: 20%;
  margin-bottom: 1.5rem;
  border: 2px solid var(--green-light);
  background: var(--smoke);
}

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

.profile-form label {
  width: 100%; // Asegura que los labels ocupen el ancho disponible
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

.input-error {
  border: 1px solid var(--green-light) !important;
  background: #fff6f6;
  color: var(--green-light);
}

.input-error-message {
  color: var(--green-light);
  font-size: 0.9rem;
  margin-top: 0.2rem;
}

.note,
.info {
  color: var(--green-light);
  font-size: 0.9rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

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

.profile-form > h3 {
  color: var(--green-light);
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 1rem;
  margin-top: 2rem;
}

.tech-section h3 {
  color: var(--white);
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

.error {
  color: #c00;
  margin: 1rem 0 0.5rem 0;
  text-align: center;
}
.success {
  color: #060;
  margin: 1rem 0 0.5rem 0;
  text-align: center;
}

.applications-section {
  margin-top: 2rem;
  background: var(--black);
  border-radius: 18px;
  padding: 1.5rem;
}
.applications-section h2 {
  color: var(--green-light);
  font-size: 1.3rem;
  margin-bottom: 1rem;
}
.applications-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.application-card {
  border: none;
  border-bottom: 1px solid var(--green-light);
  padding: 1rem;
  background: var(--black);
  color: var(--white);
  box-shadow: 0 2px 8px #0001;
  margin: 0; // elimina margen extra si lo hubiera
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
  border: 1px solid var(--green-light);
  background: var(--smoke);
}
.company-name {
  font-weight: bold;
  color: var(--green-light);
}
.offer-description {
  margin: 0.5rem 0;
}

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

input,
textarea,
select {
  min-height: 45px;
  height: 45px;
  font-size: 1rem;
  border-radius: 50px;
  box-sizing: border-box;
  width: 100%;
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
.modal-content input,
.modal-content button {
  min-height: 45px;
  height: 45px;
  font-size: 1rem;
  border-radius: 50px;
}

.modal-content .form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}

.modal-content .input-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.modal-content .material-icons-outlined {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--green-light);
  font-size: 22px;
  pointer-events: none;
}

.modal-content h3 {
  color: var(--green-light);
  margin-bottom: 1rem;
  text-align: center;
  font-size: 24px;
}
.modal-content input[type="password"] {
  padding: 0.75rem 1rem 0.75rem 48px; // 48px a la izquierda para el icono
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
.modal-content .info {
  color: var(--green-light);
  font-size: 0.9rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
}

.profile-actions-separator {
  border: none;
  border-top: 1px solid var(--green-light);
  margin: 2rem 0 1.5rem 0;
  width: 100%;
  opacity: 0.7;
}

.applications-table-wrapper {
  overflow-x: auto;
}

.applications-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--black);
  color: var(--white);
  border-radius: 12px;
  overflow: hidden;
}

.applications-table th,
.applications-table td {
  padding: 0.8rem 1rem;
  text-align: center;
  border-bottom: 1px solid var(--green-light);
  vertical-align: middle;
}

.applications-table th {
  background: var(--green-light);
  color: var(--black);
  font-weight: 600;
  font-size: 1rem;
}

.applications-table tr:last-child td {
  border-bottom: none;
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
  cursor: pointer;
}



</style>
