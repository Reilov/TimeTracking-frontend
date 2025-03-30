import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false,
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

    async updateAvatar(file) {
      try {
        const formData = new FormData()
        formData.append('avatar', file)
        formData.append('user_id', this.user.id)

        const response = await axios.post('http://backenddiplom/upload_avatar.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        if (response.data.status === 'success') {
          // Обновляем локальное состояние
          this.user.avatar = response.data.avatar + '?t=' + Date.now()

          // Обновляем localStorage
          const userData = JSON.parse(localStorage.getItem('user'))
          userData.avatar = response.data.avatar
          localStorage.setItem('user', JSON.stringify(userData))

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
