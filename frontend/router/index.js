// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../src/views/Home.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
//   { path: '/login', name: 'login', component: () => import('../src/views/Login.vue') },
//   { path: '/register', name: 'register', component: () => import('../src/views/Register.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
