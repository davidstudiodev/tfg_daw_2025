<template>
  <div class="developers-list">

    <AppLogo @click="$router.push('/')" style="cursor:pointer" />

    <div class="developers-header" v-if="!isLoggedIn">
        <router-link to="/login?role=dev" class="auth-btn">Login</router-link>
        <router-link to="/register?role=dev" class="auth-btn">Registro</router-link>
    </div>
    <div class="developers-header" v-else>
        <button class="auth-btn" @click="goToProfile">Ir a perfil</button>
    </div>

    <h1>Desarrolladores</h1>

    <div class="filters">
        <input v-model="filterName" placeholder="Buscar por nombre..." />
        <input v-model="filterProfession" placeholder="Profesión..." />
        <input v-model="filterLocation" placeholder="Ubicación..." />
    </div>

    <div v-if="loading">Cargando...</div>
    <div v-else-if="developers.length === 0">No hay developers registrados.</div>
    
    <!-- Lista de Developers -->
    <div class="dev-cards">
      <div v-for="dev in developers" :key="dev.id" class="dev-card">
        <div class="dev-header">
          <img v-if="dev.avatar" :src="dev.avatar" alt="Avatar" class="avatar" />
          <span class="dev-name">{{ dev.name }}</span>
        </div>
        <div class="dev-details">
          <div class="detail-row">
            <span class="material-icons-outlined">description</span>
            <span>{{ dev.description }}</span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">work</span>
            <span>{{ dev.profession }}</span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">history_edu</span>
            <span>{{ dev.years_experience }} año/s de experiencia</span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">location_on</span>
            <span>{{ dev.location }}</span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">code</span>
            <span>
              <template v-if="dev.tech_stack && dev.tech_stack.length">
                {{ dev.tech_stack.flatMap(sec => sec.items).join(', ') }}
              </template>
              <template v-else>
                Ninguna
              </template>
            </span>
          </div>
        </div>
        <div class="card-actions">
          <button class="apply-btn" @click="openModal(dev)">Ver perfil</button>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="pagination">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
        <span class="material-icons-outlined">arrow_back_ios</span>
      </button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
        <span class="material-icons-outlined">arrow_forward_ios</span>
      </button>
    </div>

    <!-- Modal de perfil de developer -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">
          <span class="material-icons-outlined">close</span>
        </button>
        <div class="dev-header">
          <img v-if="selectedDev.avatar" :src="selectedDev.avatar" alt="Avatar" class="avatar" />
          <span class="dev-name">{{ selectedDev.name }}</span>
        </div>
        <div class="dev-details">
          <div class="detail-row">
            <span class="material-icons-outlined">description</span>
            <span>{{ selectedDev.description }}</span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">work</span>
            <span>{{ selectedDev.profession }}</span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">history_edu</span>
            <span>{{ selectedDev.years_experience }} año/s de experiencia</span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">location_on</span>
            <span>{{ selectedDev.location }}</span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">code</span>
            <span>
              <template v-if="selectedDev.tech_stack && selectedDev.tech_stack.length">
                {{ selectedDev.tech_stack.flatMap(sec => sec.items).join(', ') }}
              </template>
              <template v-else>
                Ninguna
              </template>
            </span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">email</span>
            <span>{{ selectedDev.email }}</span>
          </div>
        </div>
        <div class="card-actions" style="justify-content: flex-end;">
          <a
            class="apply-btn"
            :href="`mailto:${selectedDev.email}?subject=Contacto%20desde%20JobsXDevs`"
            target="_blank"
            rel="noopener"
          >Contactar</a>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue'
import api from '../services/api.js'
import { useRouter } from 'vue-router'
import AppLogo from '../components/AppLogo.vue'
import { getMe } from '../services/auth.js'

const router = useRouter()
const isLoggedIn = ref(false)
const userRole = ref('')

async function checkAuth() {
  try {
    const { data } = await getMe()
    isLoggedIn.value = true
    userRole.value = data.role
  } catch {
    isLoggedIn.value = false
    userRole.value = ''
  }
}

const developers = ref([])
const loading = ref(true)
const currentPage = ref(1)
const perPage = 6

const filterName = ref('')
const filterProfession = ref('')
const filterLocation = ref('')

const totalPages = ref(1)
const totalDevelopers = ref(0)

// Función para cargar los desarrolladores
async function loadDevelopers() {
  loading.value = true
  try {
    const { data } = await api.get('/api/dev/all', {
      params: {
        page: currentPage.value,
        limit: perPage,
        name: filterName.value,
        profession: filterProfession.value,
        location: filterLocation.value
      }
    })
    developers.value = data.developers
    totalPages.value = data.totalPages
    totalDevelopers.value = data.total
  } catch {
    developers.value = []
    totalPages.value = 1
    totalDevelopers.value = 0
  } finally {
    loading.value = false
  }
}

import { watch } from 'vue'

watch([filterName, filterProfession, filterLocation], () => {
  currentPage.value = 1
  loadDevelopers()
})

// Función para redirigir al perfil del usuario
function goToProfile() {
  if (userRole.value === 'dev') router.push({ name: 'dev-profile' })
  else if (userRole.value === 'company') router.push({ name: 'company-profile' })
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadDevelopers()
  }
}

// Logica del modal de perfil de developer
const showModal = ref(false)
const selectedDev = ref({})

function openModal(dev) {
  selectedDev.value = dev
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}

onMounted(async () => {
  await checkAuth()
  await loadDevelopers()
})

</script>

<style lang="scss" scoped>

.developers-list {
  position: relative;
  max-width: 1100px;
  margin: 2rem auto;
  padding: 2rem 1rem;
  background: var(--black);
  border-radius: 18px;
  box-shadow: 0 2px 12px #0002;
  color: var(--white);
}

.developers-header {
  position: absolute;
  top: 32px;
  right: 32px;
  display: flex;
  gap: 1rem;
  z-index: 100;
}

.auth-btn {
  min-width: 130px;
  width: auto;
  padding: 0.6rem 1.5rem;
  justify-content: center;
  display: flex;
  align-items: center;
  background: var(--green-light);
  color: var(--black);
  border: 1px solid var(--green-light);
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.auth-btn:hover {
  background: transparent;
  color: var(--green-light);
  border-color: var(--green-light);
}

h1 {
  color: var(--green-light);
  font-size: 2.2rem;
  margin-bottom: 2rem;
  font-weight: 600;
}

.filters {
  width: 100%;
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  justify-content: flex-start;
}

.filters input,
.filters select {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--white);
  background: transparent;
  color: var(--white);
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
  min-width: 140px;
}

.filters input:focus,
.filters select:focus {
  border: 1px solid var(--green-light);
}

.dev-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.dev-card {
  border: 1px solid var(--green-light);
  border-radius: 18px;
  padding: 1.5rem;
  background: var(--black);
  color: var(--white);
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  box-shadow: 0 2px 8px #0002;
  min-height: 400px;
}

.dev-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.dev-name {
  font-size: 2rem;
  color: var(--green-light);
  font-weight: 600;
  line-height: 1;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--green-light);
  background: var(--smoke);
  margin-bottom: 0.5rem;
}

.dev-info h2 {
  color: var(--green-light);
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.dev-info p {
  margin: 0.2rem 0;
  color: var(--white);
  font-size: 1rem;
}

.dev-info ul {
  margin: 0.5rem 0 0 0;
  padding: 0;
  list-style: none;
}

.dev-info li {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  color: var(--white);
  font-size: 0.98rem;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  margin-right: 0.2rem;
  margin-bottom: 0.2rem;
}

.apply-btn {
  min-width: 130px;
  width: auto;
  padding: 0.6rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--green-light);
  color: var(--black);
  border: 1px solid var(--green-light);
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  text-decoration: none;
}
.apply-btn:hover {
  background: transparent;
  color: var(--green-light);
  border-color: var(--green-light);
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-content {
  background: var(--black);
  color: var(--white);
  padding: 2rem;
  border-radius: 20px;
  min-width: 320px;
  max-width: 500px;
  height: 400px;
  width: 100%;
  border: 1px solid var(--green-light);
  box-shadow: 0 2px 12px #0002;
  position: relative;
  display: flex;
  flex-direction: column;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: -30px;
  background: transparent;
  border: none;
  color: var(--green-light);
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: var(--white);
  font-size: 15px;
  line-height: 1.3;
}

.detail-row .material-icons-outlined {
  color: var(--green-light);
  font-size: 20px;
  min-width: 22px;
  margin-top: 1px;
  vertical-align: middle;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination button {
  background: var(--green-light);
  color: var(--black);
  border: 1px solid var(--green-light);
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.pagination button:disabled {
  background: #aaa !important;
  color: #fff !important;
  cursor: not-allowed;
  border-color: #aaa !important;
}

.pagination .material-icons-outlined {
  font-size: 16px;
}


// Responsive styles

@media (max-width: 900px) {
  .developers-list {
    margin: 50px;
    padding: 1.5rem 0.5rem;
    border-radius: 12px;
  }
  .developers-header {
    position: static;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.7rem;
    margin-bottom: 1rem;
    top: unset;
    right: unset;
  }
  .auth-btn {
    min-width: 120px;
    padding: 0.5rem 1.2rem;
    font-size: 1rem;
  }
  h1 {
    text-align: center;
    font-size: 1.7rem;
    margin-top: 2.5rem;
    margin-bottom: 1.5rem;
  }
  .filters {
    flex-direction: column;
    gap: 0.7rem;
    align-items: stretch;
    margin-bottom: 1.5rem;
  }
  .dev-cards {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .dev-card {
    min-height: 320px;
    padding: 1rem;
    border-radius: 12px;
  }
  .dev-header {
    gap: 0.7rem;
  }
  .dev-name {
    font-size: 1.2rem;
  }
  .avatar {
    width: 48px;
    height: 48px;
  }
  .card-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
    margin-right: 0.2rem;
    margin-bottom: 0.2rem;
  }
  .pagination {
    margin-top: 1.2rem;
    gap: 0.5rem;
  }
  .modal-content {
    min-width: 220px;
    max-width: 80vw;
    height: auto;
    padding: 1rem;
  }
}

@media (max-width: 600px) {
  .developers-list {
    padding: 0.5rem 0;
    border-radius: 0;
  }
  .developers-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  h1 {
    text-align: center;
    font-size: 2.2rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  .filters {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
    margin-bottom: 1rem;
  }
  .dev-cards {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }
  .dev-card {
    min-height: 0;
    padding: 0.8rem;
    border-radius: 10px;
  }
  .dev-header {
    gap: 0.5rem;
  }
  .dev-name {
    font-size: 1.1rem;
  }
  .avatar {
    width: 38px;
    height: 38px;
  }
  .card-actions {
    margin-top: 0.7rem;
  }
  .pagination {
    margin-top: 1rem;
    gap: 0.3rem;
    font-size: 0.95rem;
  }
  .modal-content {
    min-width: 120px;
    max-width: 80vw;
    height: auto;
    padding: 0.7rem;
  }
}

</style>