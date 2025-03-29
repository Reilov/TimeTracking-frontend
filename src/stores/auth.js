import { defineStore } from 'pinia'
// import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    returnUrl: null,
  }),

  actions: {
    logout() {
      this.clearAuthData()
    },

    checkAuth() {
      try {
        const token = localStorage.getItem('authToken')
        const user = localStorage.getItem('user')

        if (token && user) {
          this.user = JSON.parse(user)
          this.isLoggedIn = true
          return true
        }
        return false
      } catch (error) {
        console.error('Auth check error:', error)
        this.clearAuthData()
        return false
      }
    },

    // Вспомогательные методы
    setAuthData(authData) {
      this.user = authData.user
      this.isLoggedIn = true
      localStorage.setItem('authToken', authData.token)
      localStorage.setItem('user', JSON.stringify(authData.user))
    },

    clearAuthData() {
      this.user = null
      this.isLoggedIn = false
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    },
  },
})
