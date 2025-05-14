<template>
  <div class="app">
    <header class="header">
      <div class="logo">jobsxdevs</div>

      <div class="toggle-container">
        <label>
          <input type="checkbox" v-model="isCompany" />
          <span>{{ isCompany ? 'Empresa' : 'Developer' }}</span>
        </label>
      </div>

      <div class="auth-buttons">
        <button @click="goTo('login')">Login</button>
        <button @click="goTo('register')">Register</button>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const isCompany = ref(false);
const router = useRouter();

const goTo = (type) => {
  router.push({ name: type, query: { role: isCompany.value ? 'company' : 'developer' } });
};
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
