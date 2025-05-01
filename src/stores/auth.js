import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: null,
  }),

  actions: {
    async checkAuth() {
      try {
        const response = await axios.get('/api/check_login.php', {
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

    async logout() {
      await axios.get('/api/logout.php', {
        withCredentials: true,
      })
      this.clearAuthData()
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

    async updateAvatar(file) {
      try {
        const formData = new FormData()
        formData.append('avatar', file)
        formData.append('user_id', this.user.id)

        const response = await axios.post('/api/upload_avatar.php', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        })

        if (response.data.status === 'success') {
          this.user.avatar = response.data.avatar + '?t=' + Date.now()
          return true
        }
        return false
      } catch (error) {
        console.error('Avatar upload error:', error.response?.data || error.message)
        throw error
      }
    },
  },
})
