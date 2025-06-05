import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const Login = () => import('@/components/Login.vue')
const Dashboard = () => import('@/components/Dashboard.vue')
const Settings = () => import('@/components/Settings.vue')
const Layout = () => import('@/components/Layout.vue')
const Users = () => import('@/components/Users.vue')
const HRPanel = () => import('@/components/HR/HRPanel.vue')
const UsersList = () => import('@/components/UsersList.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresGuest: true, title: 'Вход' },
    },
    {
      path: '/',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: Dashboard,
          meta: { title: 'Главная' },
        },
        {
          path: 'settings',
          name: 'Settings',
          component: Settings,
          meta: { title: 'Настройки' },
        },
        {
          path: 'users',
          name: 'Users',
          component: Users,
          meta: { title: 'Сотрудники' },
        },
        {
          path: 'hr',
          name: 'HRPanel',
          component: HRPanel,
          meta: { title: 'HR панель', allowedRoles: ['Admin', 'HR'] },
          children: [
            {
              path: '',
              name: 'UsersList',
              component: UsersList,
              props: {
                isHrView: true,
              },
            },
            {
              path: 'new-employee',
              name: 'NewEmployee',
              component: () => import('@/components/HR/RegisterEmployee.vue'),
              meta: { title: 'Новый сотрудник' },
            },
            {
              path: 'edit/:id',
              name: 'HREditProfile',
              component: () => import('@/components/HR/HREditProfile.vue'),
              meta: { title: 'Редактирование сотрудника' },
              props: (route) => ({ employeeId: route.params.id }),
            },
            {
              path: 'turnstile',
              name: 'HRTurnstile',
              component: () => import('@/components/HR/HRTurnstile.vue'),
              meta: { title: 'Имитирование турникета' },
            },
          ],
        },
        {
          path: 'timesheet',
          name: 'Timesheet',
          component: () => import('@/components/Timesheet.vue'),
          meta: { title: 'Табель', allowedRoles: ['Admin', 'HR'] },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | TimeTracker` : 'TimeTracker'
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!to.meta.requiresAuth && !to.meta.requiresGuest) {
    return true
  }

  if (!authStore.isLoggedIn) {
    await authStore.checkAuth()
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresGuest && authStore.isLoggedIn) {
    return '/dashboard'
  }

  if (to.meta.requiresAuth) {
    if (!authStore.isLoggedIn) {
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      }
    }

    const allowedRoles = to.meta.allowedRoles
    if (allowedRoles) {
      const userRole = authStore.user?.role_name
      if (!userRole || !allowedRoles.includes(userRole)) {
        return { path: '/', query: { error: 'forbidden' } }
      }
    }
  }
})

export default router
