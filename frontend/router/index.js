import { createRouter, createWebHistory } from 'vue-router'
import Home from '../src/views/Home.vue'
import Login from '../src/views/Login.vue'
import Register from '../src/views/Register.vue'
import DevProfile from '../src/views/DevProfile.vue'
import CompanyProfile from '../src/views/CompanyProfile.vue'
import NotFound from '../src/views/NotFound.vue'

import { getMe } from '../src/services/auth.js' // obtenemos el usuario desde la cookie HttpOnly

const routes = [
  { path: '/', name: 'home', component: Home },
  { 
    path: '/login', name: 'login', component: Login, 
    props: route => ({ role: route.query.role })
  },
  { 
    path: '/register', name: 'register', component: Register, 
    props: route => ({ role: route.query.role })
  },
  {
    path: '/dev/profile', name: 'dev-profile', component: DevProfile,
    meta: { requiresAuth: true, role: 'dev' }
  },
  {
    path: '/company/profile', name: 'company-profile', component: CompanyProfile,
    meta: { requiresAuth: true, role: 'company' }
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) return next()

  try {
    const { data: user } = await getMe()
    if (user.role !== to.meta.role) throw new Error('Unauthorized role')
    next()
  } catch {
    next({ name: 'login', query: { role: to.meta.role } })
  }
})

export default router
