<template>
  <section class="skills-showcase top-tech">
    <div class="skills-bg"></div>
    <div class="skills-content">
      <div class="skills-left">
        <div class="top-tech-title">TOP TECH</div>
        <h2>Tecnologías que <span class="highlight">dominan</span> el mercado</h2>
      </div>
      <div class="skills-right">
        <ol class="top-tech-list">
          <li v-for="(tech, i) in topTechs" :key="tech.name">
            <span class="tech-rank">{{ i + 1 }}</span>
            <span class="tech-name">{{ tech.name }}</span>
            <span class="tech-count">+{{ tech.count }}</span>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'

const topTechs = ref([])

onMounted(async () => {
  // Obtener todas las ofertas
  const { data } = await api.get('/api/offers?limit=1000')
  const offers = data.offers || []

  // Contar tecnologías
  const techCount = {}
  offers.forEach(offer => {
    if (Array.isArray(offer.tech_stack)) {
      offer.tech_stack.forEach(section => {
        if (Array.isArray(section.items)) {
          section.items.forEach(tech => {
            techCount[tech] = (techCount[tech] || 0) + 1
          })
        }
      })
    }
  })

  // Ordenar y tomar top 5
  topTechs.value = Object.entries(techCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})
</script>

<style scoped>
.top-tech .skills-bg {
  background: var(--white);
}

.top-tech .skills-content {
  padding: 2.5rem;
  background: var(--white);
  display: flex;
  justify-content: space-around;
}

.top-tech .skills-left {
  display: flex;
  flex-direction: column;
  width: 30%;
  align-content: center;
  justify-content: center;
  text-align: left;
}

.top-tech-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--green-light);
  letter-spacing: 0.15em;
  margin-bottom: 0.5rem;
}

.top-tech .skills-left h2 {
  font-size: 3rem;
  font-family: 'Red Hat Text', sans-serif;
  font-weight: 500;
  color: var(--black);
  line-height: 1;
  margin: 0;
  text-align: left;
}

.top-tech .highlight {
  color: var(--green-light);
}

.top-tech .skills-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.top-tech-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 400px;
  background: var(--black);
  border-radius: 24px 24px 0px 0px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: flex-end;
  padding: 2rem 2.5rem;
  position: relative;
  bottom: -40px;
}

.top-tech-list li {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--black);
  width: 100%;
  justify-content: flex-end;
}

.tech-rank {
  font-size: 1rem;
  font-weight: 800;
  color: var(--green-light);
  margin-right: 0.7rem;
  min-width: 32px;
  text-align: right;
}

.tech-name {
  flex: 1 1 0;
  font-weight: 600;
  color: var(--white);
}

.tech-count {
  font-size: 1rem;
  color: var(--green-light);
  font-weight: 400;
  margin-left: 1rem;
}

@media (max-width: 900px) {
  .top-tech .skills-content {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 0.5rem;
  }
  .top-tech .skills-left {
    width: 100%;
    align-items: center;
    text-align: center;
  }
  .top-tech .skills-left h2 {
    font-size: 2rem;
    text-align: center;
  }
  .top-tech-list {
    width: 90vw;
    max-width: 350px;
    padding: 1.5rem 1.2rem;
    align-items: center;
    margin: 0 auto;
    bottom: -25px;
  }
  .top-tech-list li {
    font-size: 1.1rem;
    gap: 0.7rem;
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .top-tech .skills-showcase {
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    padding-top: 1.2rem;
    padding-bottom: 1.2rem;
  }
  .top-tech .skills-left h2 {
    font-size: 2rem;
    line-height: 1;
    text-align: center;
  }
  .top-tech-list {
    width: 98vw;
    max-width: 320px;
    gap: 0.7rem;
    padding: 1.5rem 1.2rem;
    border-radius: 18px 18px 0 0;
  }
}
</style>