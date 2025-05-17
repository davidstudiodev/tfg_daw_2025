import { createRouter, createWebHistory } from 'vue-router'
import Home from '../src/views/Home.vue'
import Login from '../src/views/Login.vue'
import Register from '../src/views/Register.vue'
import DevProfile from '../src/views/DevProfile.vue'
import CompanyProfile from '../src/views/CompanyProfile.vue'

import { decodeToken } from '../src/services/auth' // función que definiste

const routes = [
  { 
    path: '/', 
    name: 'home',
    component: Home },
  { 
    path: '/login', 
    name: 'login',
    component: Login, 
    props: route => ({ role: route.query.role }) },
  { 
    path: '/register', 
    name: 'register',
    component: Register, 
    props: route => ({ role: route.query.role }) },
  {
    path: '/dev/profile',
    name: 'dev-profile',
    component: DevProfile,
    meta: { requiresAuth: true, role: 'dev' }
  },
  {
    path: '/company/profile',
    name: 'company-profile',
    component: CompanyProfile,
    meta: { requiresAuth: true, role: 'company' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) return next()

  const token = localStorage.getItem('token')
  if (!token) {
    return next({ path: '/login', query: { role: to.meta.role } })
  }

  const decoded = decodeToken(token)
  if (!decoded || decoded.role !== to.meta.role) {
    // token inválido o rol distinto: fuerza login
    return next({ path: '/login', query: { role: to.meta.role } })
  }

  // tdo ok: el token es válido y el rol coincide
  next()
})

export default router
