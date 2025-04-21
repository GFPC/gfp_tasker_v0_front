import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/services/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('access_token') || null)
  const loading = ref(false)
  const error = ref(null)

  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('access_token', newToken)
    } else {
      localStorage.removeItem('access_token')
    }
  }

  const login = async (credentials) => {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.login(credentials)
      if (response.data.access_token) {
        setToken(response.data.access_token)
        await fetchCurrentUser()
        return response
      }
      throw new Error('No access token received')
    } catch (err) {
      error.value = err.response?.data?.detail || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.register(userData)
      if (response.data.access_token) {
        setToken(response.data.access_token)
        await fetchCurrentUser()
        return response
      }
      throw new Error('No access token received')
    } catch (err) {
      error.value = err.response?.data?.detail || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await authApi.logout()
      setToken(null)
      user.value = null
      router.push('/login')
    } catch (err) {
      error.value = err.response?.data?.detail || 'Logout failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCurrentUser = async () => {
    if (!token.value) return
    loading.value = true
    try {
      const response = await authApi.getCurrentUser()
      user.value = response.data
    } catch (err) {
      setToken(null)
      user.value = null
      router.push('/login')
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    fetchCurrentUser,
  }
}) 