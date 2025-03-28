import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Импортируем компоненты страниц
const Login = () => import('@/components/Login.vue')
const Dashboard = () => import('@/components/Dashboard.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresGuest: true }, // Доступно только для НЕавторизованных
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }, // Требуется авторизация
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard', // Редирект для несуществующих путей
    },
  ],
})

// Глобальная проверка доступа
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login') // Перенаправляем на логин
  } else if (to.meta.requiresGuest && authStore.isLoggedIn) {
    next('/dashboard') // Если уже авторизован, не пускаем на логин
  } else {
    next() // Разрешаем переход
  }
})

export default router
