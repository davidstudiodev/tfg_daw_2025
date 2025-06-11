<template>
  <section class="company-stats">
    <div class="stats-content">
      <div class="stats-left">
        <div class="stat-block">
          <div class="stat-number">+500</div>
          <div class="stat-desc">desarrolladores registrados en todo el mundo</div>
        </div>
        <div class="stat-block">
          <div class="stat-number">82%</div>
          <div class="stat-desc">de las empresas encuentra su primer candidato en menos de una semana</div>
        </div>
      </div>
      <div class="stats-right">
        <!-- Aquí coloca tu ilustración SVG -->
        <img :src="worldImg" alt="Ilustración" class="stats-illustration" />
      </div>
    </div>
  </section>
</template>


<script setup>
import worldImg from '../assets/world-jobsxdevs.svg'
</script>


<style scoped>
.company-stats {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  background: var(--black, #181a1b);
  border-top-left-radius: 60px;
  border-top-right-radius: 60px;
  padding: 0 4rem 0 3rem;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  min-height: 350px;
  z-index: 1;
}

.stats-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 3rem;
  padding: 0rem 3rem 0rem 3rem;
  
}

.stats-left {
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  flex: 1 1 0;
}

.stat-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
}

.stat-number {
  color: var(--green-light, #c4f63f);
  font-size: 4rem;
  font-family: 'Red Hat Text', sans-serif;
  font-weight: 500;
  line-height: 1;
}

.stat-desc {
  color: var(--white, #fff);
  font-size: 1.3rem;
  font-family: 'Red Hat Text', sans-serif;
  font-weight: 300;
  line-height: 1.2;
  max-width: 320px;
}

.stats-right {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  height: 100%;
}

.stats-illustration {
  max-width: 450px;
  width: 100%;
  height: auto;
  display: block;
}

/* Tablet */
@media (max-width: 900px) {
  .company-stats {
    padding: 0 2.5rem 0 2.5rem;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
  }
  .stats-content {
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }
  .stats-left {
    flex-direction: row;
    gap: 2rem;
    justify-content: center;
    width: 100%;
  }
  .stat-block {
    align-items: center;
    text-align: center;
    gap: 0.5rem;
    max-width: 220px;
  }
  .stats-right {
    margin-top: 1.5rem;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .company-stats {
    padding: 0 1.5rem 0 1.5rem;
  }
  .stats-content {
    flex-direction: column;
    gap: 1.2rem;
  }
  .stats-left {
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
    width: 100%;
  }
  .stat-number {
    font-size: 2.5rem;
  }
  .stat-desc {
    font-size: 1rem;
    max-width: 95vw;
  }
  .stats-illustration {
    max-width: 90vw;
  }
}
</style>