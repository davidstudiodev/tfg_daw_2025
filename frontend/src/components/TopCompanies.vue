<template>
  <section class="top-companies">
    <div class="top-companies-content">
      <h2>
        Las mejores <span class="highlight">ofertas</span> en un solo lugar
      </h2>
      <div class="companies-cards">
        <div
          v-for="offer in offers"
          :key="offer.id"
          class="offer-card"
        >
          <div class="company-info">
            <img v-if="offer.company_avatar" :src="offer.company_avatar" class="company-logo" alt="logo" />
            <span class="company-name">{{ offer.company_name }}</span>
          </div>
          <h1 class="offer-title">{{ offer.position }}</h1>
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
            <router-link to="/offers" class="offer-btn">Ver más ofertas</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'

const offers = ref([])

onMounted(async () => {
  const { data } = await api.get('/api/offers?limit=3&sort=featured')
  offers.value = data.offers.slice(0, 3)
})
</script>

<style scoped>
.top-companies {
  width: 100%;
  background: var(--black);
  border-top-left-radius: 60px;
  border-top-right-radius: 60px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 420px;
}

.top-companies-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.top-companies h2 {
  color: var(--white);
  font-size: 2.5rem;
  font-weight: 500;
  margin-bottom: 4rem;
  text-align: center;
}

.top-companies .highlight {
  color: var(--green-light);
}

.companies-cards {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: stretch;
  width: 100%;
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
  min-width: 300px;
  max-width: 340px;
  flex: 1 1 0;
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
  background: var(--smoke);
}

.company-name {
  color: var(--black);
  font-size: 1rem;
}

.offer-title {
  width: 80%;
  font-size: 1.5rem;
  color: var(--black);
  font-weight: 600;
  margin: 0.5rem 0 1rem 0;
  line-height: 1;
  word-break: break-word;
  text-align: left;
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
  text-align: left;
}

.detail-row .material-icons-outlined {
  color: var(--black);
  font-size: 20px;
}

.offer-btn {
  margin-top: auto;
  margin-bottom: 0.8rem;
  display: inline-block;
  padding: 0.6em 1.5em;
  border-radius: 50px;
  background: var(--green-light);
  color: var(--black);
  font-weight: 400;
  font-size: 1rem;
  border: 1px solid var(--green-light);
  text-decoration: none;
  text-align: center;
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
}
.offer-btn:hover {
  background: var(--black);
  color: var(--white);
  border: 1.5px solid var(--black);
}

@media (max-width: 900px) {
  .top-companies-content {
    padding: 4rem;
  }
  .top-companies h2 {
    font-size: 2rem;
    line-height: 1;
  }
  .companies-cards {
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }
  .offer-card {
    min-width: 0;
    max-width: 100%;
    width: 100%;
    padding: 1rem;
    border-radius: 12px;
  }
}
</style>