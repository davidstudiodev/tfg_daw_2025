<template>
  <section class="company-whyus">
    <div class="whyus-header">
      <h2>Nos enfocamos en tech. Nada más. Nada menos.</h2>
      <p>Solo desarrolladores. Solo tecnología. Sin distracciones.</p>
    </div>
    <div class="whyus-features">
      <div class="whyus-feature" v-for="(item, i) in features" :key="i">
        <div class="icon-circle">
          <span class="material-icons-outlined">{{ item.icon }}</span>
        </div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    icon: 'handshake',
    title: 'Match tech real',
    text: 'Te conectamos con devs que ya dominan tu stack.'
  },
  {
    icon: 'schedule',
    title: 'Ahorra tiempo',
    text: 'Recibe solo candidatos que cumplen con tus requisitos.'
  },
  {
    icon: 'public',
    title: 'Talento local o remoto',
    text: 'Publica tu oferta según tu modelo de trabajo ideal.'
  },
  {
    icon: 'verified_user',
    title: 'Perfiles verificados',
    text: 'Analizamos skills y experiencia para mostrarte solo talento relevante.'
  }
]
</script>

<style scoped>
.company-whyus {
  width: 100%;
  background: var(--white, #fff);
  border-top-left-radius: 60px;
  border-top-right-radius: 61px;
  padding: 3.5rem 3rem 3rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto 2.5rem auto;
}

.whyus-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.whyus-header h2 {
  font-size: 3rem;
  font-family: 'Red Hat Text', sans-serif;
  font-weight: 500;
  color: var(--black, #181a1b);
  line-height: 1.1;
  margin-bottom: 0.7rem;
}

.whyus-header p {
  color: var(--black, #181a1b);
  font-size: 1.3rem;
  font-weight: 400;
  margin: 0;
}

.whyus-features {
  display: flex;
  gap: 2.5rem;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  max-width: 1100px;
  flex-wrap: wrap;
}

.whyus-feature {
  border-radius: 24px;
  padding: 2.2rem 1.5rem 1.5rem 1.5rem;
  flex: 1 1 220px;
  max-width: 250px;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.1rem;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50px;
  background: var(--green-light, #c4f63f);
  border: 1px solid var(--black, #181a1b);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.7rem;
  box-shadow: 0 1px 4px #0001;
}

.icon-circle .material-icons-outlined {
  font-size: 2rem;
  color: var(--black, #181a1b);
  font-weight: 200;
}

.whyus-feature h3 {
  font-size: 1.5rem;
  font-family: 'Red Hat Text', sans-serif;
  font-weight: 600;
  color: var(--black, #181a1b);
  margin: 0;
  line-height: 1.1;
}

.whyus-feature p {
  font-size: 1rem;
  color: var(--black, #181a1b);
  margin: 0;
  font-weight: 300;
  line-height: 1.3;
}

/* Responsive tablet */
@media (max-width: 900px) {
  .whyus-header h2 {
    font-size: 2rem;
  }
  .whyus-header p {
    font-size: 1.1rem;
  }
  .whyus-features {
    gap: 1.5rem;
    max-width: 700px;
  }
  .whyus-feature {
    max-width: 45vw;
    min-width: 140px;
    padding: 1.5rem 1rem 1rem 1rem;
  }
}

/* Responsive mobile */
@media (max-width: 600px) {
  .company-whyus {
    padding: 2rem 0 1.5rem 0;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
  }
  .whyus-header h2 {
    font-size: 2rem;
    padding: 1rem;
    margin-top: 4rem;   
  }
  .whyus-header p {
    font-size: 1.4rem;
    padding: 0.5rem;
  }
  .whyus-features {
    flex-direction: column;
    gap: 0rem;
    align-items: center;
  }
  .whyus-feature {
    max-width: 100vw;
    min-width: 0;
    padding: 1.2rem 0.7rem 0.7rem 0.7rem;
  }
    .whyus-feature h3 {
        font-size: 1.6rem;
    }
    .whyus-feature p {
        font-size: 1.2rem;
    }
  .icon-circle {
    width: 60px;
    height: 60px;
  }
  .icon-circle .material-icons-outlined {
    font-size: 1.7rem;
  }
}
</style>