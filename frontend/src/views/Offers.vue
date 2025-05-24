<template>
  <div class="offers-container">
    <AppLogo />
    <div class="offers-header" v-if="!isLoggedIn">
      <router-link to="/login?role=dev" class="auth-btn">Login</router-link>
      <router-link to="/register?role=dev" class="auth-btn">Register</router-link>
    </div>
    <div class="offers-header" v-else-if="canApply">
      <button class="auth-btn" @click="goToProfile">Volver a mi perfil</button>
    </div>
    <div class="offers-header" v-else-if="isLoggedIn">
      <button class="auth-btn" @click="goToCompanyProfile">Volver a mi perfil</button>
    </div>
    <h1>Ofertas publicadas</h1>
    <div class="filters">
      <input v-model="filters.location" placeholder="Ubicación" @input="fetchOffers" />
      <select v-model="filters.work_time" @change="fetchOffers">
        <option value="">Jornada</option>
        <option value="completa">Completa</option>
        <option value="parcial">Parcial</option>
        <option value="practicas">Prácticas</option>
      </select>
      <input v-model.number="filters.salaryMin" type="number" min="0" placeholder="Salario mínimo" @input="fetchOffers" />
      <input v-model.number="filters.salaryMax" type="number" min="0" placeholder="Salario máximo" @input="fetchOffers" />
      <select v-model="filters.salaryOrder" @change="fetchOffers">
        <option value="desc">Salario: Mayor a menor</option>
        <option value="asc">Salario: Menor a mayor</option>
      </select>
    </div>
    <div class="offers-grid">
      <div v-for="offer in offers" :key="offer.id" class="offer-card">
        <div class="company-info">
          <img v-if="offer.company_avatar" :src="offer.company_avatar" class="company-logo" alt="logo" />
          <span class="company-name">{{ offer.company_name }}</span>
        </div>
        <!-- Mostrar puesto en vez de description en la lista de ofertas -->
        <p class="offer-description">{{ offer.puesto }}</p>
        <p><strong>Ubicación:</strong> {{ offer.company_location }}</p>
        <p><strong>Jornada:</strong> {{ offer.work_time }}</p>
        <p><strong>Salario:</strong> {{ offer.salary }}</p>
        <p><strong>Tecnologías:</strong> {{ offer.tech_stack && offer.tech_stack.length ? offer.tech_stack.flatMap(sec => sec.items).join(', ') : 'Ninguna' }}</p>
        <button
          v-if="canApply"
          @click="applyToOffer(offer)"
          class="apply-btn"
          :disabled="appliedOffers.includes(offer.id)"
        >
          {{ appliedOffers.includes(offer.id) ? 'Ya aplicaste' : 'Aplicar' }}
        </button>
        <router-link v-else-if="!isLoggedIn" to="/login?role=dev" class="apply-btn">Inicia sesión para aplicar</router-link>
      </div>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="page === 1">Anterior</button>
      <span>Página {{ page }} de {{ pages }}</span>
      <button @click="nextPage" :disabled="page === pages">Siguiente</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppLogo from '../components/AppLogo.vue';
import api from '../services/api.js';
import { getMe } from '../services/auth.js';
import { getDevProfile } from '../services/profile.js';

const offers = ref([]);
const page = ref(1);
const pages = ref(1);
const isLoggedIn = ref(false);
const canApply = ref(false);
const appliedOffers = ref([]); // IDs de ofertas a las que el dev ya aplicó
const router = useRouter();

const filters = ref({
  location: '',
  work_time: '',
  salaryMin: '',
  salaryMax: '',
  salaryOrder: 'desc',
});

const fetchOffers = async () => {
  let query = `/api/offers?page=${page.value}&limit=6`;
  if (filters.value.location) query += `&location=${encodeURIComponent(filters.value.location)}`;
  if (filters.value.work_time) query += `&work_time=${filters.value.work_time}`;
  if (filters.value.salaryMin !== '') query += `&salaryMin=${filters.value.salaryMin}`;
  if (filters.value.salaryMax !== '') query += `&salaryMax=${filters.value.salaryMax}`;
  if (filters.value.salaryOrder) query += `&salaryOrder=${filters.value.salaryOrder}`;
  const { data } = await api.get(query);
  // Si alguna oferta viene con description, mapear a puesto
  offers.value = data.offers.map(o => ({ ...o, puesto: o.puesto || o.description }));
  pages.value = data.pages;
};

const fetchAppliedOffers = async () => {
  try {
    const { data } = await api.get('/api/dev/applications');
    appliedOffers.value = data.map(app => app.id || app.offer_id || app.application_id || app.job_id || app.jobId || app.id);
  } catch {
    appliedOffers.value = [];
  }
};

const checkAuth = async () => {
  try {
    const { data } = await getMe();
    isLoggedIn.value = true;
    canApply.value = data.role === 'dev';
    if (canApply.value) await fetchAppliedOffers();
  } catch {
    isLoggedIn.value = false;
    canApply.value = false;
    appliedOffers.value = [];
  }
};

const goToProfile = () => {
  router.push({ name: 'dev-profile' });
};

const goToCompanyProfile = () => {
  router.push({ name: 'company-profile' });
};

async function applyToOffer(offer) {
  try {
    await api.post(`/api/offers/${offer.id}/apply`);
    alert('Has aplicado correctamente y te contactaremos pronto.');
    await fetchAppliedOffers(); // Actualiza la lista tras aplicar
  } catch (e) {
    alert(e.response?.data?.message || 'Error al aplicar a la oferta.');
  }
}

function nextPage() {
  if (page.value < pages.value) {
    page.value++;
    fetchOffers();
  }
}
function prevPage() {
  if (page.value > 1) {
    page.value--;
    fetchOffers();
  }
}

onMounted(() => {
  fetchOffers();
  checkAuth();
});
</script>

<style scoped>
.offers-container {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 1rem;
}
.offers-header {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;
}
.auth-btn {
  background: #1976d2;
  color: #fff;
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}
.filters input, .filters select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.offers-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.offer-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.company-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.company-logo {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}
.company-name {
  font-weight: bold;
  font-size: 1.1rem;
}
.offer-description {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
.apply-btn {
  background: #43a047;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
}
.apply-btn[disabled], .apply-btn:disabled {
  background: #aaa !important;
  color: #fff !important;
  cursor: not-allowed;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}
</style>
