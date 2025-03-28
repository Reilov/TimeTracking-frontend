import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    returnUrl: null,
  }),

  actions: {
    async login(email, password) {
      try {
        const response = await axios.post('http://backenddiplom/login.php', {
          email,
          password,
        })

        if (response.data.status === 'success') {
          this.setAuthData(response.data)
          return true
        }
        return false
      } catch (error) {
        console.error('Login error:', error)
        this.clearAuthData()
        throw error
      }
    },

    logout() {
      this.clearAuthData()
    },

    checkAuth() {
      try {
        const token = localStorage.getItem('authToken')
        const user = localStorage.getItem('user')

        if (token && user) {
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
