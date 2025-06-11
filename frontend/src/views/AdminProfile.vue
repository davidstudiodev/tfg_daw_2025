<template>
  <div class="admin-profile">
    <h1>Panel de Administrador</h1>
    <button class="logout-btn" @click="logout">
      <span class="material-icons-outlined">logout</span>Cerrar sesión</button>
    <div class="tabs">
      <button :class="{active: tab==='devs'}" @click="tab='devs'">Developers</button>
      <button :class="{active: tab==='companies'}" @click="tab='companies'">Empresas</button>
    </div>

    <!-- Lista de Developers -->
    <div v-if="tab==='devs'">
      <h2>Lista de Developers</h2>
      <div class="filters">
        <input v-model="devFilter" placeholder="Buscar por nombre o email..." />
        <button class="edit-btn" @click="showPasswordModal = true">
          <span class="material-icons-outlined">lock_reset</span>
          Cambiar contraseña
        </button>
        <button class="edit-btn" @click="openEmailModal">
          <span class="material-icons-outlined">alternate_email</span>
          Cambiar correo
        </button>
      </div>
      
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredDevs" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <div class="table-actions">
                  <button @click="editUser(user)" title="Editar">
                    <span class="material-icons-outlined">edit</span>
                  </button>
                  <button @click="deleteUser(user)" title="Eliminar">
                    <span class="material-icons-outlined">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>


    <!-- Lista de Empresas -->
    <div v-else>
      <h2>Lista de Empresas</h2>
      <div class="filters">
        <input v-model="devFilter" placeholder="Buscar por nombre o email..." />
        <button class="edit-btn" @click="showPasswordModal = true">
          <span class="material-icons-outlined">lock_reset</span>
          Cambiar contraseña
        </button>
        <button class="edit-btn" @click="openEmailModal">
          <span class="material-icons-outlined">alternate_email</span>
          Cambiar correo
        </button>
      </div>
      
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredCompanies" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <div class="table-actions">
                  <button @click="editUser(user)" title="Editar">
                    <span class="material-icons-outlined">edit</span>
                  </button>
                  <button @click="deleteUser(user)" title="Eliminar">
                    <span class="material-icons-outlined">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>      
      </div>      


    </div>


    <!-- Modal de edición de developer -->
    <div v-if="showEditModal" class="modal-overlay">
    <div class="modal">
        <h3>Editar Developer</h3>
        <form @submit.prevent="saveEdit">
        <input v-model="editUserData.name" placeholder="Nombre" required />
        <input v-model="editUserData.email" placeholder="Email" required />
        <input v-model="editUserData.profession" placeholder="Profesión" />
        <input v-model="editUserData.phone" placeholder="Teléfono" />
        <input v-model="editUserData.location" placeholder="Ubicación" />
        <input v-model="editUserData.years_experience" type="number" min="0" placeholder="Años de experiencia" />
        <textarea v-model="editUserData.description" placeholder="Descripción"></textarea>
        <!-- Puedes agregar más campos según tu modelo -->
        <div class="modal-actions">
            <button type="submit">Guardar</button>
            <button type="button" @click="closeEditModal">Cancelar</button>
        </div>
        </form>
    </div>
    </div>

    <!-- Modal de edición de empresa -->
    <div v-if="showEditCompanyModal" class="modal-overlay">
    <div class="modal">
        <h3>Editar Empresa</h3>
        <form @submit.prevent="saveEditCompany">
        <input v-model="editCompanyData.name" placeholder="Nombre" required />
        <input v-model="editCompanyData.email" placeholder="Email" required />
        <input v-model="editCompanyData.description" placeholder="Descripción" />
        <input v-model="editCompanyData.location" placeholder="Ubicación" />
        <input v-model="editCompanyData.phone" placeholder="Teléfono" />
        <input v-model="editCompanyData.avatar" placeholder="Avatar (URL)" />
        <div class="modal-actions">
            <button type="submit">Guardar</button>
            <button type="button" @click="closeEditCompanyModal">Cancelar</button>
        </div>
        </form>
    </div>
    </div>

    <!-- Modal para cambiar contraseña -->
    <div v-if="showPasswordModal" class="modal-overlay">
      <div class="modal">
        <h3>Cambiar contraseña</h3>
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label>Contraseña actual</label>
            <div class="input-icon">
              <span class="material-icons-outlined">lock</span>
              <input
                :type="showCurrentPassword ? 'text' : 'password'"
                v-model="passwordForm.current"
                :class="{ 'input-error': passwordErrors.current }"
                placeholder="Contraseña actual"
              />
              <span
                class="material-icons-outlined eye"
                @click="showCurrentPassword = !showCurrentPassword"
                :title="showCurrentPassword ? 'Ocultar' : 'Mostrar'"
              >
                {{ showCurrentPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </div>
            <span v-if="passwordErrors.current" class="input-error-message">{{ passwordErrors.current }}</span>
          </div>
          <div class="form-group">
            <label>Nueva contraseña</label>
            <div class="input-icon">
              <span class="material-icons-outlined">lock_reset</span>
              <input
                :type="showNewPassword ? 'text' : 'password'"
                v-model="passwordForm.new"
                :class="{ 'input-error': passwordErrors.new }"
                @input="validatePasswordForm"
                placeholder="Nueva contraseña"
              />
              <span
                class="material-icons-outlined eye"
                @click="showNewPassword = !showNewPassword"
                :title="showNewPassword ? 'Ocultar' : 'Mostrar'"
              >
                {{ showNewPassword ? 'visibility_off' : 'visibility' }}
              </span>
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
                :type="showRepeatPassword ? 'text' : 'password'"
                v-model="passwordForm.repeat"
                :class="{ 'input-error': passwordErrors.repeat }"
                @input="validatePasswordForm"
                placeholder="Repetir nueva contraseña"
              />
              <span
                class="material-icons-outlined eye"
                @click="showRepeatPassword = !showRepeatPassword"
                :title="showRepeatPassword ? 'Ocultar' : 'Mostrar'"
              >
                {{ showRepeatPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </div>
            <span v-if="passwordErrors.repeat" class="input-error-message">{{ passwordErrors.repeat }}</span>
          </div>
          <div class="modal-actions">
            <button type="submit" class="save-btn">Guardar</button>
            <button type="button" @click="closePasswordModal" class="cancel-btn">Cancelar</button>
          </div>
          <p v-if="passwordChangeSuccess" class="success">{{ passwordChangeSuccess }}</p>
          <p v-if="passwordChangeError" class="error">{{ passwordChangeError }}</p>
        </form>
      </div>
    </div>

    <!-- Modal para cambiar correo -->
    <div v-if="showEmailModal" class="modal-overlay">
      <div class="modal">
        <h3>Cambiar correo</h3>
        <form @submit.prevent="changeEmail">
          <label>Correo actual</label>
          <input type="email" :value="adminEmail" disabled />
          <label>Nuevo correo</label>
          <input v-model="emailForm.email" type="email" required />
          <label>Contraseña actual</label>

          <div class="input-icon">
            <span class="material-icons-outlined">lock</span>
            <input
              v-model="emailForm.currentPassword"
              :type="showEmailPassword ? 'text' : 'password'"
              required
              placeholder="Contraseña actual"
            />
            <span
              class="material-icons-outlined eye"
              @click="showEmailPassword = !showEmailPassword"
              :title="showEmailPassword ? 'Ocultar' : 'Mostrar'"
            >
              {{ showEmailPassword ? 'visibility_off' : 'visibility' }}
            </span>
          </div>

          <div class="modal-actions">
            <button type="submit" class="save-btn">Guardar</button>
            <button type="button" @click="closeEmailModal" class="cancel-btn">Cancelar</button>
          </div>
          <p v-if="emailSuccess" class="success">{{ emailSuccess }}</p>
          <p v-if="emailError" class="error">{{ emailError }}</p>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

import { useToast } from "vue-toastification";
const toast = useToast();

const tab = ref('devs')
const devs = ref([])
const companies = ref([])
const devFilter = ref('')
const companyFilter = ref('')
const router = useRouter()

const showEditModal = ref(false)
const editUserData = ref({})

const showEditCompanyModal = ref(false)
const editCompanyData = ref({})


const filteredDevs = computed(() =>
  devs.value.filter(u =>
    (u.name + u.email).toLowerCase().includes(devFilter.value.toLowerCase())
  )
)
const filteredCompanies = computed(() =>
  companies.value.filter(u =>
    (u.name + u.email).toLowerCase().includes(companyFilter.value.toLowerCase())
  )
)

// Función para obtener la lista de usuarios y empresas
async function fetchUsers() {
  const { data } = await api.get('/api/admin/users')
  devs.value = data.filter(u => u.role === 'dev')
  companies.value = data.filter(u => u.role === 'company')
}

// Modal para editar usuario o empresa
async function editUser(user) {
  if (tab.value === 'companies') {
    // Cargar datos de la empresa
    try {
      const { data } = await api.get(`/api/admin/companies/${user.id}`)
      editCompanyData.value = { ...data }
      showEditCompanyModal.value = true
    } catch (e) {
      toast.error('Error al cargar los datos de la empresa')
    }
  } else {
    // Cargar datos del usuario
    try {
      const { data } = await api.get(`/api/admin/users/${user.id}`)
      editUserData.value = { ...data }
      showEditModal.value = true
    } catch (e) {
      toast.error('Error al cargar los datos del usuario')
    }
  }
}

function closeEditModal() {
  showEditModal.value = false
  editUserData.value = {}
}

// Guardar cambios de usuario
async function saveEdit() {
  try {
    await api.put(`/api/admin/users/${editUserData.value.id}`, editUserData.value)
    showEditModal.value = false
    fetchUsers()
    toast.success('Usuario editado correctamente')
  } catch (e) {
    toast.error('Error al guardar los cambios')
  }
}

function closeEditCompanyModal() {
  showEditCompanyModal.value = false
  editCompanyData.value = {}
}

// Guardar cambios de empresa
async function saveEditCompany() {
  try {
    await api.put(`/api/admin/companies/${editCompanyData.value.id}`, editCompanyData.value)
    showEditCompanyModal.value = false
    fetchUsers()
    toast.success('Empresa editada correctamente')
  } catch (e) {
    toast.error('Error al guardar los cambios')
  }
}

// Modal para eliminar usuario o empresa
async function deleteUser(user) {
  if (tab.value === 'companies') {
    if (confirm(`¿Eliminar empresa ${user.email}?`)) {
      try {
        await api.delete(`/api/admin/companies/${user.id}`)
        fetchUsers()
        toast.success('Empresa eliminada correctamente')
      } catch (e) {
        toast.error('Error al eliminar la empresa')
      }
    }
  } else {
    if (confirm(`¿Eliminar usuario ${user.email}?`)) {
      try {
        await api.delete(`/api/admin/users/${user.id}`)
        fetchUsers()
        toast.success('Usuario eliminado correctamente')
      } catch (e) {
        toast.error('Error al eliminar el usuario')
      }
    }
  }
}

// Función para cerrar sesión
async function logout() {
  try {
    await api.post('/api/auth/logout')
    router.push({ name: 'admin-login' })
  } catch (e) {
    toast.error('Error al cerrar sesión')
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
    closePasswordModal()
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


// Modal para cambiar email
const showEmailModal = ref(false)
const emailForm = ref({ email: '', currentPassword: '' })
const emailError = ref('')
const emailSuccess = ref('')
const adminEmail = ref('')

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showRepeatPassword = ref(false)
const showEmailPassword = ref(false)

function openEmailModal() {
  emailForm.value.email = adminEmail.value
  emailForm.value.currentPassword = ''
  emailError.value = ''
  emailSuccess.value = ''
  showEmailModal.value = true
}

function closeEmailModal() {
  showEmailModal.value = false
  emailForm.value = { email: adminEmail.value, currentPassword: '' }
  emailError.value = ''
  emailSuccess.value = ''
}

async function changeEmail() {
  emailError.value = ''
  emailSuccess.value = ''
  try {
    await api.put('/api/auth/change-email', {
      email: emailForm.value.email,
      currentPassword: emailForm.value.currentPassword
    })
    emailSuccess.value = 'Correo actualizado correctamente.'
    adminEmail.value = emailForm.value.email
    setTimeout(() => {
      closeEmailModal()
      location.reload()
    }, 1200)
  } catch (e) {
    emailError.value = e.response?.data?.message || 'Error al actualizar el correo.'
  }
}


onMounted(async () => {
  fetchUsers()
  try {
    const { data } = await api.get('/api/auth/me')
    adminEmail.value = data.email
  } catch (e) {
    adminEmail.value = ''
  }
})
</script>

<style lang="scss" scoped>

.admin-profile {
  max-width: auto;
  width: 100%;
  padding: 2.5rem 2rem;
  background: var(--white);
  color: var(--black);
  position: relative;
}
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.tabs button {
  background: transparent;
  color: var(--black);
  border: 1px solid var(--black);
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.tabs button.active,
.tabs button:hover {
  background: var(--green-light);
  color: var(--black);
}

h1 {
  color: var(--black);
  font-size: 2.2rem;
  margin-bottom: 2rem;
  font-weight: 600;
}
h2 {
  color: var(--black);
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.table-responsive {
  width: auto;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: transparent;
  color: var(--black);
  border-radius: 12px;
  overflow: hidden;
}
th, td {
  padding: 0.8rem 1rem;
  text-align: center;
  border-bottom: 1px solid var(--black);
  vertical-align: middle;
}

th {
  background: var(--black);
  color: var(--white);
  font-weight: 600;
  font-size: 1rem;
}
tr:last-child td {
  border-bottom: none;
}

.table-actions {
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-actions button {
  background: transparent;
  border: none;
  color: var(--black);
  padding: 0.3rem;
  border-radius: 50%;
  transition: background 0.2s;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
}
.table-actions button:hover {
  background: transparent;
  color: var(--green-light);
}
.table-actions .material-icons-outlined {
  font-size: 1.5rem;
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
.modal {
  background: var(--white);
  color: var(--black);
  padding: 2rem;
  border-radius: 20px;
  min-width: 320px;
  max-width: 700px;
  width: 100%;
  border: 1px solid var(--black);
}
.modal-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
.modal input,
.modal textarea {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--black);
  background: transparent;
  color: var(--black);
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
  margin-bottom: 1rem;
  width: 100%;
}
.modal input:focus,
.modal textarea:focus {
  border: 1px solid var(--green-light);
}

.modal label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: var(--black);
}

button,
input[type="submit"] {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: transparent;
  color: var(--black);
  border: 1px solid var(--black);
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
button:hover,
input[type="submit"]:hover {
  background: var(--green-light);
  color: var(--black);
}
.logout-btn {
  position: absolute;
  top: 32px;
  right: 32px;
  background: var(--green-light);
  color: var(--black);
  border: 1px solid var(--black);
  border-radius: 50px;
  padding: 0.7rem 2.2rem;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
  width: auto;
}
.logout-btn:hover {
  background: var(--black);
  color: var(--white);
  border-color: var(--black);
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.filters .edit-btn {
  width: auto;
}

.filters input {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--black);
  background: transparent;
  color: var(--black);
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
  min-width: 250px;
}

.input-icon {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.input-icon .material-icons-outlined {
  position: absolute;
  left: 16px;
  top: 13px;
  color: var(--black);
  font-size: 22px;
  pointer-events: none;
}

.input-icon .eye {
  right: 16px;
  left: auto;
  cursor: pointer;
  color: var(--black);
  z-index: 2;
  position: absolute;
  font-size: 22px;
  pointer-events: auto;
  user-select: none;
}

.input-icon input {
  padding-left: 44px;
  padding-right: 44px;
  width: 100%;
  box-sizing: border-box;
}

.input-error-message {
  color: #e74c3c;
  font-size: 0.97rem;
  margin-top: -1.5rem;
  margin-bottom: 0.2rem;
  display: block;
}

// Responsive styles

@media (max-width: 900px) {
  .admin-profile {
    padding: 2.5rem 2.5rem;
    min-width: 0;
    margin: 0;
  }
  .logout-btn {
    top: 18px;
    right: 18px;
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    border-radius: 50px;
  }
  h1 {
    font-size: 1.1rem;
    text-align: left;
    margin-top: 80px;
  }
  h2 {
    font-size: 1.1rem;
    margin-bottom: 0.7rem;
    text-align: left;
  }
  .tabs {
    gap: 0.3rem;
    display: flex;
    margin-bottom: 0.7rem;
    flex-direction: row;
  }
  .filters {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
    margin-bottom: 1rem;
    padding: 20px;
  }
  .filters input {
    min-width: 0;
    width: 100%;
    font-size: 1rem;
  }
  table {
    font-size: 0.9rem;
    margin-top: 0.5rem;
    border-radius: 10px;
    overflow-x: auto;
    width: auto;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
  }
  th, td {
    padding: 0.6rem 0.5rem;
    font-size: 0.97rem;
    width: 100%;
  }

  .table-actions {
    flex-direction: row;
    gap: 0.3rem;
    align-items: stretch;
    justify-content: center;
  }
  .modal {
    min-width: 0;
    max-width: 80vw;
    padding: 1rem;
  }
  .modal-actions {
    flex-direction: row;
    gap: 0.5rem;
    align-items: stretch;
  }
  .modal input,
  .modal textarea {
    font-size: 0.98rem;
    padding: 0.6rem 0.8rem;
  }
  .input-icon input {
    padding-left: 44px;
    width: 100%;
  }

  .input-icon .material-icons-outlined {
    top: 8px;
  }
    
}

@media (max-width: 600px) {
  .admin-profile {
    padding: 2rem 1rem;
    border-radius: 0;
    margin: 0;
  }
  .logout-btn {
    top: 8px;
    right: 8px;
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
  }
  h1 {
    font-size: 1.1rem;
    margin-bottom: 0.7rem;
  }
  h2 {
    margin-top: 2rem;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  .tabs {
    gap: 0.3rem;
    margin-bottom: 0.7rem;
  }
  .filters {
    gap: 0.8rem;
    margin-bottom: 0.7rem;
  }
  table {
    font-size: 0.9rem;
    border-radius: 7px;
  }
  th, td {
    padding: 0.4rem 0.2rem;
    font-size: 0.93rem;
  }
  .modal {
    padding: 0.7rem;
    max-width: 80vw;
  }
  .modal input,
  .modal textarea {
    font-size: 0.95rem;
    padding: 0.5rem 0.7rem;
  }
  .input-icon input {
    padding-left: 44px;
    width: 100%;
  }
}

</style>