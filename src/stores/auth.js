import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    isLoggingOut: false,
  }),

  actions: {
    async checkAuth() {
      if (this.isLoggingOut) return false

      try {
        const response = await api.get('/check-login', {
          withCredentials: true,
        })

        if (response.data.status === 'success') {
          this.user = response.data.user
          this.isLoggedIn = true
          return true
        }

        this.isLoggedIn = false
        return false
      } catch (error) {
        console.error('Auth check error:', error)
        this.clearAuthData()
        return false
      }
    },

    setAuthData(user) {
      this.user = user
      this.isLoggedIn = true
    },

    clearAuthData() {
      this.user = null
      this.isLoggedIn = false
    },

    updateProfileData(profileData) {
      this.user = {
        ...this.user,
        ...profileData,
      }
    },

    setUser(userData) {
      this.user = { ...this.user, ...userData }
    },

    async logout() {
      if (this.isLoggingOut) return // Защита от повторного вызова

      this.isLoggingOut = true
      try {
        await api.post('/logout', {}, { withCredentials: true })
        this.clearAuthData()
      } finally {
        this.isLoggingOut = false
      }
    },
  },
})
