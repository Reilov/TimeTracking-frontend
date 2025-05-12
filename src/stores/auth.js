import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false,
  }),

  actions: {
    async checkAuth() {
      try {
        const response = await axios.get('/api/check-login', {
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
      this.isLoggedIn = null
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
  },
})
