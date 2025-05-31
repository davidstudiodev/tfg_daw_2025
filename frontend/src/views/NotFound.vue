<template>
  <div class="not-found-container">
    <h1>404</h1>
    <p>Página no encontrada</p>
    <router-link to="/" class="home-link">
      <span class="material-icons-outlined">arrow_back</span>
      Volver al inicio
    </router-link>
  </div>
</template>

<script setup>
// No logic needed
</script>

<style scoped>
.not-found-container {
  text-align: center;
  margin-top: 8rem;
  background: var(--black);
  color: var(--white);
  padding: 3rem 2rem 4rem 2rem;
  border-radius: 24px;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 12px #0002;
}
.not-found-container h1 {
  font-size: 5rem;
  color: var(--green-light);
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: 2px;
}
.not-found-container p {
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  color: var(--white);
}
.home-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--green-light);
  color: var(--black);
  padding: 0.8rem 2.2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  border: 1px solid var(--green-light);
  transition: background 0.2s, color 0.2s;
}
.home-link .material-icons-outlined {
  font-size: 22px;
}
.home-link:hover {
  background: transparent;
  color: var(--green-light);
  border: 1px solid var(--green-light);
}
</style>