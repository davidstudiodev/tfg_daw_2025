<template>
  <div class="admin-profile">
    <h1>Panel de Administrador</h1>
    <button class="logout-btn" @click="logout">Cerrar sesión</button>
    <div class="tabs">
      <button :class="{active: tab==='devs'}" @click="tab='devs'">Developers</button>
      <button :class="{active: tab==='companies'}" @click="tab='companies'">Empresas</button>
    </div>

    <div v-if="tab==='devs'">
      <h2>Developers</h2>
      <input v-model="devFilter" placeholder="Buscar por nombre o email..." />
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
              <button @click="editUser(user)">Editar</button>
              <button @click="deleteUser(user)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      <h2>Empresas</h2>
      <input v-model="companyFilter" placeholder="Buscar por nombre o email..." />
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
              <button @click="editUser(user)">Editar</button>
              <button @click="deleteUser(user)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
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


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

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

async function fetchUsers() {
  const { data } = await api.get('/api/admin/users')
  devs.value = data.filter(u => u.role === 'dev')
  companies.value = data.filter(u => u.role === 'company')
}



async function editUser(user) {
  if (tab.value === 'companies') {
    // Cargar datos de la empresa
    try {
      const { data } = await api.get(`/api/admin/companies/${user.id}`)
      editCompanyData.value = { ...data }
      showEditCompanyModal.value = true
    } catch (e) {
      alert('Error al cargar los datos de la empresa')
    }
  } else {
    // Developer
    try {
      const { data } = await api.get(`/api/admin/users/${user.id}`)
      editUserData.value = { ...data }
      showEditModal.value = true
    } catch (e) {
      alert('Error al cargar los datos del usuario')
    }
  }
}

function closeEditModal() {
  showEditModal.value = false
  editUserData.value = {}
}

async function saveEdit() {
  try {
    await api.put(`/api/admin/users/${editUserData.value.id}`, editUserData.value)
    showEditModal.value = false
    fetchUsers()
    alert('Usuario editado correctamente')
  } catch (e) {
    alert('Error al guardar los cambios')
  }
}

function closeEditCompanyModal() {
  showEditCompanyModal.value = false
  editCompanyData.value = {}
}

async function saveEditCompany() {
  try {
    await api.put(`/api/admin/companies/${editCompanyData.value.id}`, editCompanyData.value)
    showEditCompanyModal.value = false
    fetchUsers()
    alert('Empresa editada correctamente')
  } catch (e) {
    alert('Error al guardar los cambios')
  }
}

async function deleteUser(user) {
  if (tab.value === 'companies') {
    if (confirm(`¿Eliminar empresa ${user.email}?`)) {
      try {
        await api.delete(`/api/admin/companies/${user.id}`)
        fetchUsers()
        alert('Empresa eliminada correctamente')
      } catch (e) {
        alert('Error al eliminar la empresa')
      }
    }
  } else {
    if (confirm(`¿Eliminar usuario ${user.email}?`)) {
      try {
        await api.delete(`/api/admin/users/${user.id}`)
        fetchUsers()
        alert('Usuario eliminado correctamente')
      } catch (e) {
        alert('Error al eliminar el usuario')
      }
    }
  }
}


async function logout() {
  try {
    await api.post('/api/auth/logout')
    router.push({ name: 'admin-login' })
  } catch (e) {
    alert('Error al cerrar sesión')
  }
}


onMounted(fetchUsers)
</script>

<style scoped>
.admin-profile {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
}
.tabs {
  margin-bottom: 2rem;
}
.tabs button {
  margin-right: 1rem;
  padding: 0.5rem 1.5rem;
  border: none;
  background: #eee;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
}
.tabs button.active {
  background: #1976d2;
  color: #fff;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #0008;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  min-width: 320px;
  max-width: 90vw;
}
.modal-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.logout-btn {
  float: right;
  margin-top: -2.5rem;
  margin-bottom: 1rem;
  background: #c00;
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
}
.logout-btn:hover {
  background: #a00;
}

</style>