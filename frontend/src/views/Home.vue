<template>
  <div class="app">
    <header class="header">
      <AppLogo />

      <!-- Botones de autenticación -->
      <div class="auth-buttons" v-if="!isLoggedIn">
        <button @click="goTo('register')">REGISTRO</button>
        <button @click="goTo('login')">LOGIN</button>
      </div>

      <!-- Botones de perfil y logout -->
      <div class="auth-buttons" v-else>
        <button @click="goToProfile">Ir a mi perfil</button>
        <button v-if="isLoggedIn" @click="handleLogout">Cerrar sesión</button>
      </div>
    </header>

    <main class="form-section">

      <!-- Interruptor de vista -->
      <div class="toggle-switch">
        <label class="switch-label">
          <input type="checkbox" class="checkbox" v-model="isCompany" />
          <span class="slider">
            <span class="switch-text left" :class="{ active: !isCompany }">DEVS</span>
            <span class="switch-text right" :class="{ active: isCompany }">EMPRESAS</span>
          </span>
        </label>
      </div>

      <!-- Sección de empresa -->
      <div v-if="isCompany">
        <div class="company-section">
          <div class="company_mockups">
            <img :src="companyIphone" alt="iPhone Mockup" />
          </div>
          <div class="company_text">
            <h2>Encuentra devs <br>que encajan en tu stack</h2>
            <p>Desarrolladores con las skills que tu equipo necesita. <br class="hide-on-mobile">Sin rodeos.</p>
          </div>
        </div>
        <div class="company-whyus-wrapper">
          <CompanyWhyUs />
        </div>
        <div class="company-stats-wrapper">
          <CompanyStats />
        </div>
        <div class="top-developers-wrapper">
          <TopDevelopers />
        </div>
        <Footer />

      </div>
      
      <!-- Sección de desarrolladores -->
      <div v-else class="devs-section">
        <h2>Encuentra ofertas <br>hechas para tu stack</h2>
        <p>Donde devs y tecnologías hacen match.</p>
        
        <div class="devs_mockups">
          <img :src="devsMacbook" alt="Hero Image" />
          <img :src="devsIphone" alt="Hero Image" />
        </div>
        
        <div class="skills-showcase-wrapper">
          <SkillsShowcase />
        </div>
        <div class="top-companies-wrapper">
          <TopCompanies />
        </div>
        <div class="top-tech-wrapper">
          <TopTech />
        </div>
        <Footer />
        
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppLogo from '../components/AppLogo.vue';
import { logout, getMe } from '../services/auth.js';

import devsMacbook from '../assets/devs_macbook.svg';
import devsIphone from '../assets/devs_iphone.svg';
import companyIphone from '../assets/company_iphone.svg';

import SkillsShowcase from '/src/components/SkillsShowcase.vue'
import TopCompanies from '/src/components/TopCompanies.vue';
import TopTech from '/src/components/TopTech.vue';
import Footer from '/src/components/Footer.vue';
import CompanyWhyUs from '../components/CompanyWhyUs.vue';
import CompanyStats from '../components/CompanyStats.vue';
import TopDevelopers from '../components/TopDevelopers.vue';

const isCompany = ref(false);
const router = useRouter();

const isLoggedIn = ref(false);
const userRole = ref('');

// Cargar los datos del usuario al iniciar
getMe().then(() => isLoggedIn.value = true).catch(() => isLoggedIn.value = false)

async function handleLogout() {
  await logout()
  router.push({ name: 'login' })
}

const goTo = (type) => {
  router.push({ name: type, query: { role: isCompany.value ? 'company' : 'developer' } });
};

// Redirigir al perfil según el rol del usuario
const goToProfile = () => {
  if (userRole.value === 'company') {
    router.push({ name: 'company-profile' });
  } else if (userRole.value === 'admin') {
    router.push({ name: 'admin-profile' });
  } else {
    router.push({ name: 'dev-profile' });
  }
};

// Verificar si el usuario está autenticado y su rol
const checkAuth = async () => {
  try {
    const { data } = await getMe();
    isLoggedIn.value = true;
    userRole.value = data.role;
    // Si es company, mostrar la vista de empresa por defecto
    isCompany.value = data.role === 'company';
  } catch {
    isLoggedIn.value = false;
    userRole.value = '';
    isCompany.value = false;
  }
};

onMounted(() => {
  checkAuth();
});

</script>

<style lang="scss" scoped>

.app {
  font-family: sans-serif;
  min-height: 100vh;
  height: auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}
.logo {
  font-weight: bold;
  font-size: 1.5rem;
}

.auth-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
}

.auth-buttons button {
    margin-left: 0.5rem;
    color: var(--green-light);
    background-color: transparent;
    border: 1px solid var(--green-light);
    &:hover {
      background-color: var(--green-light);
      color: var(--black);
    }
  }


.skills-showcase-wrapper {
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    padding: 0;
}

.top-tech-wrapper {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  padding: 0;
}

.form-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
  
  h2 {
    color: var(--white);
    font-size: 64px;
    line-height: 60px;
    font-weight: 500;
    margin-bottom: 1rem;
  }
  p {
    color: var(--white);
    font-size: 20px;
    line-height: 30px;
    font-weight: 400;
    margin-top: 1rem;
  }
}

.company-section {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;


  .company_mockups {
    display: flex;
    justify-content: center;
    img {
      width: 100%;
      max-width: 400px;
      z-index: 3;
    }
  }
  .company_text {
    max-width: 500px;
    text-align: left;
    margin-top: 150px;
    h2 {
      font-weight: 500;
    }
    p {
      font-size: 20px;
      line-height: 20px;
      font-weight: 400;
    }
  }
}

.devs_mockups {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin-top: -70px;
  position: relative;
}

.devs_mockups img:first-child {
  z-index: 1;
  position: relative;
  top: 18px;
}

.devs_mockups img:last-child {
  max-width: 40vw;
  margin-left: -250px;
  z-index: 2;
}

.toggle-switch {
  position: relative;
  width: 245px;
  height: 45px;
  margin: 0 1rem;
  --light: var(--green-light);
  --dark: var(--black);
}

.switch-label {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--dark);
  cursor: pointer;
  border: 2px solid var(--dark);
  display: block;
}

.checkbox {
  position: absolute;
  display: none;
}

.slider {
  position: absolute;
  width: 95%;
  height: 100%;
  border-radius: 50px;
  border: 1px solid var(--green-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 400;
  color: var(--green-light);
  user-select: none;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
}

.switch-text {
  z-index: 2;
  flex: 1 1 0;
  text-align: center;
  opacity: 0.7;
  transition: opacity 0.3s, color 0.3s;
  padding: 0 8px;
  &.active {
    opacity: 1;
    color: var(--dark);
  }
}

.slider::before {
  content: "";
  position: absolute;
  width: 50%;
  height: 40px;
  border-radius: 50px;
  background-color: var(--light);
  transition: transform 0.3s;
  z-index: 1;
}

.checkbox:checked ~ .slider::before {
  transform: translateX(115px);
}

.checkbox:not(:checked) ~ .slider::before {
  transform: translateX(0);
}

.company-whyus-wrapper {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-top: -220px;
  z-index: 2;
}

.top-developers-wrapper {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  padding: 0;
}

//Responsive styles

@media (max-width: 900px) {
  .devs_mockups {
    flex-direction: column;
    align-items: center;
    height: auto;
    margin-top: 0;
  }
  
  .devs_mockups img:first-child {
    display: none; // Oculta Macbook
  }
  .devs_mockups img:last-child {
    max-width: 80vw;
    margin-left: 0;
    display: block;
    margin-top: 0; 
  }
  .form-section h2 {
    font-size: 40px;
    line-height: 40px;
  }
  
  .form-section p {
    text-align: center;
    font-size: 16px;
    
  }
  .company-whyus-wrapper {
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    margin-top: -250px;
    z-index: 2;
  }
}

@media (max-width: 600px) {
  .auth-buttons {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 0.7rem;
  }
  .devs_mockups img:last-child {
    max-width: 95vw;
    margin-top: -70px; 
  }
}

@media (max-width: 900px) {
  .hide-on-mobile {
    display: none;
  }
  .company-section {
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .company_mockups {
      order: 2;
      margin-top: 1.5rem;
      img {
        max-width: 80vw;
        margin: 0 auto;
        display: block;
        margin-top: -70px; 
      }
    }
    .company_text {
      order: 1;
      margin-top: 0;
      text-align: center;
      max-width: 100%;
      h2 {
        font-size: 40px;
        line-height: 40px;
      }
      p {
        font-size: 16px;
      }
    }
  }
}

@media (max-width: 600px) {
  .company-section .company_mockups img {
    max-width: 95vw;
    margin-top: -70px;
  }
  .company-section .company_text h2 {
    font-size: 40px;
    line-height: 40px;
  }
  .company-section .company_text p {
    font-size: 16px;
  }
}

</style>
