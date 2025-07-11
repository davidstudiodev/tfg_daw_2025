<template>

  <!-- Contenedor de ofertas -->
  <div class="offers-container">

    <div style="width:100%; text-align:left;">
      <AppLogo @click="$router.push('/')" style="cursor:pointer" color="white" />
    </div>
    <div class="offers-header" v-if="!isLoggedIn">
      <router-link to="/login?role=dev" class="auth-btn">Login</router-link>
      <router-link to="/register?role=dev" class="auth-btn">Register</router-link>
    </div>
    <div class="offers-header" v-else-if="isLoggedIn">
      <button class="auth-btn" @click="goToProfile">Volver a mi perfil</button>
    </div>
    <h1>Las mejores empresas en un solo lugar</h1>
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

        <h2 class="offer-title">{{ offer.position }}</h2>
        <div class="offer-details">
          <div class="detail-row">
            <span class="material-icons-outlined">location_on</span>
            <span>{{ offer.company_location }}</span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">schedule</span>
            <span>{{ offer.work_time }}</span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">attach_money</span>
            <span>{{ offer.salary }}</span>
          </div>
          <div class="detail-row">
            <span class="material-icons-outlined">code</span>
            <span>
              {{ offer.tech_stack && offer.tech_stack.length ? offer.tech_stack.flatMap(sec => sec.items).join(', ') : 'Ninguna' }}
            </span>
          </div>
        </div>


        <div class="card-actions">
          <button
            v-if="canApply"
            @click="applyToOffer(offer)"
            class="apply-btn"
            :disabled="appliedOffers.includes(offer.id)"
          >
            {{ appliedOffers.includes(offer.id) ? 'Ya aplicaste' : 'Aplicar' }}
          </button>
          <router-link
            v-else-if="!isLoggedIn"
            to="/login?role=dev"
            class="apply-btn"
          >Inicia sesión para aplicar</router-link>
        </div>
      </div>
    </div>
    
    <div class="pagination">
      <button @click="prevPage" :disabled="page === 1"><span class="material-icons-outlined">arrow_back_ios</span></button>
      <span>Página {{ page }} de {{ pages }}</span>
      <button @click="nextPage" :disabled="page === pages"><span class="material-icons-outlined">arrow_forward_ios</span></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppLogo from '../components/AppLogo.vue';
import api from '../services/api.js';
import { getMe } from '../services/auth.js';

import { useToast } from "vue-toastification";
const toast = useToast();

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
  offers.value = data.offers.map(o => ({ ...o, position: o.position || o.description }));
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

// Verifica si el usuario está autenticado y su rol
const userRole = ref(null);

const checkAuth = async () => {
  try {
    const { data } = await getMe();
    isLoggedIn.value = true;
    userRole.value = data.role;
    canApply.value = data.role === 'dev';
    if (canApply.value) await fetchAppliedOffers();
  } catch {
    isLoggedIn.value = false;
    canApply.value = false;
    appliedOffers.value = [];
    userRole.value = null;
  }
};


const goToProfile = () => {
  if (userRole.value === 'dev') router.push({ name: 'dev-profile' });
  else if (userRole.value === 'company') router.push({ name: 'company-profile' });
  else if (userRole.value === 'admin') router.push({ name: 'admin-profile' });
};

// Aplica a una oferta
async function applyToOffer(offer) {
  try {
    await api.post(`/api/offers/${offer.id}/apply`);
    toast.info('Has aplicado correctamente y te contactaremos pronto.');
    await fetchAppliedOffers(); // Actualiza la lista tras aplicar
  } catch (e) {
    toast.error(e.response?.data?.message || 'Error al aplicar a la oferta.');
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

<style lang="scss" scoped>


.offers-container {
  position: relative;
  width: 100vw;
  height: auto;
  max-width: auto;
  padding: 2rem 1rem;
  background: var(--black);
  color: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
h1 {
  color: var(--white);
  font-size: 2.2rem;
  margin-bottom: 2rem;
  font-weight: 600;
}

.offers-header {
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
}

.auth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: transparent;
  color: var(--green-light);
  border: 1px solid var(--green-light);
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  text-decoration: none;
}
.auth-btn:hover {
  background: var(--green-light);
  color: var(--black);
  border-color: var(--green-light);
}

.apply-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--green-light);
  color: var(--black);
  border: 1px solid var(--green-light);
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  text-decoration: none;
}
.apply-btn:hover {
  background: var(--black);
  color: var(--white);
  border-color: var(--black);
}

.apply-btn[disabled], .apply-btn:disabled {
  background: #aaa !important;
  color: #fff !important;
  cursor: not-allowed;
  border-color: #aaa !important;
}

.filters {
  width: 80%;
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


.offers-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 80%;
}

.offer-card {
  border-radius: 18px;
  padding: 1.5rem;
  background: var(--white);
  color: var(--black);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  gap: 0.7rem;
  min-height: 400px;
  width: auto;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  margin-right: 0.2rem;
  margin-bottom: 0.2rem;
}

.apply-btn {
  width: 100%;
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
  border: 1px solid var(--green-light);
  background: var(--white);
}

.company-name {
  color: var(--black);
  font-size: 1rem;
}

.offer-title {
  width: 80%;
  font-size: 32px;
  color: var(--black);
  font-weight: 600;
  margin: 0.5rem 0 1rem 0;
  line-height: 1;
  word-break: break-word;
}

.offer-details {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: var(--black);
  font-size: 15px;
}

.detail-row .material-icons-outlined {
  color: var(--black);
  font-size: 20px;
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
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.material-icons-outlined {
  font-size: 16px;
}

.pagination button:disabled {
  background: #aaa !important;
  color: #fff !important;
  cursor: not-allowed;
  border-color: #aaa !important;
}


// Responsive styles

@media (max-width: 900px) {
  .offers-container {
    padding: 1.5rem 0.5rem;
    width: 100vw;
  }
  h1 {
    text-align: center;
    font-size: 1.8rem;
    margin-top: 4rem;
    margin-bottom: 2rem;
    line-height: 1;
    width: 80%;
  }

  .offers-header {
    position: absolute;
    top: 32px;
    right: 32px;
    display: flex;
    gap: 1rem;
    z-index: 100;
  }

  .offers-header .auth-btn {
    min-width: 120px;
    padding: 0.5rem 1.2rem;
    font-size: 1rem;
  }

  .filters {
    flex-direction: column;
    gap: 0.7rem;
    align-items: stretch;
    justify-content: flex-start;
    margin-bottom: 1.5rem;
    width: 80%;
  }
  .offers-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .offer-card {
    min-height: 320px;
    padding: 1.5rem;
    border-radius: 12px;
  }
  .offer-title {
    font-size: 1.2rem;
    width: 100%;
  }
  .company-logo {
    width: 32px;
    height: 32px;
  }
  .card-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
    margin-right: 0.2rem;
    margin-bottom: 0.2rem;
    width: 100%;
  }
  .pagination {
    margin-top: 1.2rem;
    gap: 0.5rem;
  }
}

@media (max-width: 600px) {
  .offers-container {
    padding: 0.5rem 0;
    border-radius: 0;
  }
  .offers-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  h1 {
    text-align: center;
    font-size: 1.8rem;
    margin-top: 4rem;
    margin-bottom: 2rem;
    line-height: 1;
    width: 80%;
  }

  .filters {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
    margin-bottom: 1rem;
  }
  .offers-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .offer-card {
    min-height: 0;
    padding: 1.5rem;
    border-radius: 15px;
  }
  .offer-title {
    font-size: 1.5rem;
    width: 100%;
  }
  .company-logo {
    width: 28px;
    height: 28px;
  }
  .card-actions {
    margin-top: 0.7rem;
  }
  .pagination {
    margin-top: 1rem;
    gap: 0.3rem;
    font-size: 0.95rem;
  }
}

</style>
