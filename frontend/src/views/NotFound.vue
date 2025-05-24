<template>
  <div class="not-found-container">
    <h1>404</h1>
    <p>Página no encontrada</p>
    <router-link to="/" class="home-link">Volver al inicio</router-link>
  </div>
</template>

<script setup>
// No logic needed
</script>

<style scoped>
.not-found-container {
  text-align: center;
  margin-top: 5rem;
}
.not-found-container h1 {
  font-size: 6rem;
  color: #1976d2;
}
.not-found-container p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}
.home-link {
  color: #fff;
  background: #1976d2;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.2s;
}
.home-link:hover {
  background: #125199;
}
</style>
