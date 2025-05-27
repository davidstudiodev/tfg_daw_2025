import { createRouter, createWebHistory } from 'vue-router'
import Home from '../src/views/Home.vue'
import Login from '../src/views/Login.vue'
import Register from '../src/views/Register.vue'
import DevProfile from '../src/views/DevProfile.vue'
import CompanyProfile from '../src/views/CompanyProfile.vue'
import NotFound from '../src/views/NotFound.vue'
import Offers from '../src/views/Offers.vue'

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
  { 
    path: '/offers', 
    name: 'offers', component: Offers 
  },
  { path: '/:pathMatch(.*)*', 
    name: 'not-found', component: NotFound 
  },
  {
    path: '/developers',
    name: 'developers',
    component: () => import('../src/views/Developers.vue')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../src/views/ResetPassword.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {

  // Si el usuario está autenticado y va a una ruta de login o register, redirigir según su rol
  if (['login', 'register'].includes(to.name)) {
    try {
      const { data: user } = await getMe()
      if (user.role === 'dev') return next({ name: 'dev-profile' })
      if (user.role === 'company') return next({ name: 'company-profile' })
    } catch {
      // No autenticado, puede ir a login/register
      return next()
    }
    return next()
  }

  // Si la ruta requiere autenticación, verificar el rol del usuario
  if (to.meta.requiresAuth) {
    try {
      const { data: user } = await getMe()
      if (user.role !== to.meta.role) throw new Error('Unauthorized role')
      return next()
    } catch {
      return next({ name: 'login', query: { role: to.meta.role } })
    }
  }

  // Para el resto de rutas públicas
  return next()
})

export default router
