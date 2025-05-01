import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const Login = () => import('@/components/Login.vue')
const Dashboard = () => import('@/components/Dashboard.vue')
const Settings = () => import('@/components/Settings.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: { requiresGuest: true, title: 'Login' },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true, title: 'Dashboard' },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: { requiresAuth: true, title: 'Settings' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    },
  ],
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | TimeTracker` : 'TimeTracker'
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.isLoggedIn === null) {
    await authStore.checkAuth()
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/')
  } else if (to.meta.requiresGuest && authStore.isLoggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
