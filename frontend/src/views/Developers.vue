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
    <div class="dev-cards">
      <div v-for="dev in developers" :key="dev.id" class="dev-card">
        <img v-if="dev.avatar" :src="dev.avatar" alt="Avatar" class="avatar" />
        <div class="dev-info">
          <h2>{{ dev.name }}</h2>
          <p><strong>Profesión:</strong> {{ dev.profession }}</p>
          <p><strong>Experiencia:</strong> {{ dev.years_experience }} años</p>
          <p><strong>Ubicación:</strong> {{ dev.location }}</p>
          <p><strong>Descripción:</strong> {{ dev.description }}</p>
          <div v-if="dev.tech_stack && dev.tech_stack.length">
            <strong>Tecnologías:</strong>
            <ul>
              <li v-for="section in dev.tech_stack" :key="section.category">
                <span>{{ section.category }}:</span>
                <span>{{ section.items.join(', ') }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-if="totalPages > 1" class="pagination">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Siguiente</button>
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

onMounted(async () => {
  await checkAuth()
  await loadDevelopers()
})

</script>

<style scoped>
.developers-list {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}
.dev-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.dev-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
  padding: 1.5rem;
  min-width: 0;
  display: flex;
  gap: 1rem;
  flex-direction: column;
}
.pagination {
  margin: 2rem 0 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}
.dev-info {
  flex: 1;
}
.developers-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.auth-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  padding: 0.5em 1.2em;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}
.auth-btn:hover {
  background: #125ea7;
}
</style>