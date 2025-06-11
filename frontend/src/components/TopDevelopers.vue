<template>
  <section class="top-companies">
    <div class="top-companies-content">
      <h2>
        Conecta con los <span class="highlight">dev’s</span> que destacan.
      </h2>
      <div class="companies-cards">
        <div
          v-for="dev in developers"
          :key="dev.id"
          class="offer-card"
        >
          <div class="company-info">
            <img v-if="dev.avatar" :src="dev.avatar" class="company-logo" alt="avatar" />
            <span class="company-name">{{ dev.name }}</span>
          </div>
          <h1 class="offer-title">{{ dev.profession }}</h1>
          <div class="offer-details">
            <div class="detail-row">
              <span class="material-icons-outlined">location_on</span>
              <span>{{ dev.location || 'Remoto' }}</span>
            </div>
            <div class="detail-row">
              <span class="material-icons-outlined">email</span>
              <span>{{ dev.email }}</span>
            </div>
            <div class="detail-row">
              <span class="material-icons-outlined">code</span>
              <span>
                {{ dev.tech_stack && dev.tech_stack.length ? dev.tech_stack.flatMap(sec => sec.items).join(', ') : 'Sin stack' }}
              </span>
            </div>
          </div>
            <router-link to="/developers" class="dev-btn">Ver más devs</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'

const developers = ref([])

onMounted(async () => {
  const { data } = await api.get('/api/dev/all')
  developers.value = data.developers ? data.developers.slice(0, 3) : []
})
</script>

<style scoped>

.top-companies {
  width: 100%;
  background: var(--white);
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
  color: var(--black);
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
  background: var(--black);
  color: var(--white);
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
  background: var(--white);
  border: none;
}

.company-name {
  color: var(--white);
  font-size: 1rem;
}

.offer-title {
  width: 80%;
  font-size: 1.5rem;
  color: var(--white);
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
  color: var(--white);
  font-size: 15px;
  text-align: left;
}

.detail-row .material-icons-outlined {
  color: var(--white);
  font-size: 20px;
}

.dev-btn {
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
.dev-btn:hover {
  background: var(--black);
  color: var(--green-light);
  border: 1.5px solid var(--green-light);
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