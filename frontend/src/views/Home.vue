<template>
  <div class="app">
    <header class="header">
      <AppLogo />

      <div class="toggle-container">
        <label>
          <input type="checkbox" v-model="isCompany" />
          <span>{{ isCompany ? 'Empresa' : 'Developer' }}</span>
        </label>
      </div>

      <div class="auth-buttons" v-if="!isLoggedIn">
        <button @click="goTo('login')">Login</button>
        <button @click="goTo('register')">Register</button>
      </div>
      <div class="auth-buttons" v-else>
        <button @click="goToProfile">Ir a mi perfil</button>
        <button v-if="isLoggedIn" @click="handleLogout">Cerrar sesión</button>
      </div>
    </header>

    <main class="form-section">
      <div v-if="isCompany">
        <h2>Vista de Empresa</h2>
        <!-- Aquí irá el formulario de empresa -->
      </div>
      <div v-else>
        <h2>Vista de Developer</h2>
        <!-- Aquí irá el formulario de developer -->
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppLogo from '../components/AppLogo.vue';
import { logout, getMe } from '../services/auth.js';

const isCompany = ref(false);
const router = useRouter();

const isLoggedIn = ref(false);
const userRole = ref('');

getMe().then(() => isLoggedIn.value = true).catch(() => isLoggedIn.value = false)

async function handleLogout() {
  await logout()
  router.push({ name: 'login' })
}

const goTo = (type) => {
  router.push({ name: type, query: { role: isCompany.value ? 'company' : 'developer' } });
};

const goToProfile = () => {
  if (userRole.value === 'company') {
    router.push({ name: 'company-profile' });
  } else {
    router.push({ name: 'dev-profile' });
  }
};

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

<style scoped>
.app {
  font-family: sans-serif;
  min-height: 100vh;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #f4f4f4;
}
.logo {
  font-weight: bold;
  font-size: 1.5rem;
}
.toggle-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.auth-buttons button {
  margin-left: 0.5rem;
}
.form-section {
  padding: 2rem;
  text-align: center;
}
</style>
